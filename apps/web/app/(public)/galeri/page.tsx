import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GallerySection } from "@/components/shared/gallery-section";

export const metadata: Metadata = {
  title: "Galeri Hasil Layanan",
  description: "Lihat hasil cucian, fasilitas, dan proses operasional Mahira Laundry melalui dokumentasi foto kualitas premium kami.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="pt-20">
      <GallerySection items={galleryItems || []} />
    </div>
  );
}
