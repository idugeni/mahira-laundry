"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import {
	HiOutlineArrowDown,
	HiOutlineCheck,
	HiOutlineChevronDown,
	HiOutlineChevronUp,
	HiOutlineInformationCircle,
	HiOutlineSparkles,
} from "react-icons/hi2";
import PromoCountdown from "@/components/shared/public/paket-usaha/promo-countdown";
import type { BusinessPackage } from "@/lib/types";

interface PackageCardProps {
	package: BusinessPackage;
}

const tierConfig: Record<
	string,
	{ label: string; className: string; icon: string }
> = {
	Starter: {
		label: "Starter",
		className: "bg-blue-50 text-blue-600 border-blue-100",
		icon: "🌱",
	},
	Standard: {
		label: "Standard",
		className: "bg-emerald-50 text-emerald-600 border-emerald-100",
		icon: "🚀",
	},
	Premium: {
		label: "Premium",
		className: "bg-purple-50 text-purple-600 border-purple-100",
		icon: "👑",
	},
	Custom: {
		label: "Custom",
		className: "bg-orange-50 text-orange-600 border-orange-100",
		icon: "⚙️",
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

export function PackageCard({ package: pkg }: PackageCardProps) {
	const tier = tierConfig[pkg.tier] ?? {
		label: pkg.tier,
		className: "bg-slate-50 text-slate-600 border-slate-100",
		icon: "📦",
	};

	const promoActive = isPromoActive(pkg.promo_price, pkg.promo_expires_at);
	const [isExpanded, setIsExpanded] = useState(false);
	const MAX_ITEMS = 6;
	const visibleItems = isExpanded ? pkg.items : pkg.items.slice(0, MAX_ITEMS);
	const extraCount = pkg.items.length - MAX_ITEMS;

	return (
		<motion.div
			whileHover={{ y: -12 }}
			className="group relative flex flex-col h-full rounded-[3rem] border border-slate-100 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] hover:border-brand-primary/20 overflow-hidden"
		>
			{/* Featured ribbon - Ultra Premium Style */}
			{pkg.is_featured && (
				<div className="absolute top-8 right-0 z-20">
					<div className="bg-gradient-to-r from-brand-accent to-orange-400 text-slate-900 text-[10px] font-black px-5 py-2 rounded-l-full shadow-xl flex items-center gap-2 uppercase tracking-[0.2em]">
						<span className="animate-pulse">
							<HiOutlineSparkles />
						</span>
						Rekomendasi
					</div>
				</div>
			)}

			{/* Image with Advanced Overlay */}
			{pkg.image_url && (
				<div className="relative h-64 w-full overflow-hidden">
					<Image
						src={pkg.image_url}
						alt={pkg.name}
						fill
						className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
				</div>
			)}

			<div className="flex flex-1 flex-col p-10 lg:p-12">
				{/* Tier Info - Cleaned up (No ID) */}
				<div className="flex items-center gap-3 mb-6">
					<span
						className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border ${tier.className}`}
					>
						<span>{tier.icon}</span>
						{tier.label}
					</span>
				</div>

				{/* Package name - Stronger Typography */}
				<h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-[1.1]">
					{pkg.name}
				</h3>

				{/* Description - Elegant Italic */}
				{pkg.description && (
					<p className="mt-4 text-base text-slate-500 font-medium leading-relaxed italic opacity-80">
						"{pkg.description}"
					</p>
				)}

				{/* Price Section - Ultra Premium Promo Highlight */}
				<div
					className={`mt-10 mb-10 p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 ${
						promoActive
							? "bg-brand-primary/5 border-brand-primary/10 shadow-inner"
							: "bg-slate-50 border-slate-100"
					}`}
				>
					{/* Decorative Icon */}
					<div
						className={`absolute -top-2 -right-2 p-4 transition-colors ${
							promoActive ? "text-brand-primary/10" : "text-slate-100"
						}`}
					>
						<HiOutlineInformationCircle size={64} />
					</div>

					<p
						className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${
							promoActive ? "text-brand-primary" : "text-slate-400"
						}`}
					>
						Modal Investasi
					</p>

					{promoActive ? (
						<div className="flex flex-col gap-1">
							<div className="flex items-baseline gap-3 flex-wrap">
								<span className="text-4xl font-black text-brand-primary tracking-tighter">
									{formatIDR(pkg.promo_price as number)}
								</span>
								<span className="text-lg text-slate-300 line-through font-bold opacity-60">
									{formatIDR(pkg.price)}
								</span>
							</div>
							<div className="mt-6">
								<PromoCountdown expiresAt={pkg.promo_expires_at as string} />
							</div>
						</div>
					) : (
						<span className="text-4xl font-black text-slate-900 tracking-tighter">
							{formatIDR(pkg.price)}
						</span>
					)}
				</div>

				{/* Items list - Detailed & Clean */}
				{pkg.items.length > 0 && (
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-px flex-1 bg-slate-100" />
							<p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
								Fasilitas Lengkap
							</p>
							<div className="h-px flex-1 bg-slate-100" />
						</div>

						<ul className="space-y-4">
							<AnimatePresence mode="popLayout">
								{visibleItems.map((item, idx) => (
									<motion.li
										key={`${item.name}-${idx}`}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.05 }}
										className="flex items-start gap-4 text-[15px] text-slate-600 font-medium"
									>
										<span className="mt-1 text-brand-primary shrink-0 bg-brand-primary/10 p-1 rounded-lg">
											<HiOutlineCheck size={14} />
										</span>
										<div className="flex flex-col">
											<span>
												{item.quantity != null && (
													<span className="font-black text-slate-900 mr-1">
														{item.quantity}x{" "}
													</span>
												)}
												{item.name}
											</span>
											{item.spec && (
												<span className="text-xs text-slate-400 font-normal mt-1 leading-tight">
													{item.spec}
												</span>
											)}
										</div>
									</motion.li>
								))}
							</AnimatePresence>
						</ul>

						{extraCount > 0 && (
							<motion.button
								whileHover={{ x: 5 }}
								type="button"
								onClick={() => setIsExpanded(!isExpanded)}
								className="mt-8 text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-70 transition-opacity"
							>
								<div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
									{isExpanded ? (
										<HiOutlineChevronUp size={12} />
									) : (
										<HiOutlineChevronDown size={12} />
									)}
								</div>
								{isExpanded
									? "Tampilkan Utama"
									: `+${extraCount} Fasilitas Lainnya`}
							</motion.button>
						)}
					</div>
				)}

				{/* Action Button - High Contrast */}
				<motion.a
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890"}?text=${encodeURIComponent(`Halo Mahira Laundry, saya tertarik dengan Paket Usaha ${pkg.name}. Bisa bantu jelaskan detailnya?`)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-8 w-full rounded-[2rem] bg-slate-900 px-8 py-4.5 text-[10px] font-black uppercase tracking-[0.3em] text-white text-center shadow-2xl shadow-slate-200 transition-all hover:bg-brand-primary hover:shadow-brand-primary/30 flex items-center justify-center gap-4 group/btn"
				>
					<span>Konsultasi Sekarang</span>
					<span className="-rotate-90 group-hover/btn:translate-y-1 transition-transform">
						<HiOutlineArrowDown size={18} />
					</span>
				</motion.a>
			</div>
		</motion.div>
	);
}
