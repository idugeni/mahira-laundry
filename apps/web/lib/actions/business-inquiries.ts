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

export async function submitBusinessInquiry(
	data: SubmitInquiryInput,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		// Check duplicate: same phone + package_id within 24 hours
		const twentyFourHoursAgo = new Date(
			Date.now() - 24 * 60 * 60 * 1000,
		).toISOString();

		let duplicateQuery = supabase
			.from("business_package_inquiries")
			.select("id")
			.eq("phone", data.phone)
			.gte("created_at", twentyFourHoursAgo);

		if (data.package_id) {
			duplicateQuery = duplicateQuery.eq("package_id", data.package_id);
		}

		const { data: existing, error: dupError } = await duplicateQuery.limit(1);

		if (dupError) throw dupError;

		if (existing && existing.length > 0) {
			return {
				success: false,
				error:
					"Anda sudah mengajukan inquiry untuk paket ini. Tim kami akan segera menghubungi Anda.",
			};
		}

		// INSERT inquiry with status='new'
		const { data: inquiry, error: insertError } = await supabase
			.from("business_package_inquiries")
			.insert({ ...data, status: "new" })
			.select()
			.single();

		if (insertError) throw insertError;

		// Get all superadmin user IDs
		const { data: superadmins, error: adminError } = await supabase
			.from("profiles")
			.select("id")
			.eq("role", "superadmin");

		if (adminError) throw adminError;

		// Bulk INSERT notifications for all superadmins
		if (superadmins && superadmins.length > 0) {
			const notifications = superadmins.map((admin) => ({
				user_id: admin.id,
				type: "system" as const,
				title: `Lead Baru: ${data.package_name}`,
				body: `${data.full_name} — ${data.phone}`,
			}));

			const { error: notifError } = await supabase
				.from("notifications")
				.insert(notifications);

			if (notifError) {
				// Non-fatal: log but don't fail the inquiry submission
				console.error("Failed to insert notifications:", notifError);
			}
		}

		return { success: true, data: inquiry };
	} catch (error) {
		const err = error as Error;
		console.error("submitBusinessInquiry failed:", err);
		return { success: false, error: err.message };
	}
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

		// Get current status
		const { data: current, error: fetchError } = await supabase
			.from("business_package_inquiries")
			.select("status")
			.eq("id", id)
			.single();

		if (fetchError) throw fetchError;

		const oldStatus = current?.status;

		// UPDATE status
		const { error: updateError } = await supabase
			.from("business_package_inquiries")
			.update({ status })
			.eq("id", id);

		if (updateError) throw updateError;

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) throw new Error("Unauthorized");

		// INSERT audit log
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
		console.error("updateInquiryStatus failed:", err);
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
		console.error("updateInquiryConvertedOutlet failed:", err);
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
			// Wrap in quotes to handle commas, newlines, and quotes within fields
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
		console.error("exportInquiriesCSV failed:", err);
		return { success: false, error: err.message };
	}
}
