"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ServiceDetailModal } from "@/components/shared/customer/order/service-detail-modal";
import { GallerySection } from "@/components/shared/public/gallery/gallery-section";
import { TestimonialSection } from "@/components/shared/public/testimonial-section";
import { useAuth } from "@/hooks/use-auth";
import type { GalleryItem, Service, Testimonial } from "@/lib/types";
import { getDashboardUrl } from "@/lib/utils";
import { HomeCtaSection } from "./home-cta-section";
import { HomeHeroSection } from "./home-hero-section";
import { HomeServicesSection } from "./home-services-section";
import { HomeStatsSection } from "./home-stats-section";

interface Stat {
	value: string;
	label: string;
}

interface HomeClientProps {
	initialServices: Service[];
	stats: Stat[];
	testimonials: Testimonial[];
	galleryItems: GalleryItem[];
}

export function HomeClient({
	initialServices,
	stats,
	testimonials,
	galleryItems,
}: HomeClientProps) {
	const { user, profile, loading } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Sync state with URL
	useEffect(() => {
		const serviceSlug = searchParams.get("s");
		if (serviceSlug) {
			const service = initialServices.find(
				(s) => s.id === serviceSlug || s.slug === serviceSlug,
			);
			if (service) {
				setSelectedService(service);
				setIsDetailOpen(true);
			}
		} else {
			setIsDetailOpen(false);
		}
	}, [searchParams, initialServices]);

	const handleServiceClick = (slug: string) => {
		router.push(`/?s=${slug}`, { scroll: false });
	};

	const handleCloseDetail = () => {
		router.push("/", { scroll: false });
	};

	const dashboardHref = getDashboardUrl(profile?.role as string);

	return (
		<div className="overflow-hidden">
			<HomeHeroSection
				user={user}
				loading={loading}
				dashboardHref={dashboardHref}
			/>
			<HomeStatsSection stats={stats} />
			<HomeServicesSection
				services={initialServices}
				isDetailOpen={isDetailOpen}
				onServiceClick={handleServiceClick}
			/>
			<GallerySection items={galleryItems} />
			<TestimonialSection testimonials={testimonials} />
			<HomeCtaSection />

			{/* Service Detail Modal (PWA Model) */}
			<ServiceDetailModal
				service={selectedService}
				isOpen={isDetailOpen}
				onClose={handleCloseDetail}
			/>
		</div>
	);
}
