"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export type RegisterStaffInput = {
  fullName: string;
  email: string;
  phone: string;
  role: "manager" | "kasir" | "kurir";
  outletId: string;
  password?: string;
};

export async function registerStaffMember(data: RegisterStaffInput) {
  try {
    const admin = createAdminClient();

    // 1. Create user in Supabase Auth via Admin API
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password || "Mahira123!", // Default password if empty
      email_confirm: true, // Mark email as confirmed immediately
      user_metadata: {
        full_name: data.fullName,
        role: data.role,
        phone: data.phone,
      },
    });

    if (authError) throw authError;

    // 2. The database trigger 'on_auth_user_created' in Supabase 
    // will automatically create the profile. 
    // We just need to ensure the outlet_id is updated since the trigger 
    // doesn't know about it.

    if (authUser.user) {
      const { error: profileError } = await admin
        .from("profiles")
        .update({
          outlet_id: data.outletId,
        })
        .eq("id", authUser.user.id);

      if (profileError) {
        console.error("Error updating staff profile with outlet:", profileError);
      }
    }

    revalidatePath("/pegawai");
    return { success: true };
  } catch (error: any) {
    console.error("Staff registration failed:", error);
    return { success: false, error: error.message };
  }
}
