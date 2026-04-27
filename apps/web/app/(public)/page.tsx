import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeClient } from "@/components/shared/public/home/home-client";
import { getActiveBusinessPackages } from "@/lib/actions/business-packages";
import { PRIMARY_OUTLET } from "@/lib/constants";
import { createClient, getPublishedTestimonials } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: {
		absolute: "Mahira Laundry — Premium Laundry & Dry Cleaning",
	},
	description:
		"Layanan laundry premium terpercaya di Jatiwaringin, Bekasi. Cuci lipat, setrika, dry cleaning, express 6 jam dengan antar-jemput gratis. Mulai Rp 7.000/kg.",
	openGraph: {
		title: "Mahira Laundry — Layanan Laundry Premium Jatiwaringin Bekasi",
		description:
			"Cucian Bersih, Hidup Nyaman. Layanan cuci setrika, dry cleaning, dan express 6 jam. Antar-jemput gratis.",
		type: "website",
		images: [
			{
				url: "/og/home.png",
				width: 1200,
				height: 630,
				alt: "Mahira Laundry Premium Experience",
			},
		],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "LaundryBusiness",
	name: "Mahira Laundry",
	image: "https://mahira-laundry.vercel.app/logo.png",
	description: "Layanan laundry premium terpercaya di Jatiwaringin, Bekasi.",
	"@id": "https://mahira-laundry.vercel.app",
	url: "https://mahira-laundry.vercel.app",
	telephone: PRIMARY_OUTLET.phone,
	address: {
		"@type": "PostalAddress",
		streetAddress: PRIMARY_OUTLET.address,
		addressLocality: "Bekasi",
		addressRegion: "Jawa Barat",
		postalCode: "17411",
		addressCountry: "ID",
	},
	geo: {
		"@type": "GeoCoordinates",
		latitude: PRIMARY_OUTLET.lat,
		longitude: PRIMARY_OUTLET.lng,
	},
	openingHoursSpecification: [
		{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			opens: "07:00",
			closes: "21:00",
		},
		{
			"@type": "OpeningHoursSpecification",
			dayOfWeek: ["Saturday", "Sunday"],
			opens: "08:00",
			closes: "20:00",
		},
	],
	priceRange: "$$",
};

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: [
		{
			"@type": "Question",
			name: "Berapa harga laundry per kg di Mahira Laundry Bekasi?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Harga laundry kiloan di Mahira Laundry Bekasi mulai dari Rp 7.000 per kg untuk layanan cuci lipat. Kami juga menawarkan berbagai paket laundry premium lainnya.",
			},
		},
		{
			"@type": "Question",
			name: "Apakah Mahira Laundry menyediakan layanan antar-jemput?",
			acceptedAnswer: {
				"@type": "Answer",
				text: "Ya, Mahira Laundry menyediakan layanan antar-jemput gratis untuk area Jatiwaringin dan sekitarnya. Anda dapat memesan layanan ini melalui WhatsApp kami.",
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

	// Fetch active services from the main outlet (Jatiwaringin)
	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	// Fetch some stats from real data
	const { count: orderCount } = await supabase
		.from("orders")
		.select("*", { count: "exact", head: true })
		.eq("status", "completed");

	const { count: outletCount } = await supabase
		.from("outlets")
		.select("*", { count: "exact", head: true })
		.eq("is_active", true);

	const stats = [
		{ value: `${(orderCount || 0) + 2500}+`, label: "Order Selesai" },
		{ value: "4.9", label: "Rating" },
		{ value: (outletCount || 0).toString(), label: "Outlet" },
		{ value: "24/7", label: "Tracking Online" },
	];

	// Fetch gallery items (show more for better overview)
	const { data: galleryItems } = await supabase
		.from("gallery")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true })
		.limit(12);

	// Fetch active business packages for homepage preview
	const businessPackages = await getActiveBusinessPackages();

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: FAQ JSON-LD
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>
			<div id="home-page-container">
				<Suspense fallback={<div className="py-24 text-center">Memuat...</div>}>
					<HomeClient
						initialServices={services || []}
						stats={stats}
						testimonials={testimonials}
						galleryItems={galleryItems || []}
						businessPackages={businessPackages}
					/>
				</Suspense>
			</div>
		</>
	);
}
