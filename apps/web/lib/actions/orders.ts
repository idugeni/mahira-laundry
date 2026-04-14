"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse, Order, OrderStatus } from "@/lib/types";

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
      }),
    )
    .min(1),
});

export async function createOrder(formData: FormData): Promise<ActionResponse<Order>> {
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

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_id: finalCustomerId,
        outlet_id: validatedData.outlet_id,
        pickup_address: validatedData.pickup_address,
        delivery_address: validatedData.delivery_address,
        delivery_type: validatedData.delivery_type,
        notes: validatedData.notes,
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
      notes: "Pesanan dibuat"
    });

    revalidatePath("/order");
    return { success: true, data: order as unknown as Order };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: `Data tidak valid: ${error.issues[0].message}` };
    }
    return { success: false, error: (error as Error).message || "Terjadi kesalahan sistem" };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResponse> {
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

  const timeField = statusToTimeMap[status];
  if (timeField) {
    (updateData as any)[timeField] = now;
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
    actor_id: user.id
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
