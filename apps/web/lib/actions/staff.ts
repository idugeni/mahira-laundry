"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

export type RegisterStaffInput = {
	id?: string;
	fullName: string;
	email: string;
	phone: string;
	role: "manager" | "kasir" | "kurir";
	outletId: string;
	password?: string;
};

async function assertSuperadmin() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Anda harus login untuk mengelola pegawai.");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "superadmin") {
		throw new Error("Akses superadmin diperlukan untuk mengelola pegawai.");
	}
}

export async function registerStaffMember(data: RegisterStaffInput): Promise<ActionResponse> {
	try {
		await assertSuperadmin();
		const admin = createAdminClient();

		if (data.id) {
			const { error: authError } = await admin.auth.admin.updateUserById(data.id, {
				email: data.email,
				user_metadata: {
					full_name: data.fullName,
					role: data.role,
					phone: data.phone,
				},
				...(data.password ? { password: data.password } : {}),
			});

			if (authError) throw authError;

			const { error: profileError } = await admin
				.from("profiles")
				.update({
					full_name: data.fullName,
					role: data.role,
					phone: data.phone,
					outlet_id: data.outletId,
				})
				.eq("id", data.id);

			if (profileError) throw profileError;
		} else {
			const { data: authUser, error: authError } = await admin.auth.admin.createUser({
				email: data.email,
				password: data.password || "Mahira123!",
				email_confirm: true,
				user_metadata: {
					full_name: data.fullName,
					role: data.role,
					phone: data.phone,
				},
			});

			if (authError) throw authError;

			if (authUser.user) {
				const { error: profileError } = await admin
					.from("profiles")
					.update({
						outlet_id: data.outletId,
					})
					.eq("id", authUser.user.id);

				if (profileError) throw profileError;
			}
		}

		revalidatePath("/pegawai");
		revalidatePath("/admin/pegawai");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function deleteStaffMember(id: string): Promise<ActionResponse> {
	try {
		await assertSuperadmin();
		const admin = createAdminClient();

		const { error: authError } = await admin.auth.admin.deleteUser(id);
		if (authError) throw authError;

		const { error: profileError } = await admin.from("profiles").delete().eq("id", id);
		if (profileError) {
			// Profile already deleted or FK cascade handled it
		}

		revalidatePath("/pegawai");
		revalidatePath("/admin/pegawai");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function getStaffPerformance(staffId: string, month: number, year: number) {
	try {
		await assertSuperadmin();
		const admin = createAdminClient();
		const start = new Date(year, month - 1, 1).toISOString();
		const end = new Date(year, month, 0, 23, 59, 59).toISOString();

		const { data: orders, error } = await admin
			.from("orders")
			.select(`
        id,
        total,
        status,
        washer_id,
        ironer_id,
        qc_id,
        order_items(quantity, unit)
      `)
			.or(`washer_id.eq.${staffId},ironer_id.eq.${staffId},qc_id.eq.${staffId}`)
			.gte("created_at", start)
			.lte("created_at", end);

		if (error) throw error;

		const stats = {
			washedKg: 0,
			ironedKg: 0,
			qcPass: 0,
			totalOrders: orders?.length || 0,
		};

		orders?.forEach((order) => {
			const kg =
				order.order_items?.reduce(
					(sum, item) => sum + (item.unit === "kg" ? Number(item.quantity) : 0),
					0,
				) || 0;

			if (order.washer_id === staffId) stats.washedKg += kg;
			if (order.ironer_id === staffId) stats.ironedKg += kg;
			if (order.qc_id === staffId) stats.qcPass += 1;
		});

		return { success: true, data: stats };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function getStaffLeaderboard(month: number, year: number) {
	try {
		await assertSuperadmin();
		const admin = createAdminClient();
		const start = new Date(year, month - 1, 1).toISOString();
		const end = new Date(year, month, 0, 23, 59, 59).toISOString();

		const { data: orders, error } = await admin
			.from("orders")
			.select(`
        id,
        washer_id,
        ironer_id,
        order_items(quantity, unit)
      `)
			.gte("created_at", start)
			.lte("created_at", end);

		if (error) throw error;

		const leaderboard: Record<string, { id: string; washed: number; ironed: number }> = {};

		orders?.forEach((order) => {
			const kg =
				order.order_items?.reduce(
					(sum, item) => sum + (item.unit === "kg" ? Number(item.quantity) : 0),
					0,
				) || 0;

			if (order.washer_id) {
				const entry = leaderboard[order.washer_id] ?? {
					id: order.washer_id,
					washed: 0,
					ironed: 0,
				};
				entry.washed += kg;
				leaderboard[order.washer_id] = entry;
			}
			if (order.ironer_id) {
				const entry = leaderboard[order.ironer_id] ?? {
					id: order.ironer_id,
					washed: 0,
					ironed: 0,
				};
				entry.ironed += kg;
				leaderboard[order.ironer_id] = entry;
			}
		});

		const userIds = Object.keys(leaderboard);
		const { data: profiles } = await admin
			.from("profiles")
			.select("id, full_name")
			.in("id", userIds);

		const result = Object.values(leaderboard)
			.map((entry) => {
				const p = profiles?.find((prof) => prof.id === entry.id);
				return {
					...entry,
					name: p?.full_name || "Unknown Staff",
				};
			})
			.sort((a, b) => b.washed + b.ironed - (a.washed + a.ironed));

		return { success: true, data: result };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
