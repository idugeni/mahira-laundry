import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminGalleryClient } from "@/components/shared/admin-gallery-client";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kelola Galeri",
  description: "Unggah dan kelola foto galeri Mahira Laundry.",
};

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check superadmin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "superadmin") {
    redirect("/dashboard");
  }

  // Fetch gallery items
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminGalleryClient initialItems={galleryItems || []} />;
}
