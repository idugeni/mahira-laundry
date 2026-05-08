import type { MetadataRoute } from "next";
import {
	getSitemapBusinessPackages,
	getSitemapFaqItems,
	getSitemapGalleryItems,
	getSitemapOutlets,
	getSitemapServices,
} from "@/lib/supabase/sitemap";

/**
 * Dynamic Sitemap Generator
 * Fetches all active content from Supabase and generates a complete sitemap
 * including static pages and dynamic content
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mahiralaundry.id";

	// Static routes with fixed priorities
	const staticRoutes = [
		{
			url: `${baseUrl}`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/layanan`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/galeri`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/paket-usaha`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/tentang`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/lokasi`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/lacak`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/sitemap`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/faq`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly" as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly" as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/cookies`,
			lastModified: new Date(),
			changeFrequency: "yearly" as const,
			priority: 0.5,
		},
	];

	try {
		// Fetch all dynamic content in parallel
		const [
			dynamicServices,
			dynamicOutlets,
			dynamicGalleryItems,
			dynamicFaqItems,
			dynamicBusinessPackages,
		] = await Promise.all([
			getSitemapServices(),
			getSitemapOutlets(),
			getSitemapGalleryItems(),
			getSitemapFaqItems(),
			getSitemapBusinessPackages(),
		]);

		// Combine static and dynamic routes
		const allRoutes = [
			...staticRoutes,
			...dynamicServices.map((route) => ({
				...route,
				url: `${baseUrl}${route.url}`,
			})),
			...dynamicOutlets.map((route) => ({
				...route,
				url: `${baseUrl}${route.url}`,
			})),
			...dynamicGalleryItems.map((route) => ({
				...route,
				url: `${baseUrl}${route.url}`,
			})),
			...dynamicFaqItems.map((route) => ({
				...route,
				url: `${baseUrl}${route.url}`,
			})),
			...dynamicBusinessPackages.map((route) => ({
				...route,
				url: `${baseUrl}${route.url}`,
			})),
		];

		return allRoutes;
	} catch (_error) {
		return staticRoutes;
	}
}
