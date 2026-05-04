import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/shared/common/json-ld";
import { HomeClient } from "@/components/shared/public/home/home-client";
import { HomeSkeleton } from "@/components/shared/public/home/home-skeleton";
import { getActiveBusinessPackages } from "@/lib/actions/business-packages";
import { baseOpenGraph } from "@/lib/metadata";
import { createClient, getPublishedTestimonials } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: {
		absolute: "Mahira Laundry — Paket Usaha Laundry Premium & Kemitraan",
	},
	description:
		"Mulai bisnis laundry sukses Anda dengan Paket Usaha Laundry Mahira. Investasi aman, sistem teruji, dan dukungan operasional penuh untuk profit maksimal.",
	openGraph: {
		...baseOpenGraph,
		title: "Jual Paket Usaha Laundry Premium — Peluang Investasi Kemitraan",
		description:
			"Wujudkan impian memiliki bisnis laundry profesional. Pilih paket usaha laundry yang sesuai dengan budget dan target pasar Anda.",
		url: "/",
		images: [
			{
				url: "/og/paket-usaha.png",
				width: 1200,
				height: 630,
				alt: "Mahira Laundry Premium Experience",
			},
		],
	},
};

import { getPrimaryOutlet } from "@/lib/supabase/public";

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Berapa harga laundry per kg di Mahira Laundry?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Harga laundry kiloan di Mahira Laundry mulai dari Rp 7.000 per kg untuk layanan cuci lipat. Kami juga menawarkan berbagai paket laundry premium lainnya.",
			},
		},
		{
			"@type": "Question",
			name: "Apakah Mahira Laundry menyediakan layanan antar-jemput?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Ya, Mahira Laundry menyediakan layanan antar-jemput gratis untuk area jangkauan kami. Anda dapat memesan layanan ini melalui WhatsApp kami.",
			},
		},
		{
			"@type": "Question",
			name: "Berapa lama waktu pengerjaan laundry express?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Kami menyediakan layanan Express 6 jam dan Sameday 12 jam untuk kebutuhan mendesak Anda. Layanan reguler biasanya selesai dalam 2-3 hari.",
			},
		},
	],
};

export default async function HomePage() {
	const supabase = await createClient();
	const testimonials = await getPublishedTestimonials();
	const outlet = await getPrimaryOutlet();

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "LaundryBusiness",
		name: outlet.name || "Mahira Laundry",
		image: "https://mahiralaundry.id/logo.png",
		description: "Penyedia paket usaha laundry premium dan solusi bisnis laundry terlengkap.",
		"@id": "https://mahiralaundry.id",
		url: "https://mahiralaundry.id",
		telephone: outlet.phone,
		address: {
			"@type": "PostalAddress",
			streetAddress: outlet.address,
			addressLocality: "Indonesia",
			addressRegion: "Asia",
			postalCode: "17411",
			addressCountry: "ID",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: outlet.lat,
			longitude: outlet.lng,
		},
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: outlet.operatingHours?.weekday?.split("-")[0] || "07:00",
				closes: outlet.operatingHours?.weekday?.split("-")[1] || "21:00",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Saturday", "Sunday"],
				opens: outlet.operatingHours?.weekend?.split("-")[0] || "08:00",
				closes: outlet.operatingHours?.weekend?.split("-")[1] || "20:00",
			},
		],
		priceRange: "$$",
	};

	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	const { data: statsData } = await supabase.rpc("get_public_stats");
	const orderCount = statsData?.[0]?.completed_orders_count || 0;

	const { count: outletCount } = await supabase
		.from("outlets")
		.select("*", { count: "exact", head: true })
		.eq("is_active", true);

	const stats = [
		{
			value: `${(orderCount || 0) + 2847}+`,
			label: "Order Selesai",
			numericValue: (orderCount || 0) + 2847,
			suffix: "+",
		},
		{ value: "4.9", label: "Rating", numericValue: 4.9, decimal: 1 },
		{
			value: (outletCount || 0).toString(),
			label: "Outlet",
			numericValue: outletCount || 0,
		},
		{ value: "24/7", label: "Tracking Online" },
	];

	const { data: galleryItems } = await supabase
		.from("gallery")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true })
		.limit(12);

	const businessPackages = await getActiveBusinessPackages();

	return (
		<div key="home-root" className="w-full min-w-0">
			<JsonLd key="ld-main" id="home-business-jsonld" data={jsonLd} />
			<JsonLd key="ld-faq" id="home-faq-jsonld" data={faqJsonLd} />
			<div id="home-page-container" className="w-full min-w-0">
				<Suspense fallback={<HomeSkeleton />}>
					<HomeClient
						initialServices={services || []}
						stats={stats}
						testimonials={testimonials}
						galleryItems={galleryItems || []}
						businessPackages={businessPackages}
					/>
				</Suspense>
			</div>
		</div>
	);
}
