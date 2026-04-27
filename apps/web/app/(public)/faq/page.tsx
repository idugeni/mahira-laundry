import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/common/json-ld";
import { FAQClient } from "@/components/shared/public/faq-client";

export const metadata: Metadata = {
	title: "Pusat Bantuan & FAQ",
	description:
		"Cari jawaban cepat untuk pertanyaan yang sering ditanyakan mengenai layanan laundry premium Mahira, harga, antar-jemput, dan kemitraan.",
	openGraph: {
		title: "Pusat Bantuan & FAQ | Mahira Laundry",
		description:
			"Solusi lengkap untuk segala pertanyaan Anda mengenai Mahira Laundry.",
		images: [
			{
				url: "/og/legal.png",
				width: 1200,
				height: 630,
				alt: "FAQ Mahira Laundry",
			},
		],
	},
};

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Apa itu Mahira Laundry?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Mahira Laundry adalah penyedia layanan laundry premium yang berfokus pada kualitas kebersihan, kecepatan, dan kenyamanan pelanggan.",
			},
		},
		{
			"@type": "Question",
			name: "Apakah ada layanan laundry express?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Ya, kami menyediakan layanan Express 6 Jam dan Sameday 12 Jam untuk pelanggan yang membutuhkan cucian selesai dengan cepat.",
			},
		},
		{
			"@type": "Question",
			name: "Apakah layanan antar-jemput gratis?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Kami menyediakan layanan antar-jemput GRATIS untuk area operasional kami dengan minimum order tertentu.",
			},
		},
	],
};

export default function FAQPage() {
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
				name: "Pusat Bantuan & FAQ",
				item: "https://mahiralaundry.id/faq",
			},
		],
	};

	return (
		<>
			<JsonLd data={faqJsonLd} />
			<JsonLd data={breadcrumbJsonLd} />
			<FAQClient />
		</>
	);
}
