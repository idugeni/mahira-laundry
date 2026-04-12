import { createClient } from "@/lib/supabase/server";

export async function getCustomerById(customerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", customerId)
    .single();
  return data;
}

export async function searchCustomers(query: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email, loyalty_tier, loyalty_points")
    .eq("role", "customer")
    .or(
      `full_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`,
    )
    .limit(10);
  return data || [];
}
