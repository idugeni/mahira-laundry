import { createClient } from "@/lib/supabase/server";

export async function getOrdersByCustomer(customerId: string, status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return data || [];
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "*, order_items(*, services(*)), payments(*), delivery(*), profiles!orders_customer_id_fkey(full_name, phone, email)",
    )
    .eq("id", orderId)
    .single();
  return data;
}

export async function getOrdersByOutlet(outletId: string, status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(
      "*, order_items(*), profiles!orders_customer_id_fkey(full_name, phone)",
    )
    .eq("outlet_id", outletId)
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return data || [];
}
