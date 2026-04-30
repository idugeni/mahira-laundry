import type { Metadata } from "next";
import { SitemapClient } from "@/components/shared/public/sitemap-client";
import { baseOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
	title: "Sitemap",
	description:
		"Peta situs Mahira Laundry — Navigasi lengkap untuk layanan laundry premium, pelacakan pesanan, dan informasi outlet.",
	openGraph: {
		...baseOpenGraph,
		url: "/sitemap",
		title: "Sitemap | Mahira Laundry",
		description: "Navigasi lengkap seluruh halaman dan layanan Mahira Laundry.",
		images: [
			{
				url: "/og/sitemap.png",
				width: 1200,
				height: 630,
				alt: "Peta Situs Mahira Laundry",
			},
		],
	},
};

export default function SitemapPage() {
	return <SitemapClient />;
}
