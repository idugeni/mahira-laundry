import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/common/json-ld";
import { LayananClient } from "@/components/shared/public/layanan-client";
import { baseOpenGraph } from "@/lib/metadata";
import { createClient, getUser, getUserProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Layanan Laundry Premium & Kiloan Bekasi",
	description:
		"Daftar lengkap layanan laundry premium: cuci lipat, cuci setrika, express 6 jam, dry cleaning, cuci sepatu, dan baby care dengan standar kualitas tinggi di Bekasi.",
	keywords: [
		"laundry kiloan bekasi",
		"laundry express bekasi",
		"cuci sepatu bekasi",
		"dry cleaning bekasi",
		"laundry satuan premium",
		"cuci karpet bekasi",
		"laundry bayi bekasi",
	],
	openGraph: {
		...baseOpenGraph,
		url: "/layanan",
		title: "Layanan",
		description: "Solusi laundry profesional dengan layanan lengkap. Mulai dari Rp 7.000/kg.",
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

export default async function LayananPage() {
	const supabase = await createClient();
	const [user, profile] = await Promise.all([getUser(), getUserProfile()]);

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
		<div key="layanan-root">
			<JsonLd key="ld-breadcrumb" data={breadcrumbJsonLd} />
			<LayananClient initialServices={services || []} initialUser={user} initialProfile={profile} />
		</div>
	);
}
