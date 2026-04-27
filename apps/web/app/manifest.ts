import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Mahira Laundry Premium & Paket Usaha",
		short_name: "Mahira Laundry",
		description: "Solusi Laundry Premium & Kemitraan Paket Usaha Terpercaya",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#10b981", // Emerald-500
		icons: [
			{
				src: "/logo.png",
				sizes: "any",
				type: "image/png",
			},
		],
	};
}
