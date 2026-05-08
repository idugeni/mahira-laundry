import { createStaticClient } from "@/lib/supabase/static";

export interface SitemapEntry {
	url: string;
	lastModified: Date;
	changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
	priority: number;
}

/**
 * Fetch all active services for sitemap
 */
export async function getSitemapServices(): Promise<SitemapEntry[]> {
	try {
		const supabase = createStaticClient();
		const { data: services } = await supabase
			.from("services")
			.select("slug, updated_at")
			.eq("is_active", true)
			.order("sort_order", { ascending: true });

		if (!services) return [];

		return services.map((service) => ({
			url: `/layanan/${service.slug}`,
			lastModified: new Date(service.updated_at || new Date()),
			changeFrequency: "weekly" as const,
			priority: 0.7,
		}));
	} catch (_error) {
		return [];
	}
}

/**
 * Fetch all active outlets for sitemap
 */
export async function getSitemapOutlets(): Promise<SitemapEntry[]> {
	try {
		const supabase = createStaticClient();
		const { data: outlets } = await supabase
			.from("outlets")
			.select("slug, updated_at")
			.eq("is_active", true)
			.order("created_at", { ascending: true });

		if (!outlets) return [];

		return outlets.map((outlet) => ({
			url: `/outlet/${outlet.slug}`,
			lastModified: new Date(outlet.updated_at || new Date()),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		}));
	} catch (_error) {
		return [];
	}
}

/**
 * Fetch all active gallery items for sitemap
 */
export async function getSitemapGalleryItems(): Promise<SitemapEntry[]> {
	try {
		const supabase = createStaticClient();
		const { data: galleryItems } = await supabase
			.from("gallery")
			.select("id, updated_at")
			.eq("is_active", true)
			.order("sort_order", { ascending: true });

		if (!galleryItems) return [];

		return galleryItems.map((item) => ({
			url: `/galeri/${item.id}`,
			lastModified: new Date(item.updated_at || new Date()),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));
	} catch (_error) {
		return [];
	}
}

/**
 * Fetch all active FAQ items for sitemap (if FAQ table exists)
 */
export async function getSitemapFaqItems(): Promise<SitemapEntry[]> {
	try {
		const supabase = createStaticClient();
		const { data: faqItems } = await supabase
			.from("faqs")
			.select("slug, updated_at")
			.eq("is_active", true)
			.order("sort_order", { ascending: true });

		if (!faqItems) return [];

		return faqItems.map((item) => ({
			url: `/faq/${item.slug}`,
			lastModified: new Date(item.updated_at || new Date()),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));
	} catch (_error) {
		// FAQ table might not exist, silently fail
		return [];
	}
}

/**
 * Fetch all active business packages for sitemap
 */
export async function getSitemapBusinessPackages(): Promise<SitemapEntry[]> {
	try {
		const supabase = createStaticClient();
		const { data: packages } = await supabase
			.from("business_packages")
			.select("slug, updated_at")
			.eq("is_active", true)
			.order("sort_order", { ascending: true });

		if (!packages) return [];

		return packages.map((pkg) => ({
			url: `/paket/${pkg.slug}`,
			lastModified: new Date(pkg.updated_at || new Date()),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		}));
	} catch (_error) {
		return [];
	}
}
