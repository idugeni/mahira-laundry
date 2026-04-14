"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitTestimonial(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login untuk memberikan testimoni." };
  }

  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string, 10);

  if (!content || !rating) {
    return { error: "Konten dan rating wajib diisi." };
  }

  try {
    const { error } = await supabase.from("testimonials").insert({
      user_id: user.id,
      content,
      rating,
      is_published: false, // Default to false for moderation
    });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message || "Gagal mengirim testimoni." };
  }
}

export async function updateTestimonialStatus(
  id: string,
  is_published: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Simple admin check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();
  if (profile?.role !== "superadmin") {
    return { error: "Akses ditolak." };
  }

  try {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_published })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();
  if (profile?.role !== "superadmin") {
    return { error: "Akses ditolak." };
  }

  try {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}
