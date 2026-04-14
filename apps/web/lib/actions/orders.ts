"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse, Order, OrderStatus } from "@/lib/types";

const OrderSchema = z.object({
	customer_id: z.string().uuid().optional(),
	outlet_id: z.string().uuid(),
	pickup_address: z.string().min(5),
	delivery_address: z.string().min(5),
	delivery_type: z.enum(["pickup", "delivery", "both"]),
	notes: z.string().optional(),
	items: z
		.array(
			z.object({
				service_id: z.string().uuid(),
				service_name: z.string(),
				quantity: z.number().min(0.01),
				unit: z.string(),
				unit_price: z.number(),
				is_express: z.boolean(),
				notes: z.string().optional(),
			}),
		)
		.min(1),
});

export async function createOrder(
	formData: FormData,
): Promise<ActionResponse<Order>> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };

	try {
		const rawItems = JSON.parse(formData.get("items") as string);
		const validatedData = OrderSchema.parse({
			customer_id: formData.get("customer_id") || undefined,
			outlet_id: formData.get("outlet_id"),
			pickup_address: formData.get("pickup_address"),
			delivery_address: formData.get("delivery_address"),
			delivery_type: formData.get("delivery_type"),
			notes: formData.get("notes") || "",
			items: rawItems,
		});

		const finalCustomerId = validatedData.customer_id || user.id;
		const generatedOrderNumber = Math.random()
			.toString(36)
			.substring(2, 8)
			.toUpperCase();

		// Calculate total on server for consistency
		const serverTotal = validatedData.items.reduce((acc, item) => {
			const sub = item.quantity * item.unit_price * (item.is_express ? 1.5 : 1);
			return acc + sub;
		}, 0);

		const { data: order, error } = await supabase
			.from("orders")
			.insert({
				order_number: generatedOrderNumber,
				customer_id: finalCustomerId,
				outlet_id: validatedData.outlet_id,
				pickup_address: validatedData.pickup_address,
				delivery_address: validatedData.delivery_address,
				delivery_type: validatedData.delivery_type,
				notes: validatedData.notes,
				total: serverTotal,
				status: "pending",
				kasir_id: user.id,
			})
			.select()
			.single();

		if (error) return { success: false, error: error.message };

		// Insert order items
		const orderItems = validatedData.items.map((item) => ({
			order_id: order.id,
			service_id: item.service_id,
			service_name: item.service_name,
			quantity: item.quantity,
			unit: item.unit,
			unit_price: item.unit_price,
			is_express: item.is_express,
			subtotal: item.quantity * item.unit_price * (item.is_express ? 1.5 : 1),
			notes: item.notes,
		}));

		const { error: itemsError } = await supabase
			.from("order_items")
			.insert(orderItems);
		if (itemsError) return { success: false, error: itemsError.message };

		// 4. Initial Timeline Log
		await supabase.from("order_status_logs").insert({
			order_id: order.id,
			status: "pending",
			actor_id: user.id,
			notes: "Pesanan dibuat (POS)",
		});

		revalidatePath("/order");
		revalidatePath("/admin/antrian");
		revalidatePath("/lacak");

		return { success: true, data: order as unknown as Order };
	} catch (error: unknown) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: `Data tidak valid: ${error.issues[0].message}`,
			};
		}
		return {
			success: false,
			error: (error as Error).message || "Terjadi kesalahan sistem",
		};
	}
}

export async function updateOrderStatus(
	orderId: string,
	status: OrderStatus,
): Promise<ActionResponse> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };

	const updateData: Partial<Order> = { status };
	const now = new Date().toISOString();

	// Handle milestone timestamps
	const statusToTimeMap: Record<string, string> = {
		confirmed: "confirmed_at",
		picked_up: "pickup_at",
		received: "received_at",
		washing: "washing_at",
		ironing: "ironing_at",
		qc_passed: "qc_passed_at",
		ready: "ready_at",
		delivering: "delivery_at",
		completed: "completed_at",
		cancelled: "cancelled_at",
	};

	const timeField = statusToTimeMap[status] as keyof Order;
	if (timeField) {
		Object.assign(updateData, { [timeField]: now });
	}

	const { error } = await supabase
		.from("orders")
		.update(updateData)
		.eq("id", orderId);

	if (error) return { success: false, error: error.message };

	// 1. Log the status change
	await supabase.from("order_status_logs").insert({
		order_id: orderId,
		status: status,
		actor_id: user.id,
	});

	revalidatePath("/order");
	revalidatePath("/antrian");
	return { success: true };
}

export async function cancelOrder(
	orderId: string,
	reason: string,
): Promise<ActionResponse> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };

	const { error } = await supabase
		.from("orders")
		.update({
			status: "cancelled",
			cancelled_at: new Date().toISOString(),
			cancel_reason: reason,
		})
		.eq("id", orderId)
		.eq("customer_id", user.id)
		.eq("status", "pending");

	if (error) return { success: false, error: error.message };

	revalidatePath("/order");
	return { success: true };
}

export async function deleteOrder(orderId: string): Promise<ActionResponse> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { success: false, error: "Unauthorized" };

	const { error } = await supabase
		.from("orders")
		.delete()
		.eq("id", orderId)
		.eq("customer_id", user.id)
		.eq("status", "pending");

	if (error) return { success: false, error: error.message };

	revalidatePath("/order");
	return { success: true };
}

export async function assignStaffToOrder(data: {
	orderId: string;
	staffId: string;
	role: "washer" | "ironer" | "qc" | "kasir";
}): Promise<ActionResponse<void>> {
	try {
		const supabase = await createClient();
		const updateData: Partial<Order> = {};
		if (data.role === "washer") updateData.washer_id = data.staffId;
		if (data.role === "ironer") updateData.ironer_id = data.staffId;
		if (data.role === "qc") updateData.qc_id = data.staffId;
		if (data.role === "kasir") updateData.kasir_id = data.staffId;

		const { error } = await supabase
			.from("orders")
			.update(updateData)
			.eq("id", data.orderId);

		if (error) throw error;
		revalidatePath("/admin/pos");
		revalidatePath("/kasir/antrian");
		return { success: true };
	} catch (error: unknown) {
		return { success: false, error: (error as Error).message };
	}
}

export async function trackOrder(
	orderIdentifier: string,
): Promise<ActionResponse<Order>> {
	try {
		const admin = createAdminClient();

		// Attempt to search by order_number or id
		let query = admin.from("orders").select(`
      *,
      order_items(service_name, quantity, unit, subtotal, is_express),
      order_status_logs(status, notes, created_at)
    `);

		// Basic heuristic: if it looks like a UUID, search by ID, else order_number
		const isUuid =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				orderIdentifier,
			);
		if (isUuid) {
			query = query.eq("id", orderIdentifier);
		} else {
			query = query.eq("order_number", orderIdentifier.toUpperCase());
		}

		const { data: order, error } = await query.single();

		if (error || !order) {
			return { success: false, error: "Pesanan tidak ditemukan" };
		}

		return { success: true, data: order };
	} catch (err: unknown) {
		return {
			success: false,
			error: (err as Error).message || "Terjadi kesalahan sistem",
		};
	}
}
