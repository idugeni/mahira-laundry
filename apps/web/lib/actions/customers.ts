"use server";

import { createClient } from "@/lib/supabase/server";

import { Profile } from "@/lib/types";
import { ActionResponse } from "@/lib/types";

export async function searchCustomers(query: string): Promise<ActionResponse<Profile[]>> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "customer")
      .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return { success: true, data: data as unknown as Profile[] };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Customer search failed:", err);
    return { success: false, error: err.message };
  }
}
