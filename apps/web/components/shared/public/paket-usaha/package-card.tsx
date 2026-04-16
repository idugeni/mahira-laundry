"use client";

import Image from "next/image";
import type { BusinessPackage } from "@/lib/types";
import PromoCountdown from "./promo-countdown";

interface PackageCardProps {
	package: BusinessPackage;
	onInquiry: (pkg: BusinessPackage) => void;
}

const tierConfig: Record<string, { label: string; className: string }> = {
	Starter: {
		label: "Starter",
		className: "bg-blue-100 text-blue-700 border border-blue-200",
	},
	Standard: {
		label: "Standard",
		className: "bg-green-100 text-green-700 border border-green-200",
	},
	Premium: {
		label: "Premium",
		className: "bg-purple-100 text-purple-700 border border-purple-200",
	},
	Custom: {
		label: "Custom",
		className: "bg-orange-100 text-orange-700 border border-orange-200",
	},
};

function formatIDR(amount: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);
}

function isPromoActive(
	promoPrice: number | null | undefined,
	promoExpiresAt: string | null | undefined,
): boolean {
	if (promoPrice == null || !promoExpiresAt) return false;
	return new Date(promoExpiresAt) > new Date();
}

export function PackageCard({ package: pkg, onInquiry }: PackageCardProps) {
	const tier = tierConfig[pkg.tier] ?? {
		label: pkg.tier,
		className: "bg-gray-100 text-gray-700 border border-gray-200",
	};

	const promoActive = isPromoActive(pkg.promo_price, pkg.promo_expires_at);
	const MAX_ITEMS = 5;
	const visibleItems = pkg.items.slice(0, MAX_ITEMS);
	const extraCount = pkg.items.length - MAX_ITEMS;

	return (
		<div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
			{/* Featured ribbon */}
			{pkg.is_featured && (
				<div className="absolute top-4 right-0 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-l-full shadow">
					⭐ Unggulan
				</div>
			)}

			{/* Image */}
			{pkg.image_url && (
				<div className="relative h-48 w-full">
					<Image
						src={pkg.image_url}
						alt={pkg.name}
						fill
						className="object-cover"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				</div>
			)}

			<div className="flex flex-1 flex-col p-6">
				{/* Tier badge */}
				<span
					className={`inline-block self-start rounded-full px-3 py-0.5 text-xs font-semibold ${tier.className}`}
				>
					{tier.label}
				</span>

				{/* Package name */}
				<h3 className="mt-3 text-xl font-bold text-gray-900">{pkg.name}</h3>

				{/* Description */}
				{pkg.description && (
					<p className="mt-1 text-sm text-gray-500 line-clamp-2">
						{pkg.description}
					</p>
				)}

				{/* Price section */}
				<div className="mt-4">
					{promoActive ? (
						<>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-bold text-red-600">
									{formatIDR(pkg.promo_price as number)}
								</span>
								<span className="text-sm text-gray-400 line-through">
									{formatIDR(pkg.price)}
								</span>
							</div>
							<PromoCountdown expiresAt={pkg.promo_expires_at as string} />
						</>
					) : (
						<span className="text-2xl font-bold text-gray-900">
							{formatIDR(pkg.price)}
						</span>
					)}
				</div>

				{/* Items list */}
				{pkg.items.length > 0 && (
					<ul className="mt-4 flex-1 space-y-1.5">
						{visibleItems.map((item) => (
							<li
								key={item.name}
								className="flex items-start gap-2 text-sm text-gray-700"
							>
								<span className="mt-0.5 text-green-500 shrink-0">✓</span>
								<span>
									{item.quantity != null ? `${item.quantity}x ` : ""}
									{item.name}
									{item.spec ? ` (${item.spec})` : ""}
								</span>
							</li>
						))}
						{extraCount > 0 && (
							<li className="text-sm text-gray-400 pl-5">
								dan {extraCount} item lainnya
							</li>
						)}
					</ul>
				)}

				{/* CTA button */}
				<button
					type="button"
					onClick={() => onInquiry(pkg)}
					className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
				>
					Ajukan Inquiry
				</button>
			</div>
		</div>
	);
}
