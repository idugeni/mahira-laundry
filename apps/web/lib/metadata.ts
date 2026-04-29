import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahiralaundry.id";

export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
	siteName: "Mahira Laundry",
	url: baseUrl,
	type: "website",
	locale: "id_ID",
	images: [
		{
			url: "/og/paket-usaha.png",
			width: 1200,
			height: 630,
			alt: "Mahira Laundry Premium Experience",
		},
	],
};
