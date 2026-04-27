"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ServiceDetailModal } from "@/components/shared/customer/order/service-detail-modal";
import { GallerySection } from "@/components/shared/public/gallery/gallery-section";
import { HomeBusinessPackagesSection } from "@/components/shared/public/home/home-business-packages-section";
import { HomeCtaSection } from "@/components/shared/public/home/home-cta-section";
import { HomeHeroSection } from "@/components/shared/public/home/home-hero-section";
import { HomeSearchSection } from "@/components/shared/public/home/home-search-section";
import { HomeServicesSection } from "@/components/shared/public/home/home-services-section";
import { HomeStatsSection } from "@/components/shared/public/home/home-stats-section";
import { TestimonialSection } from "@/components/shared/public/testimonial-section";
import { useAuth } from "@/hooks/use-auth";
import type {
	BusinessPackage,
	GalleryItem,
	Service,
	Testimonial,
} from "@/lib/types";
import { getDashboardUrl } from "@/lib/utils";

interface Stat {
	value: string;
	label: string;
}

interface HomeClientProps {
	initialServices: Service[];
	stats: Stat[];
	testimonials: Testimonial[];
	galleryItems: GalleryItem[];
	businessPackages: BusinessPackage[];
}

export function HomeClient({
	initialServices,
	stats,
	testimonials,
	galleryItems,
	businessPackages,
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
				packages={businessPackages}
			/>
			<HomeSearchSection />
			<HomeStatsSection stats={stats} />
			<HomeServicesSection
				services={initialServices}
				isDetailOpen={isDetailOpen}
				onServiceClick={handleServiceClick}
			/>
			<GallerySection items={galleryItems} />
			<TestimonialSection testimonials={testimonials} />
			<HomeBusinessPackagesSection packages={businessPackages} />
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
