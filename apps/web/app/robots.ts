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
				// Ensure social media scrapers can access the site for link previews
				userAgent: [
					"facebookexternalhit",
					"Facebot",
					"Twitterbot",
					"Pinterest",
					"Slackbot",
					"LinkedInBot",
					"WhatsApp",
					"TelegramBot",
				],
				allow: "/",
			},
			{
				// High-priority for 2026 AI Search Engines (SearchGPT, Claude, Perplexity, etc.)
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
				// Ensure images are fully indexed for Google Image Search
				userAgent: "Googlebot-Image",
				allow: ["/logo.png", "/og/*.png", "/galeri/*.jpg"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
