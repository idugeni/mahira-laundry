"use server";

import {
	createClient,
	getBusinessPackageInquiries,
} from "@/lib/supabase/server";
import type {
	ActionResponse,
	BusinessPackageInquiry,
	InquiryFilters,
	InquiryStatus,
	SubmitInquiryInput,
} from "@/lib/types";
import { enqueueJob } from "@/lib/upstash/qstash";
import { formLimiter } from "@/lib/upstash/rate-limit";

export async function submitBusinessInquiry(
	data: SubmitInquiryInput,
): Promise<ActionResponse<BusinessPackageInquiry>> {
	const { success } = await formLimiter.limit(
		data.phone || data.email || "anonymous",
	);
	if (!success) {
		return {
			success: false,
			error: "Terlalu banyak pengajuan. Silakan coba lagi dalam beberapa saat.",
		};
	}

	try {
		const supabase = await createClient();

		if (typeof supabase.rpc !== "function") {
			return await submitBusinessInquiryViaTables(supabase, data);
		}

		const { data: _inquiryId, error: rpcError } = await supabase.rpc(
			"submit_business_inquiry_v1",
			{
				p_full_name: data.full_name,
				p_phone: data.phone,
				p_email: data.email,
				p_city: data.city,
				p_package_id: data.package_id,
				p_package_name: data.package_name,
				p_budget_range: data.budget_range,
				p_message: data.message,
			},
		);

		if (rpcError) {
			if (rpcError.message === "Duplicate inquiry") {
				return {
					success: false,
					error:
						"Anda sudah mengajukan inquiry untuk paket ini. Tim kami akan segera menghubungi Anda.",
				};
			}
			throw rpcError;
		}

		await enqueueJob("/api/jobs/inquiry-received", {
			email: data.email,
			fullName: data.full_name,
			packageName: data.package_name,
		});

		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

async function submitBusinessInquiryViaTables(
	supabase: Awaited<ReturnType<typeof createClient>>,
	data: SubmitInquiryInput,
): Promise<ActionResponse<BusinessPackageInquiry>> {
	const duplicateSince = new Date(
		Date.now() - 24 * 60 * 60 * 1000,
	).toISOString();
	let duplicateQuery = supabase
		.from("business_package_inquiries")
		.select("id")
		.eq("email", data.email)
		.eq("phone", data.phone)
		.eq("package_name", data.package_name)
		.gte("created_at", duplicateSince)
		.limit(1);

	if (data.package_id) {
		duplicateQuery = duplicateQuery.eq("package_id", data.package_id);
	}

	const { data: existingInquiries, error: duplicateError } =
		await duplicateQuery;
	if (duplicateError) throw duplicateError;

	if (existingInquiries && existingInquiries.length > 0) {
		return {
			success: false,
			error:
				"Anda sudah mengajukan inquiry untuk paket ini. Tim kami akan segera menghubungi Anda.",
		};
	}

	const { data: inquiry, error: insertError } = await supabase
		.from("business_package_inquiries")
		.insert({
			package_id: data.package_id ?? null,
			package_name: data.package_name,
			full_name: data.full_name,
			phone: data.phone,
			email: data.email,
			city: data.city,
			budget_range: data.budget_range ?? null,
			message: data.message ?? null,
			status: "new",
		})
		.select()
		.single();

	if (insertError) throw insertError;

	const { data: superadmins, error: superadminError } = await supabase
		.from("profiles")
		.select("id")
		.eq("role", "superadmin");

	if (superadminError) throw superadminError;

	if (superadmins && superadmins.length > 0) {
		const { error: notificationError } = await supabase
			.from("notifications")
			.insert(
				superadmins.map((admin) => ({
					user_id: admin.id,
					title: `Lead Baru: ${data.package_name}`,
					body: `${data.full_name} mengajukan inquiry paket usaha dari ${data.city}.`,
					type: "system",
					is_read: false,
				})),
			);

		if (notificationError) throw notificationError;
	}

	await enqueueJob("/api/jobs/inquiry-received", {
		email: data.email,
		fullName: data.full_name,
		packageName: data.package_name,
	});

	return { success: true, data: inquiry };
}

export async function getBusinessInquiries(
	filters?: InquiryFilters,
): Promise<BusinessPackageInquiry[]> {
	return getBusinessPackageInquiries(filters);
}

export async function updateInquiryStatus(
	id: string,
	status: InquiryStatus,
	note?: string,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const { data: current, error: fetchError } = await supabase
			.from("business_package_inquiries")
			.select("status")
			.eq("id", id)
			.single();

		if (fetchError) throw fetchError;

		const oldStatus = current?.status;

		const { error: updateError } = await supabase
			.from("business_package_inquiries")
			.update({ status })
			.eq("id", id);

		if (updateError) throw updateError;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) throw new Error("Unauthorized");

		const { error: logError } = await supabase
			.from("business_package_inquiry_logs")
			.insert({
				inquiry_id: id,
				changed_by: user.id,
				old_status: oldStatus,
				new_status: status,
				note: note ?? null,
			});

		if (logError) throw logError;

		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function updateInquiryConvertedOutlet(
	id: string,
	outletId: string,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const { error } = await supabase
			.from("business_package_inquiries")
			.update({ converted_outlet_id: outletId })
			.eq("id", id);

		if (error) throw error;

		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function exportInquiriesCSV(
	filters?: InquiryFilters,
): Promise<ActionResponse<string>> {
	try {
		const inquiries = await getBusinessPackageInquiries(filters);

		const header =
			"full_name,phone,email,city,package_name,status,budget_range,message,created_at";

		const escapeField = (value: string | null | undefined): string => {
			const str = value ?? "";
			return `"${str.replace(/"/g, '""')}"`;
		};

		const rows = inquiries.map((inquiry) =>
			[
				escapeField(inquiry.full_name),
				escapeField(inquiry.phone),
				escapeField(inquiry.email),
				escapeField(inquiry.city),
				escapeField(inquiry.package_name),
				escapeField(inquiry.status),
				escapeField(inquiry.budget_range),
				escapeField(inquiry.message),
				escapeField(inquiry.created_at),
			].join(","),
		);

		const csvString = [header, ...rows].join("\n");

		return { success: true, data: csvString };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
