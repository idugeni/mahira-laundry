"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, STAFF_ROLES, SUPERADMIN_ROLES } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

const TopUpBalanceSchema = z.object({
	customerId: z.string().uuid(),
	amount: z.number().positive().max(100_000_000),
	notes: z.string().max(500).optional(),
});

const SettleRoyaltySchema = z.object({
	outletId: z.string().uuid(),
	amount: z.number().positive().max(1_000_000_000),
	month: z.number().int().min(1).max(12),
	year: z.number().int().min(2020).max(2100),
	proofUrl: z.string().url().optional(),
	notes: z.string().max(500).optional(),
});

const RecordIncomeSchema = z.object({
	amount: z.number().positive().max(1_000_000_000),
	description: z.string().min(1).max(500),
	outletId: z.string().uuid(),
	date: z.string().min(1).max(40),
});

/**
 * Top up customer balance
 * Processed by Cashier/Admin
 */
export async function topUpBalance(customerId: string, amount: number, notes?: string) {
	try {
		const parsed = TopUpBalanceSchema.parse({ customerId, amount, notes });
		const { user: actor } = await requireRole(
			STAFF_ROLES,
			"Akses kasir/admin diperlukan untuk top up saldo.",
		);
		const admin = createAdminClient();

		const { data: profile, error: profileError } = await admin
			.from("profiles")
			.select("balance")
			.eq("id", parsed.customerId)
			.single();

		if (profileError) throw profileError;

		const newBalance = Number(profile.balance || 0) + parsed.amount;

		// 2. Create transaction log
		const { error: logError } = await admin.from("deposit_transactions").insert({
			profile_id: parsed.customerId,
			amount: parsed.amount,
			type: "topup",
			notes: parsed.notes || "Top up saldo manual",
			actor_id: actor.id,
		});

		if (logError) throw logError;

		// 3. Update balance
		const { error: updateError } = await admin
			.from("profiles")
			.update({ balance: newBalance })
			.eq("id", parsed.customerId);

		if (updateError) throw updateError;

		revalidatePath("/customer");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
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
		await requireRole(SUPERADMIN_ROLES, "Akses superadmin diperlukan untuk settlement royalty.");
		const parsed = SettleRoyaltySchema.parse(data);
		const supabase = await createClient();

		const { error } = await supabase.from("franchise_payouts").upsert({
			outlet_id: parsed.outletId,
			amount: parsed.amount,
			period_month: parsed.month,
			period_year: parsed.year,
			status: "paid",
			proof_url: parsed.proofUrl,
			notes: parsed.notes,
		});

		if (error) throw error;

		revalidatePath("/franchise");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
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
		const parsed = RecordIncomeSchema.parse(data);
		const { supabase, user } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses ditolak. Hanya superadmin yang dapat mencatat pemasukan.",
		);

		const { error } = await supabase.from("income").insert({
			outlet_id: parsed.outletId,
			description: parsed.description,
			amount: parsed.amount,
			date: parsed.date,
			actor_id: user.id,
		});

		if (error) throw error;

		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}
