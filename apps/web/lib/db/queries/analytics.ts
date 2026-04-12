import { createClient } from "@/lib/supabase/server";

export async function getOutletStats(outletId: string) {
  const supabase = await createClient();

  const [ordersRes, revenueRes, customersRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("outlet_id", outletId),
    supabase
      .from("orders")
      .select("total")
      .eq("outlet_id", outletId)
      .eq("status", "completed"),
    supabase
      .from("orders")
      .select("customer_id", { count: "exact", head: true })
      .eq("outlet_id", outletId),
  ]);

  return {
    totalOrders: ordersRes.count || 0,
    totalRevenue:
      revenueRes.data?.reduce((sum, o) => sum + Number(o.total), 0) || 0,
    totalCustomers: customersRes.count || 0,
  };
}
