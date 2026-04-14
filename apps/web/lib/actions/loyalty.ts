"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function redeemRewardAction(rewardId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu." };

  // Memanggil fungsi RPC yang sudah kita buat di database
  const { data, error } = await supabase.rpc("redeem_reward", {
    p_user_id: user.id,
    p_reward_id: rewardId,
  });

  if (error) {
    return { error: error.message };
  }

  // Jika fungsi mengembalikan JSON dengan key 'error'
  if (data?.error) {
    return { error: data.error };
  }

  revalidatePath("/loyalty");
  return { success: true };
}
