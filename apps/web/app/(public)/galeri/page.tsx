import type { Metadata } from "next";
import { GallerySection } from "@/components/shared/public/gallery/gallery-section";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Galeri Hasil Layanan",
	description:
		"Lihat hasil cucian, fasilitas, dan proses operasional Mahira Laundry melalui dokumentasi foto kualitas premium kami.",
	openGraph: {
		title: "Galeri Hasil Layanan | Mahira Laundry",
		description:
			"Koleksi foto hasil layanan laundry premium dan fasilitas modern Mahira.",
		images: [
			{
				url: "/og/galeri.png",
				width: 1200,
				height: 630,
				alt: "Galeri Foto Mahira Laundry",
			},
		],
	},
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
