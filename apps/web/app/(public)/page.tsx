import type { PostgrestResponse, User } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/common/json-ld";
import { HomeClient } from "@/components/shared/public/home/home-client";
import { getActiveBusinessPackages } from "@/lib/actions/business-packages";
import { baseOpenGraph } from "@/lib/metadata";
import { getPrimaryOutlet } from "@/lib/supabase/public";
import {
	createClient,
	getPublishedTestimonials,
	getUser,
	getUserProfile,
} from "@/lib/supabase/server";
import type { BusinessPackage, GalleryItem, Profile, Service, Testimonial } from "@/lib/types";

export const revalidate = 3600; // ISR: Revalidate every hour

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
	const [user, profile] = await Promise.all([getUser(), getUserProfile()]);

	// Parallel fetching of critical metadata and primary data
	const [outlet, businessPackages] = await Promise.all([
		getPrimaryOutlet(),
		getActiveBusinessPackages(),
	]);

	// Defer non-critical data fetching to let initial page render faster
	const servicesPromise = supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true })
		.then((res) => res);

	const statsPromise = supabase
		.from("orders")
		.select("*", { count: "exact", head: true })
		.eq("status", "completed")
		.then((res) => res);

	const outletCountPromise = supabase
		.from("outlets")
		.select("*", { count: "exact", head: true })
		.eq("is_active", true)
		.then((res) => res);

	const galleryPromise = supabase
		.from("gallery")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true })
		.limit(12)
		.then((res) => res);

	const testimonialsPromise = getPublishedTestimonials();

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

	return (
		<div key="home-root" className="w-full min-w-0">
			<JsonLd key="ld-main" id="home-business-jsonld" data={jsonLd} />
			<JsonLd key="ld-faq" id="home-faq-jsonld" data={faqJsonLd} />
			<div id="home-page-container" className="w-full min-w-0">
				<AsyncHomeContent
					servicesPromise={servicesPromise}
					statsPromise={statsPromise}
					outletCountPromise={outletCountPromise}
					galleryPromise={galleryPromise}
					testimonialsPromise={testimonialsPromise}
					businessPackages={businessPackages}
					user={user}
					profile={profile}
				/>
			</div>
		</div>
	);
}

/**
 * Modern Streaming Component: Renders once deferred promises resolve.
 * Standard 2026: Progressive Hydration / Streaming
 */
async function AsyncHomeContent({
	servicesPromise,
	statsPromise,
	outletCountPromise,
	galleryPromise,
	testimonialsPromise,
	businessPackages,
	user,
	profile,
}: {
	servicesPromise: PromiseLike<PostgrestResponse<Service>>;
	statsPromise: PromiseLike<PostgrestResponse<null>>;
	outletCountPromise: PromiseLike<PostgrestResponse<null>>;
	galleryPromise: PromiseLike<PostgrestResponse<GalleryItem>>;
	testimonialsPromise: Promise<Testimonial[]>;
	businessPackages: BusinessPackage[];
	user: User | null;
	profile: Profile | null;
}) {
	const [servicesResult, statsResult, outletCountResult, galleryItemsResult, testimonials] =
		await Promise.all([
			servicesPromise,
			statsPromise,
			outletCountPromise,
			galleryPromise,
			testimonialsPromise,
		]);

	const { data: services } = servicesResult;
	const { count: orderCount } = statsResult;
	const { count: outletCount } = outletCountResult;
	const { data: galleryItems } = galleryItemsResult;
	const stats = [
		{
			numericValue: (orderCount || 0) + 2847,
			suffix: "+",
			label: "Order Selesai",
		},
		{ numericValue: 4.9, decimal: 1, label: "Rating" },
		{
			numericValue: outletCount || 0,
			label: "Outlet",
		},
		{ value: "24/7", label: "Tracking Online" },
	];

	return (
		<HomeClient
			initialServices={services || []}
			stats={stats}
			testimonials={testimonials}
			galleryItems={galleryItems || []}
			businessPackages={businessPackages}
			initialUser={user}
			initialProfile={profile}
		/>
	);
}
