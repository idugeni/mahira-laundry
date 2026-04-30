import type { Metadata } from "next";
import { baseOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
	title: "Cari",
	description:
		"Cari layanan, galeri, lokasi outlet, dan informasi lainnya tentang Mahira Laundry.",
	openGraph: {
		...baseOpenGraph,
		url: "/cari",
		title: "Cari — Mahira Laundry",
		description: "Pencarian universal Mahira Laundry.",
	},
};

import { Suspense } from "react";
import { CariClient } from "@/components/shared/public/cari-client";
import { MahiraSpinner } from "@/components/shared/common/mahira-spinner";
import { createClient } from "@/lib/supabase/server";

export default async function CariPage() {
	const supabase = await createClient();

	const [{ data: services }, { data: galleryItems }] = await Promise.all([
		supabase
			.from("services")
			.select("id, name, slug, description, price, unit, icon, is_express")
			.eq("is_active", true)
			.order("sort_order", { ascending: true }),
		supabase
			.from("gallery")
			.select("id, title, category, image_url")
			.eq("is_active", true)
			.order("sort_order", { ascending: true })
			.limit(12),
	]);

	return (
		<div key="cari-root">
			<Suspense
				key="cari-suspense"
				fallback={
					<div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
						<MahiraSpinner size="lg" />
						<p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">
							Memuat Pencarian...
						</p>
					</div>
				}
			>
				<CariClient
					services={services || []}
					galleryItems={galleryItems || []}
				/>
			</Suspense>
		</div>
	);
}
