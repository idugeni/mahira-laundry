"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

export type ExpenseInput = {
	id?: string;
	outlet_id: string;
	category: string;
	amount: number;
	notes?: string;
	proof_url?: string;
};

export async function addExpense(data: ExpenseInput): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("Unauthorized");

		const { error } = await supabase.from("expenses").insert({
			outlet_id: data.outlet_id,
			category: data.category,
			amount: data.amount,
			title: data.category || "Expenses",
			description: data.notes,
			receipt_url: data.proof_url,
			actor_id: user.id,
		});

		if (error) throw error;

		revalidatePath("/laporan");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error: any) {
		console.error("Add expense failed:", error);
		return { success: false, error: error.message };
	}
}

export async function deleteExpense(id: string): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("expenses").delete().eq("id", id);
		if (error) throw error;

		revalidatePath("/laporan");
		revalidatePath("/admin/keuangan");
		return { success: true };
	} catch (error: any) {
		console.error("Delete expense failed:", error);
		return { success: false, error: error.message };
	}
}

export async function uploadExpenseReceipt(
	formData: FormData,
): Promise<ActionResponse<{ url: string }>> {
	try {
		const supabase = await createClient();
		const file = formData.get("image") as File;
		if (!file) throw new Error("File tidak ditemukan");

		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
		const filePath = `receipts/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from("receipts")
			.upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabase.storage.from("receipts").getPublicUrl(filePath);

		return { success: true, data: { url: publicUrl } };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}
