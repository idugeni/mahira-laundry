"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import {
	HiOutlineArrowDown,
	HiOutlineCheck,
	HiOutlineChevronDown,
	HiOutlineChevronUp,
	HiOutlineRocketLaunch,
	HiOutlineShieldCheck,
	HiOutlineSparkles,
	HiOutlineTrophy,
} from "react-icons/hi2";
import PromoCountdown from "@/components/shared/public/paket-usaha/promo-countdown";
import type { BusinessPackage } from "@/lib/types";

interface PackageCardProps {
	package: BusinessPackage;
}

const tierConfig: Record<
	string,
	{
		label: string;
		className: string;
		icon: string;
		gradient: string;
		glow: string;
	}
> = {
	Starter: {
		label: "Starter",
		className: "bg-blue-50 text-blue-600 border-blue-100",
		icon: "🌱",
		gradient: "from-blue-500 to-cyan-400",
		glow: "shadow-blue-500/20",
	},
	Standard: {
		label: "Standard",
		className: "bg-emerald-50 text-emerald-600 border-emerald-100",
		icon: "🚀",
		gradient: "from-emerald-500 to-teal-400",
		glow: "shadow-emerald-500/20",
	},
	Premium: {
		label: "Premium",
		className: "bg-purple-50 text-purple-600 border-purple-100",
		icon: "👑",
		gradient: "from-purple-500 to-pink-400",
		glow: "shadow-purple-500/20",
	},
	Custom: {
		label: "Custom",
		className: "bg-orange-50 text-orange-600 border-orange-100",
		icon: "⚙️",
		gradient: "from-orange-500 to-amber-400",
		glow: "shadow-orange-500/20",
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
		gradient: "from-slate-500 to-slate-400",
		glow: "shadow-slate-500/20",
	};

	const promoActive = isPromoActive(pkg.promo_price, pkg.promo_expires_at);
	const [isExpanded, setIsExpanded] = useState(false);
	const MAX_ITEMS = 6;
	const visibleItems = isExpanded ? pkg.items : pkg.items.slice(0, MAX_ITEMS);
	const extraCount = pkg.items.length - MAX_ITEMS;

	return (
		<motion.div className="relative flex flex-col h-full rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-10 transition-all duration-500 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200">
			{/* Animated background glow */}
			<div
				className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${tier.gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-15 transition-opacity duration-700`}
			/>

			{/* Featured Ribbon - Clean diagonal top-right corner */}
			{pkg.is_featured && (
				<div className="absolute top-0 right-0 w-[140px] h-[140px] overflow-hidden z-20">
					<div className="absolute top-[26px] right-[-36px] rotate-45 bg-gradient-to-r from-brand-accent to-orange-400 text-slate-900 text-[9px] font-black px-8 py-1.5 text-center uppercase tracking-[0.2em] shadow-lg shadow-brand-accent/20 whitespace-nowrap">
						<span className="inline-flex items-center gap-1.5">
							<HiOutlineSparkles size={12} />
							Rekomendasi
						</span>
					</div>
				</div>
			)}

			{/* Image with Advanced Overlay */}
			{pkg.image_url && (
				<div className="relative h-64 w-[calc(100%+4rem)] sm:w-[calc(100%+5rem)] -ml-8 sm:-ml-10 -mt-8 sm:-mt-10 overflow-hidden rounded-2xl z-0">
					<Image
						src={pkg.image_url}
						alt={pkg.name}
						fill
						className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
				</div>
			)}

			<div className="flex flex-1 flex-col pt-6 pb-2">
				{/* Tier Info + Franchise Status */}
				<div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
					<span
						className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border ${tier.className}`}
					>
						<span>{tier.icon}</span>
						{tier.label}
					</span>

					{/* Franchise Status Badge */}
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
						</span>
						Open Now
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

				{/* Estimasi Profit / ROI Section - Modern Glassmorphism */}
				{pkg.estimated_roi && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-8 relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand-primary/5 via-emerald-50/50 to-brand-accent/5 border border-brand-primary/10 p-5"
					>
						{/* Subtle animated shimmer */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />

						<div className="relative z-10">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<span className="text-brand-primary">
										<HiOutlineTrophy size={16} />
									</span>
									<span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
										Estimasi Profit
									</span>
								</div>
								<span className="inline-flex items-center gap-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.15em] text-brand-accent">
									<HiOutlineRocketLaunch size={10} />
									ROI Cepat & Teruji
								</span>
							</div>
							<p className="text-xl font-black text-slate-900 tracking-tight">
								{pkg.estimated_roi}
							</p>
						</div>
					</motion.div>
				)}

				{/* Price Section - Ultra Premium Promo Highlight */}
				<div
					className={`mt-8 mb-8 p-8 rounded-[2rem] border relative overflow-hidden transition-all duration-500 ${
						promoActive
							? "bg-brand-primary/5 border-brand-primary/20 shadow-lg shadow-brand-primary/10"
							: "bg-slate-900 border-slate-800 shadow-xl shadow-slate-900/20"
					}`}
				>
					{/* Verified badge centered at top */}
					<div className="flex justify-center mb-4">
						<span
							className={`inline-flex items-center gap-1.5 rounded-full backdrop-blur-sm px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.15em] ${promoActive ? "bg-brand-primary/10 text-brand-primary/50" : "bg-white/10 text-white/60"}`}
						>
							<HiOutlineShieldCheck size={10} />
							Verified
						</span>
					</div>

					<p
						className={`text-center text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${
							promoActive ? "text-brand-primary" : "text-slate-400"
						}`}
					>
						Modal Investasi
					</p>

					{promoActive ? (
						<div className="flex flex-col items-center gap-1">
							<div className="flex items-baseline gap-3 flex-wrap justify-center">
								<span className="text-4xl font-black text-brand-primary tracking-tighter">
									{formatIDR(pkg.promo_price as number)}
								</span>
								<span className="text-lg text-slate-500 line-through font-bold opacity-60">
									{formatIDR(pkg.price)}
								</span>
							</div>
							<div className="mt-6">
								<PromoCountdown expiresAt={pkg.promo_expires_at as string} />
							</div>
						</div>
					) : (
						<span className="text-5xl font-black text-white tracking-tighter block text-center">
							{formatIDR(pkg.price)}
						</span>
					)}
				</div>

				{/* Items list - Detailed & Clean */}
				{pkg.items.length > 0 && (
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-px flex-1 bg-slate-100" />
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
								Fasilitas Lengkap
							</p>
							<div className="h-px flex-1 bg-slate-100" />
						</div>

						<ul className="space-y-4">
							<AnimatePresence mode="popLayout">
								{visibleItems.map((item, idx) => (
									<motion.li
										key={item.name}
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
													<span className="font-black text-slate-900 mr-1">{item.quantity}x </span>
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
								{isExpanded ? "Tampilkan Utama" : `+${extraCount} Fasilitas Lainnya`}
							</motion.button>
						)}
					</div>
				)}

				{/* Action Button - High Contrast */}
				<motion.a
					href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890"}?text=${encodeURIComponent(`Halo Mahira Laundry, saya tertarik dengan Paket Usaha ${pkg.name}. Bisa bantu jelaskan detailnya?`)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-8 w-full rounded-[2rem] bg-slate-900 px-8 py-4.5 text-[10px] font-black uppercase tracking-[0.3em] text-white text-center shadow-2xl shadow-slate-200 transition-all hover:bg-brand-primary hover:shadow-brand-primary/30 flex items-center justify-center gap-4 group/btn"
				>
					<span>Konsultasi Sekarang</span>
					<span className="-rotate-90">
						<HiOutlineArrowDown size={18} />
					</span>
				</motion.a>
			</div>
		</motion.div>
	);
}
