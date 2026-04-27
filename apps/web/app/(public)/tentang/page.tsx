import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tentang Kami",
	description:
		"Tentang Mahira Laundry — Solusi laundry premium dengan standar kualitas internasional dan antar-jemput profesional.",
	openGraph: {
		title: "Tentang",
		description:
			"Layanan laundry terpercaya dengan komitmen terhadap kebersihan dan kualitas kain Anda.",
		images: [
			{
				url: "/og/tentang.png",
				width: 1200,
				height: 630,
				alt: "Visi dan Misi Mahira Laundry",
			},
		],
	},
};

import { JsonLd } from "@/components/shared/common/json-ld";
import { TentangClient } from "@/components/shared/public/tentang-client";

export default function TentangPage() {
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
				name: "Tentang Kami",
				item: "https://mahiralaundry.id/tentang",
			},
		],
	};

	return (
		<>
			<JsonLd data={breadcrumbJsonLd} />
			<TentangClient />
		</>
	);
}
