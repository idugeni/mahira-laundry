import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahiralaundry.id";

	return {
		rules: [
			{
				// Social media scrapers — full access, no restrictions
				userAgent: "facebookexternalhit",
				allow: "/",
			},
			{
				userAgent: "Facebot",
				allow: "/",
			},
			{
				userAgent: "Twitterbot",
				allow: "/",
			},
			{
				userAgent: "LinkedInBot",
				allow: "/",
			},
			{
				userAgent: "Slackbot",
				allow: "/",
			},
			{
				userAgent: "WhatsApp",
				allow: "/",
			},
			{
				userAgent: "TelegramBot",
				allow: "/",
			},
			{
				userAgent: "Pinterest",
				allow: "/",
			},
			{
			// AI Search Engines
				userAgent: [
					"GPTBot",
					"CCBot",
					"PerplexityBot",
					"Google-Extended",
					"OAI-SearchBot",
					"ClaudeBot",
					"Anthropic-AI",
					"Claude-Web",
					"SearchGPT",
					"YouBot",
				],
				allow: ["/", "/layanan", "/paket-usaha", "/galeri", "/llms.txt"],
				disallow: ["/admin", "/dashboard", "/api"],
			},
			{
				// Google Image Search
				userAgent: "Googlebot-Image",
				allow: ["/logo.png", "/og/*.png", "/galeri/*.jpg"],
			},
			{
				// Default — allow public, block private paths
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/auth/",
					"/admin/",
					"/dashboard/",
					"/*.json$",
					"/_next/static/development/",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
