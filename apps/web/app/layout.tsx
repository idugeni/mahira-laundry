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

export const metadata: Metadata = {
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
	],
	openGraph: {
		title: "Mahira Laundry — Premium Laundry & Dry Cleaning",
		description:
			"Layanan laundry premium terbaik di Bekasi Jatiwaringin dengan standar kualitas tinggi.",
		type: "website",
	},
	icons: {
		icon: "/logo.png",
		shortcut: "/logo.png",
		apple: "/logo.png",
	},
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
			className={cn(
				"h-full",
				"antialiased",
				plusJakartaSans.variable,
				inter.variable,
				"font-sans",
				geist.variable,
			)}
		>
			<body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-body)]">
				<AuthProvider>{children}</AuthProvider>
				<Toaster richColors position="top-right" />
			</body>
		</html>
	);
}
