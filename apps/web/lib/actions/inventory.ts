"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

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

export async function upsertInventory(
	data: InventoryInput,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

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
			// Get prev qty for log
			const { data: prev } = await supabase
				.from("inventory")
				.select("quantity")
				.eq("id", data.id)
				.single();

			result = await supabase
				.from("inventory")
				.update(inventoryData)
				.eq("id", data.id)
				.select()
				.single();

			if (result.data && prev) {
				await supabase.from("inventory_logs").insert({
					inventory_id: result.data.id,
					type: "adjustment",
					quantity: data.quantity - (Number(prev.quantity) || 0),
					previous_quantity: Number(prev.quantity) || 0,
					new_quantity: data.quantity,
					user_id: user?.id,
					notes: "Manual update",
				});
			}
		} else {
			result = await supabase
				.from("inventory")
				.insert(inventoryData)
				.select()
				.single();

			if (result.data) {
				await supabase.from("inventory_logs").insert({
					inventory_id: result.data.id,
					type: "in",
					quantity: data.quantity,
					previous_quantity: 0,
					new_quantity: data.quantity,
					user_id: user?.id,
					notes: "Initial stock",
				});
			}
		}

		if (result.error) throw result.error;

		revalidatePath("/inventori");
		revalidatePath("/admin/inventori");
		revalidatePath("/manager");
		return { success: true };
	} catch (error: any) {
		console.error("Inventory action failed:", error);
		return { success: false, error: error.message };
	}
}

export async function deleteInventory(id: string): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("inventory").delete().eq("id", id);
		if (error) throw error;

		revalidatePath("/inventori");
		revalidatePath("/admin/inventori");
		return { success: true };
	} catch (error: any) {
		console.error("Delete inventory failed:", error);
		return { success: false, error: error.message };
	}
}

export async function restockInventory(
	id: string,
	amount: number,
	notes?: string,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// First get current quantity
		const { data: item, error: fetchError } = await supabase
			.from("inventory")
			.select("quantity")
			.eq("id", id)
			.single();

		if (fetchError) throw fetchError;

		const prevQty = Number(item?.quantity) || 0;
		const newQty = prevQty + amount;

		const { error: updateError } = await supabase
			.from("inventory")
			.update({
				quantity: newQty,
				last_restocked_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("id", id);

		if (updateError) throw updateError;

		// Log the restock
		await supabase.from("inventory_logs").insert({
			inventory_id: id,
			type: "in",
			quantity: amount,
			previous_quantity: prevQty,
			new_quantity: newQty,
			user_id: user?.id,
			notes: notes || "Restock",
		});

		revalidatePath("/inventori");
		revalidatePath("/admin/inventori");
		return { success: true };
	} catch (error: any) {
		console.error("Restock inventory failed:", error);
		return { success: false, error: error.message };
	}
}

export async function adjustStock(
	id: string,
	amount: number,
	type: "out" | "adjustment" | "damage",
	notes?: string,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const { data: item, error: fetchError } = await supabase
			.from("inventory")
			.select("quantity")
			.eq("id", id)
			.single();

		if (fetchError) throw fetchError;

		const prevQty = Number(item?.quantity) || 0;
		const newQty = prevQty - amount;

		const { error: updateError } = await supabase
			.from("inventory")
			.update({
				quantity: newQty,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id);

		if (updateError) throw updateError;

		await supabase.from("inventory_logs").insert({
			inventory_id: id,
			type,
			quantity: -amount,
			previous_quantity: prevQty,
			new_quantity: newQty,
			user_id: user?.id,
			notes: notes || "Adjustment",
		});

		revalidatePath("/inventori");
		revalidatePath("/admin/inventori");
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function transferInventory(data: {
	sourceInventoryId: string;
	targetOutletId: string;
	amount: number;
	notes?: string;
}): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// 1. Get source item details
		const { data: source, error: sourceError } = await supabase
			.from("inventory")
			.select("*")
			.eq("id", data.sourceInventoryId)
			.single();

		if (sourceError || !source) throw new Error("Item asal tidak ditemukan");
		if (Number(source.quantity) < data.amount)
			throw new Error("Stok tidak mencukupi");

		// 2. Reduce from source
		await adjustStock(
			data.sourceInventoryId,
			data.amount,
			"out",
			`Transfer ke outlet target: ${data.notes || ""}`,
		);

		// 3. Find or Create in target outlet
		const { data: targetItems } = await supabase
			.from("inventory")
			.select("id, quantity")
			.eq("outlet_id", data.targetOutletId)
			.eq("sku", source.sku)
			.limit(1);

		let targetId;
		if (targetItems && targetItems.length > 0) {
			targetId = targetItems[0].id;
			// Add to target
			const newQty = Number(targetItems[0].quantity) + data.amount;
			await supabase
				.from("inventory")
				.update({ quantity: newQty })
				.eq("id", targetId);

			// Log for target
			await supabase.from("inventory_logs").insert({
				inventory_id: targetId,
				type: "in",
				quantity: data.amount,
				previous_quantity: Number(targetItems[0].quantity),
				new_quantity: newQty,
				user_id: user?.id,
				notes: `Transfer masuk dari outlet asal. ${data.notes || ""}`,
			});
		} else {
			// Create new in target
			const { data: newItem, error: createError } = await supabase
				.from("inventory")
				.insert({
					outlet_id: data.targetOutletId,
					name: source.name,
					sku: source.sku,
					category: source.category,
					quantity: data.amount,
					unit: source.unit,
					min_stock: source.min_stock,
					notes: `Transfer masuk. ${data.notes || ""}`,
				})
				.select()
				.single();

			if (createError) throw createError;
			targetId = newItem.id;

			await supabase.from("inventory_logs").insert({
				inventory_id: targetId,
				type: "in",
				quantity: data.amount,
				previous_quantity: 0,
				new_quantity: data.amount,
				user_id: user?.id,
				notes: "Transfer masuk (Item baru)",
			});
		}

		revalidatePath("/inventori");
		revalidatePath("/admin/inventori");
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}
