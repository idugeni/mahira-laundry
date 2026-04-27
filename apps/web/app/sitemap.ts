import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl =
		process.env.NEXT_PUBLIC_APP_URL || "https://mahiralaundry.id";

	const routes = [
		"",
		"/layanan",
		"/galeri",
		"/paket-usaha",
		"/tentang",
		"/lokasi",
		"/lacak",
		"/sitemap",
		"/faq",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: route === "" || route === "/paket-usaha" ? 1 : 0.8,
	}));

	return routes;
}
