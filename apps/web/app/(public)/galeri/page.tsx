import type { Metadata } from "next";
import { Suspense } from "react";
import { MahiraSpinner } from "@/components/shared/common/mahira-spinner";
import { GallerySection } from "@/components/shared/public/gallery/gallery-section";
import { baseOpenGraph } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Galeri Hasil Layanan",
	description:
		"Lihat hasil cucian, fasilitas, dan proses operasional Mahira Laundry melalui dokumentasi foto kualitas premium kami.",
	openGraph: {
		...baseOpenGraph,
		url: "/galeri",
		title: "Galeri Hasil Layanan | Mahira Laundry",
		description: "Koleksi foto hasil layanan laundry premium dan fasilitas modern Mahira.",
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
			<Suspense
				key="galeri-suspense"
				fallback={
					<div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
						<MahiraSpinner size="lg" />
						<p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">
							Menyiapkan Galeri...
						</p>
					</div>
				}
			>
				<GallerySection items={galleryItems || []} />
			</Suspense>
		</div>
	);
}
