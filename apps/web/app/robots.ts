import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahira-laundry.vercel.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/auth/",
					"/admin/",
					"/dashboard/",
					"/*.json$", // Protect internal config files
					"/_next/static/development/", // Extra dev protection
				],
			},
			{
				// Specifically encourage AI crawlers for better visibility in AI Search (SearchGPT, Perplexity, etc.)
				userAgent: ["GPTBot", "CCBot", "PerplexityBot"],
				allow: ["/", "/layanan", "/paket-usaha", "/galeri", "/llms.txt"],
				disallow: ["/admin", "/dashboard", "/api"],
			},
			{
				// Ensure images are fully indexed for Google Image Search
				userAgent: "Googlebot-Image",
				allow: ["/logo.png", "/og/*.png", "/galeri/*.jpg"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
