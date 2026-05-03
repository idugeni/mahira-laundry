"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
	isStaffRole,
	MANAGER_ROLES,
	requireRole,
	requireUser,
	STAFF_ROLES,
} from "@/lib/auth/guards";
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
				unit_price: z.number().optional(),
				is_express: z.boolean(),
				notes: z.string().optional(),
			}),
		)
		.min(1),
});

const OrderStatusSchema = z.enum([
	"pending",
	"confirmed",
	"picked_up",
	"washing",
	"ironing",
	"ready",
	"delivering",
	"completed",
	"cancelled",
]);

const AssignStaffSchema = z.object({
	orderId: z.string().uuid(),
	staffId: z.string().uuid(),
	role: z.enum(["washer", "ironer", "qc", "kasir"]),
});

export async function createOrder(formData: FormData): Promise<ActionResponse<Order>> {
	try {
		const { supabase, user, role, outletId } = await requireUser();
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

		if (validatedData.customer_id && validatedData.customer_id !== user.id && !isStaffRole(role)) {
			return { success: false, error: "Tidak boleh membuat pesanan untuk pelanggan lain." };
		}

		if (isStaffRole(role) && role !== "superadmin" && outletId !== validatedData.outlet_id) {
			return { success: false, error: "Akses outlet ditolak." };
		}

		const finalCustomerId = validatedData.customer_id || user.id;
		const generatedOrderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();

		const serviceIds = [...new Set(validatedData.items.map((item) => item.service_id))];
		const { data: services, error: servicesError } = await supabase
			.from("services")
			.select("id, name, unit, price, express_multiplier, is_active")
			.in("id", serviceIds)
			.eq("is_active", true);

		if (servicesError) throw servicesError;
		if (!services || services.length !== serviceIds.length) {
			return { success: false, error: "Layanan tidak valid atau sudah tidak aktif." };
		}

		const serviceById = new Map(services.map((service) => [service.id, service]));
		const orderItems = validatedData.items.map((item) => {
			const service = serviceById.get(item.service_id);
			if (!service) {
				throw new Error("Layanan tidak ditemukan.");
			}

			const unitPrice = Number(service.price);
			const multiplier = item.is_express ? Number(service.express_multiplier ?? 1.5) : 1;
			const subtotal = item.quantity * unitPrice * multiplier;

			return {
				service_id: service.id,
				service_name: service.name,
				quantity: item.quantity,
				unit: service.unit,
				unit_price: unitPrice,
				is_express: item.is_express,
				subtotal,
				notes: item.notes,
			};
		});

		const serverTotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

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

		const orderItemsWithOrderId = orderItems.map((item) => ({
			order_id: order.id,
			...item,
		}));

		const { error: itemsError } = await supabase.from("order_items").insert(orderItemsWithOrderId);
		if (itemsError) return { success: false, error: itemsError.message };

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
				error: `Data tidak valid: ${error.issues[0]?.message ?? "Validation error"}`,
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
	const parsedStatus = OrderStatusSchema.safeParse(status);
	if (!parsedStatus.success) return { success: false, error: "Status pesanan tidak valid." };

	const { supabase, user, role, outletId } = await requireRole(
		STAFF_ROLES,
		"Akses staff diperlukan untuk memperbarui pesanan.",
	);

	const updateData: Partial<Order> = { status: parsedStatus.data };
	const now = new Date().toISOString();

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

	const timeField = statusToTimeMap[parsedStatus.data] as keyof Order;
	if (timeField) {
		Object.assign(updateData, { [timeField]: now });
	}

	let updateQuery = supabase.from("orders").update(updateData).eq("id", orderId).select("id");
	if (role !== "superadmin" && !outletId) {
		return { success: false, error: "Akses outlet ditolak." };
	}
	if (role !== "superadmin" && outletId) {
		updateQuery = updateQuery.eq("outlet_id", outletId);
	}

	const { data: updatedOrders, error } = await updateQuery;

	if (error) return { success: false, error: error.message };
	if (!updatedOrders || updatedOrders.length === 0) {
		return { success: false, error: "Pesanan tidak ditemukan atau akses ditolak." };
	}

	await supabase.from("order_status_logs").insert({
		order_id: orderId,
		status: parsedStatus.data,
		actor_id: user.id,
	});

	revalidatePath("/order");
	revalidatePath("/antrian");
	return { success: true };
}

export async function cancelOrder(orderId: string, reason: string): Promise<ActionResponse> {
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
		const parsed = AssignStaffSchema.parse(data);
		const {
			supabase,
			role: actorRole,
			outletId,
		} = await requireRole(MANAGER_ROLES, "Akses manager diperlukan untuk menugaskan staff.");
		const updateData: Partial<Order> = {};
		if (parsed.role === "washer") updateData.washer_id = parsed.staffId;
		if (parsed.role === "ironer") updateData.ironer_id = parsed.staffId;
		if (parsed.role === "qc") updateData.qc_id = parsed.staffId;
		if (parsed.role === "kasir") updateData.kasir_id = parsed.staffId;

		let updateQuery = supabase.from("orders").update(updateData).eq("id", parsed.orderId);
		if (actorRole !== "superadmin" && !outletId) {
			return { success: false, error: "Akses outlet ditolak." };
		}
		if (actorRole !== "superadmin" && outletId) {
			updateQuery = updateQuery.eq("outlet_id", outletId);
		}

		const { error } = await updateQuery;

		if (error) throw error;
		revalidatePath("/admin/pos");
		revalidatePath("/kasir/antrian");
		return { success: true };
	} catch (error: unknown) {
		return { success: false, error: (error as Error).message };
	}
}

export async function trackOrder(orderIdentifier: string): Promise<ActionResponse<Order>> {
	try {
		const supabase = await createClient();

		const { data: order, error } = await supabase.rpc("get_order_details_v1", {
			p_identifier: orderIdentifier,
		});

		if (error || !order || order.length === 0) {
			return { success: false, error: "Pesanan tidak ditemukan" };
		}

		return { success: true, data: order[0] };
	} catch (err: unknown) {
		return {
			success: false,
			error: (err as Error).message || "Terjadi kesalahan sistem",
		};
	}
}
