import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/common/json-ld";
import { LokasiClient } from "@/components/shared/public/lokasi-client";
import { baseOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
	title: "Lokasi Outlet Mahira Laundry Jaticempaka",
	description:
		"Temukan outlet Mahira Laundry terdekat di Jaticempaka, Bekasi. Nikmati layanan laundry premium dengan standar kualitas tinggi dan antar-jemput profesional.",
	keywords: [
		"laundry jaticempaka",
		"laundry pondok gede",
		"laundry bekasi 13620",
		"outlet mahira laundry",
		"alamat mahira laundry",
		"laundry terdekat jaticempaka",
	],
	openGraph: {
		...baseOpenGraph,
		url: "/lokasi",
		title: "Lokasi Outlet",
		description: "Jaringan outlet kami yang siap melayani kebutuhan laundry Anda setiap hari.",
		images: [
			{
				url: "/og/lokasi.png",
				width: 1200,
				height: 630,
				alt: "Lokasi Outlet Mahira Laundry",
			},
		],
	},
};

export default function LokasiPage() {
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
				name: "Lokasi Outlet",
				item: "https://mahiralaundry.id/lokasi",
			},
		],
	};

	return (
		<>
			<JsonLd data={breadcrumbJsonLd} />
			<LokasiClient />
		</>
	);
}
