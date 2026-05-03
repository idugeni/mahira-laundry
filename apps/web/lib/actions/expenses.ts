"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MANAGER_ROLES, requireRole } from "@/lib/auth/guards";
import type { ActionResponse } from "@/lib/types";

export type ExpenseInput = {
	id?: string;
	outlet_id: string;
	category: string;
	amount: number;
	notes?: string;
	proof_url?: string;
};

const ExpenseInputSchema = z.object({
	id: z.string().uuid().optional(),
	outlet_id: z.string().uuid(),
	category: z.string().min(1).max(120),
	amount: z.number().positive().max(1_000_000_000),
	notes: z.string().max(1_000).optional(),
	proof_url: z.string().url().optional(),
});

export async function addExpense(data: ExpenseInput): Promise<ActionResponse> {
	try {
		const parsed = ExpenseInputSchema.parse(data);
		const { supabase, user, role, outletId } = await requireRole(
			MANAGER_ROLES,
			"Akses manager diperlukan untuk mencatat pengeluaran.",
		);
		if (role !== "superadmin" && outletId !== parsed.outlet_id) {
			return { success: false, error: "Akses outlet ditolak." };
		}

		const { error } = await supabase.from("expenses").insert({
			outlet_id: parsed.outlet_id,
			category: parsed.category,
			amount: parsed.amount,
			title: parsed.category || "Expenses",
			description: parsed.notes,
			receipt_url: parsed.proof_url,
			actor_id: user.id,
		});

		if (error) throw error;

		revalidatePath("/laporan");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}

export async function deleteExpense(id: string): Promise<ActionResponse> {
	try {
		const parsedId = z.string().uuid().parse(id);
		const { supabase, role, outletId } = await requireRole(
			MANAGER_ROLES,
			"Akses manager diperlukan untuk menghapus pengeluaran.",
		);
		let query = supabase.from("expenses").delete().eq("id", parsedId);
		if (role !== "superadmin" && !outletId) {
			return { success: false, error: "Akses outlet ditolak." };
		}
		if (role !== "superadmin" && outletId) {
			query = query.eq("outlet_id", outletId);
		}
		const { error } = await query;
		if (error) throw error;

		revalidatePath("/laporan");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}

export async function uploadExpenseReceipt(
	formData: FormData,
): Promise<ActionResponse<{ url: string }>> {
	try {
		const { supabase } = await requireRole(
			MANAGER_ROLES,
			"Akses manager diperlukan untuk mengunggah bukti pengeluaran.",
		);
		const file = formData.get("image") as File;
		if (!file) throw new Error("File tidak ditemukan");
		if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
		if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 5MB.");

		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
		const filePath = `receipts/${fileName}`;

		const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabase.storage.from("receipts").getPublicUrl(filePath);

		return { success: true, data: { url: publicUrl } };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}
