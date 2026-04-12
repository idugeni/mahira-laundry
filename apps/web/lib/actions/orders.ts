"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const orderData = {
    customer_id: user.id,
    outlet_id: formData.get("outlet_id") as string,
    pickup_address: formData.get("pickup_address") as string,
    delivery_address: formData.get("delivery_address") as string,
    delivery_type: formData.get("delivery_type") as string,
    notes: formData.get("notes") as string,
  };

  const { data: order, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) return { error: error.message };

  // Insert order items
  const items = JSON.parse(formData.get("items") as string);
  const orderItems = items.map(
    (item: {
      service_id: string;
      service_name: string;
      quantity: number;
      unit: string;
      unit_price: number;
      is_express: boolean;
    }) => ({
      order_id: order.id,
      service_id: item.service_id,
      service_name: item.service_name,
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unit_price,
      is_express: item.is_express,
      subtotal: item.quantity * item.unit_price * (item.is_express ? 1.5 : 1),
    }),
  );

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) return { error: itemsError.message };

  revalidatePath("/order");
  return { data: order };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const updateData: Record<string, unknown> = { status };
  if (status === "completed")
    updateData.completed_at = new Date().toISOString();
  if (status === "cancelled")
    updateData.cancelled_at = new Date().toISOString();

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidatePath("/order");
  revalidatePath("/antrian");
  return { success: true };
}

export async function cancelOrder(orderId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

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

  if (error) return { error: error.message };

  revalidatePath("/order");
  return { success: true };
}
