"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ServiceDetailModal } from "@/components/shared/customer/order/service-detail-modal";
import { GallerySection } from "@/components/shared/public/gallery/gallery-section";
import { HomeBusinessPackagesSection } from "@/components/shared/public/home/home-business-packages-section";
import { HomeCtaSection } from "@/components/shared/public/home/home-cta-section";
import { HomeHeroSection } from "@/components/shared/public/home/home-hero-section";
import { HomeServicesSection } from "@/components/shared/public/home/home-services-section";
import { HomeStatsSection } from "@/components/shared/public/home/home-stats-section";
import { TestimonialSection } from "@/components/shared/public/testimonial-section";
import { useAuth } from "@/hooks/use-auth";
import type { BusinessPackage, GalleryItem, Profile, Service, Testimonial } from "@/lib/types";
import { getDashboardUrl } from "@/lib/utils";

interface Stat {
	value?: string;
	label: string;
	numericValue?: number;
	decimal?: number;
	suffix?: string;
	prefix?: string;
}

interface HomeClientProps {
	initialServices: Service[];
	stats: Stat[];
	testimonials: Testimonial[];
	galleryItems: GalleryItem[];
	businessPackages: BusinessPackage[];
	initialUser?: User | null;
	initialProfile?: Profile | null;
}

function ServiceDetailUrlModal({ services }: { services: Service[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	useEffect(() => {
		const serviceSlug = searchParams.get("s");
		if (serviceSlug) {
			const service = services.find((s) => s.id === serviceSlug || s.slug === serviceSlug);
			if (service) {
				setSelectedService(service);
				setIsDetailOpen(true);
			}
		} else {
			setIsDetailOpen(false);
		}
	}, [searchParams, services]);

	const handleCloseDetail = () => {
		router.push("/", { scroll: false });
	};

	return (
		<ServiceDetailModal
			service={selectedService}
			isOpen={isDetailOpen}
			onClose={handleCloseDetail}
		/>
	);
}

export function HomeClient({
	initialServices,
	stats,
	testimonials,
	galleryItems,
	businessPackages,
	initialUser,
	initialProfile,
}: HomeClientProps) {
	const { user: ctxUser, profile: ctxProfile, loading: ctxLoading } = useAuth();
	const user = ctxLoading && initialUser !== undefined ? initialUser : ctxUser;
	const profile = ctxLoading && initialProfile !== undefined ? initialProfile : ctxProfile;
	const loading = ctxLoading && initialUser === undefined;

	const router = useRouter();

	const handleServiceClick = (slug: string) => {
		router.push(`/?s=${slug}`, { scroll: false });
	};

	const dashboardHref = getDashboardUrl(profile?.role as string);

	return (
		<div className="w-full min-w-0">
			<HomeHeroSection
				user={user}
				loading={loading}
				dashboardHref={dashboardHref}
				packages={businessPackages}
			/>
			<HomeStatsSection stats={stats} />
			<HomeServicesSection
				services={initialServices}
				isDetailOpen={false}
				onServiceClick={handleServiceClick}
			/>
			<GallerySection items={galleryItems} />
			<TestimonialSection testimonials={testimonials} />
			<HomeBusinessPackagesSection packages={businessPackages} />
			<HomeCtaSection />

			{/* Service Detail Modal (Isolasi useSearchParams dari tree utama) */}
			<Suspense fallback={null}>
				<ServiceDetailUrlModal services={initialServices} />
			</Suspense>
		</div>
	);
}
