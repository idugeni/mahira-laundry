"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

/**
 * Top up customer balance
 * Processed by Cashier/Admin
 */
export async function topUpBalance(
	customerId: string,
	amount: number,
	notes?: string,
) {
	try {
		const supabase = await createClient();
		const admin = createAdminClient();

		const {
			data: { user: actor },
		} = await supabase.auth.getUser();
		if (!actor) throw new Error("Unauthorized");

		// 1. Get current profile to get current balance
		const { data: profile, error: profileError } = await admin
			.from("profiles")
			.select("balance")
			.eq("id", customerId)
			.single();

		if (profileError) throw profileError;

		const newBalance = Number(profile.balance || 0) + amount;

		// 2. Perform Transactional Update
		// Start with creating the transaction log
		const { error: logError } = await admin
			.from("deposit_transactions")
			.insert({
				profile_id: customerId,
				amount: amount,
				type: "topup",
				notes: notes || "Top up saldo manual",
				actor_id: actor.id,
			});

		if (logError) throw logError;

		// 3. Update the profile balance
		const { error: updateError } = await admin
			.from("profiles")
			.update({ balance: newBalance })
			.eq("id", customerId);

		if (updateError) throw updateError;

		revalidatePath("/customer");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
		console.error("Top up failed:", error);
		return { success: false, error: (error as Error).message };
	}
}

/**
 * Settle Franchise Royalty
 */
export async function settleRoyalty(data: {
	outletId: string;
	amount: number;
	month: number;
	year: number;
	proofUrl?: string;
	notes?: string;
}) {
	try {
		const supabase = await createClient();

		const { error } = await supabase.from("franchise_payouts").upsert({
			outlet_id: data.outletId,
			amount: data.amount,
			period_month: data.month,
			period_year: data.year,
			status: "paid",
			proof_url: data.proofUrl,
			notes: data.notes,
		});

		if (error) throw error;

		revalidatePath("/franchise");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
		console.error("Royalty settlement failed:", error);
		return { success: false, error: (error as Error).message };
	}
}

/**
 * Record Income / Pemasukan
 * Superadmin only
 */
export async function recordIncome(data: {
	amount: number;
	description: string;
	outletId: string;
	date: string;
}): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("Unauthorized");

		// Superadmin role check
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();
		if (profile?.role !== "superadmin") {
			throw new Error(
				"Akses ditolak. Hanya superadmin yang dapat mencatat pemasukan.",
			);
		}

		const { error } = await supabase.from("income").insert({
			outlet_id: data.outletId,
			description: data.description,
			amount: data.amount,
			date: data.date,
			actor_id: user.id,
		});

		if (error) throw error;

		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
		console.error("Record income failed:", error);
		return { success: false, error: (error as Error).message };
	}
}
