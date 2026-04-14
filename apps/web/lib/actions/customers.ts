"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchCustomers(query: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, email")
      .eq("role", "customer")
      .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return { data };
  } catch (error: any) {
    console.error("Customer search failed:", error);
    return { error: error.message };
  }
}
