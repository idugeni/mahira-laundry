import type { Metadata } from "next";
import { GallerySection } from "@/components/shared/public/gallery/gallery-section";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Galeri Hasil Layanan",
	description:
		"Lihat hasil cucian, fasilitas, dan proses operasional Mahira Laundry melalui dokumentasi foto kualitas premium kami.",
};

export default async function GalleryPage() {
	const supabase = await createClient();

	const { data: galleryItems } = await supabase
		.from("gallery")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	return (
		<div>
			<GallerySection items={galleryItems || []} />
		</div>
	);
}
