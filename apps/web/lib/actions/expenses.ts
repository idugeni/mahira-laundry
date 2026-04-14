"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ExpenseInput = {
  id?: string;
  outlet_id: string;
  category: string;
  amount: number;
  notes?: string;
  proof_url?: string;
};

export async function addExpense(data: ExpenseInput) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("expenses")
      .insert({
        outlet_id: data.outlet_id,
        category: data.category,
        amount: data.amount,
        notes: data.notes,
        proof_url: data.proof_url,
        actor_id: user.id
      });

    if (error) throw error;

    revalidatePath("/laporan");
    return { success: true };
  } catch (error: any) {
    console.error("Add expense failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/laporan");
    return { success: true };
  } catch (error: any) {
    console.error("Delete expense failed:", error);
    return { success: false, error: error.message };
  }
}
