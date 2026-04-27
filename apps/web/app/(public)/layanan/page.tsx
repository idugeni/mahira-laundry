import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Layanan Laundry Premium",
	description:
		"Daftar lengkap layanan laundry premium: cuci lipat, cuci setrika, express, dry cleaning, cuci sepatu, dan lainnya dengan standar kualitas tinggi.",
	openGraph: {
		title: "Layanan",
		description:
			"Solusi laundry profesional dengan layanan lengkap. Mulai dari Rp 7.000/kg.",
		images: [
			{
				url: "/og/layanan.png",
				width: 1200,
				height: 630,
				alt: "Layanan Laundry Premium Mahira",
			},
		],
	},
};

import { Suspense } from "react";
import { JsonLd } from "@/components/shared/common/json-ld";
import { MahiraSpinner } from "@/components/shared/common/mahira-spinner";
import { LayananClient } from "@/components/shared/public/layanan-client";
import { createClient } from "@/lib/supabase/server";

export default async function LayananPage() {
	const supabase = await createClient();

	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Beranda",
				item: "https://mahiralaundry.id",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Layanan",
				item: "https://mahiralaundry.id/layanan",
			},
		],
	};

	return (
		<>
			<JsonLd data={breadcrumbJsonLd} />
			<Suspense
				fallback={
					<div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
						<MahiraSpinner size="lg" />
						<p className="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest">
							Menyiapkan Layanan Premium...
						</p>
					</div>
				}
			>
				<LayananClient initialServices={services || []} />
			</Suspense>
		</>
	);
}
