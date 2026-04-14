"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/lib/types";

export type InventoryInput = {
  id?: string;
  outlet_id: string;
  name: string;
  sku?: string;
  category?: string;
  quantity: number;
  unit: string;
  min_stock?: number;
  notes?: string;
};

export async function upsertInventory(data: InventoryInput): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const inventoryData = {
      outlet_id: data.outlet_id,
      name: data.name,
      sku: data.sku,
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      min_stock: data.min_stock || 0,
      notes: data.notes,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (data.id) {
      result = await supabase
        .from("inventory")
        .update(inventoryData)
        .eq("id", data.id);
    } else {
      result = await supabase
        .from("inventory")
        .insert(inventoryData);
    }

    if (result.error) throw result.error;

    revalidatePath("/inventori");
    revalidatePath("/manager");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("Inventory action failed:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteInventory(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/inventori");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("Delete inventory failed:", err);
    return { success: false, error: err.message };
  }
}

export async function restockInventory(id: string, amount: number): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    
    // First get current quantity
    const { data: item, error: fetchError } = await supabase
      .from("inventory")
      .select("quantity")
      .eq("id", id)
      .single();
    
    if (fetchError) throw fetchError;

    const newQty = (Number(item?.quantity) || 0) + amount;

    const { error: updateError } = await supabase
      .from("inventory")
      .update({ 
        quantity: newQty,
        last_restocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/inventori");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("Restock inventory failed:", err);
    return { success: false, error: err.message };
  }
}
