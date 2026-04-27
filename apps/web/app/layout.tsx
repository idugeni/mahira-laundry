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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahira-laundry.vercel.app";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Mahira Laundry — Premium Laundry & Dry Cleaning",
		template: "%s | Mahira Laundry",
	},
	description:
		"Layanan laundry premium terbaik di Bekasi Jatiwaringin. Cuci, setrika, dan dry cleaning berkualitas tinggi dengan layanan antar-jemput profesional untuk warga Bekasi.",
	keywords: [
		"laundry premium bekasi",
		"laundry jatiwaringin",
		"dry cleaning bekasi",
		"cuci setrika jatiwaringin",
		"laundry profesional bekasi",
		"mahira laundry jatiwaringin",
		"amanda laundry",
		"mahira laundry vercel",
	],
	openGraph: {
		title: "Mahira Laundry — Premium Laundry & Dry Cleaning",
		description:
			"Layanan laundry premium terbaik di Bekasi Jatiwaringin dengan standar kualitas tinggi. Higienis, cepat, dan terpercaya.",
		type: "website",
		locale: "id_ID",
		siteName: "Mahira Laundry",
		url: "https://mahira-laundry.vercel.app",
		images: [
			{
				url: "/og/home.png",
				width: 1200,
				height: 630,
				alt: "Mahira Laundry Premium Experience",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Mahira Laundry — Premium Laundry & Dry Cleaning",
		description: "Layanan laundry premium terbaik di Bekasi dengan standar kualitas tinggi.",
		images: ["/og/home.png"],
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
		icon: "/logo.png",
		shortcut: "/logo.png",
		apple: "/logo.png",
	},
	verification: {
		google: "google-site-verification-placeholder",
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
	description: "Layanan laundry premium terbaik di Bekasi Jatiwaringin.",
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
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Organization Schema
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema),
					}}
				/>
				<AuthProvider>{children}</AuthProvider>
				<Toaster richColors position="top-right" />
			</body>
		</html>
	);
}
