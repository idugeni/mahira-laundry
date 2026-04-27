import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const baseUrl =
	process.env.NEXT_PUBLIC_APP_URL || "https://mahiralaundry.id";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Mahira Laundry — Paket Usaha & Kemitraan Laundry Premium",
		template: "%s | Mahira Laundry",
	},
	description:
		"Dapatkan peluang investasi terbaik dengan paket usaha laundry lengkap dari Mahira. Dukungan mesin, sistem manajemen, dan pelatihan profesional untuk bisnis yang menguntungkan.",
	keywords: [
		"paket usaha laundry",
		"kemitraan laundry",
		"investasi laundry",
		"franchise laundry",
		"bisnis laundry premium",
		"mahira laundry",
		"peluang usaha laundry",
		"laundry business setup",
	],
	openGraph: {
		title: "Mahira Laundry — Paket Usaha & Kemitraan Laundry Premium",
		description:
			"Peluang investasi bisnis laundry dengan sistem teruji dan dukungan penuh. Mulai usaha laundry premium Anda hari ini.",
		type: "website",
		locale: "id_ID",
		siteName: "Mahira Laundry",
		url: "https://mahiralaundry.id",
		images: [
			{
				url: "/og/paket-usaha.png",
				width: 1200,
				height: 630,
				alt: "Mahira Laundry Premium Experience",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Mahira Laundry — Paket Usaha & Kemitraan Laundry Premium",
		description:
			"Investasi bisnis laundry premium dengan sistem manajemen profesional dan mesin terbaik.",
		images: ["/og/paket-usaha.png"],
		creator: "@mahiralaundry",
	},
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/logo.png",
	},
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Mahira Laundry",
	},
	formatDetection: {
		telephone: true,
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		yandex: "yandex-verification-placeholder",
	},
	category: "Business",
};

const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Mahira Laundry",
	url: baseUrl,
	logo: `${baseUrl}/logo.png`,
	description:
		"Penyedia paket usaha laundry premium dan kemitraan bisnis terpercaya.",
	address: {
		"@type": "PostalAddress",
		streetAddress: "Jl. Jatiwaringin No. 28",
		addressLocality: "Bekasi",
		addressRegion: "Jawa Barat",
		postalCode: "17411",
		addressCountry: "ID",
	},
	contactPoint: {
		"@type": "ContactPoint",
		telephone: "+6281234567890",
		contactType: "customer service",
		areaServed: "ID",
		availableLanguage: "Indonesian",
	},
	sameAs: [
		"https://www.instagram.com/mahiralaundry",
		"https://www.facebook.com/mahiralaundry",
	],
};

const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Mahira Laundry",
	url: baseUrl,
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: `${baseUrl}/layanan?q={search_term_string}`,
		},
		"query-input": "required name=search_term_string",
	},
};

const navigationSchema = {
	"@context": "https://schema.org",
	"@type": "ItemList",
	itemListElement: [
		{
			"@type": "SiteNavigationElement",
			position: 1,
			name: "Paket Usaha",
			url: `${baseUrl}/paket-usaha`,
		},
		{
			"@type": "SiteNavigationElement",
			position: 2,
			name: "Layanan",
			url: `${baseUrl}/layanan`,
		},
		{
			"@type": "SiteNavigationElement",
			position: 3,
			name: "Galeri",
			url: `${baseUrl}/galeri`,
		},
		{
			"@type": "SiteNavigationElement",
			position: 4,
			name: "Lokasi",
			url: `${baseUrl}/lokasi`,
		},
		{
			"@type": "SiteNavigationElement",
			position: 5,
			name: "Tentang Kami",
			url: `${baseUrl}/tentang`,
		},
		{
			"@type": "SiteNavigationElement",
			position: 6,
			name: "Bantuan & FAQ",
			url: `${baseUrl}/faq`,
		},
	],
};

import { AuthProvider } from "@/providers/auth-provider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="id"
			suppressHydrationWarning
			className={cn(
				"h-full",
				"antialiased",
				plusJakartaSans.variable,
				inter.variable,
				"font-sans",
				geist.variable,
			)}
		>
			<body
				suppressHydrationWarning
				className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-body)]"
			>
				<script
					key="ld-org"
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Organization Schema
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema),
					}}
				/>
				<script
					key="ld-web"
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: WebSite Schema
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteSchema),
					}}
				/>
				<script
					key="ld-nav"
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Navigation Schema
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(navigationSchema),
					}}
				/>
				<AuthProvider>{children}</AuthProvider>
				<Toaster richColors position="top-right" />
				{process.env.NEXT_PUBLIC_GA_ID && (
					<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
				)}
			</body>
		</html>
	);
}
