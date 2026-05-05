"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import type { BusinessPackage } from "@/lib/types";

interface HomeBusinessPackagesSectionProps {
	packages: BusinessPackage[];
}

const TIER_STYLE: Record<
	string,
	{ badge: string; accent: string; featured: boolean; gradient: string }
> = {
	Starter: {
		badge: "bg-blue-100 text-blue-700",
		accent: "border-blue-100 shadow-xs",
		featured: false,
		gradient: "from-blue-500/5 to-transparent",
	},
	Standard: {
		badge: "bg-emerald-100 text-emerald-700",
		accent: "border-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.15)]",
		featured: true,
		gradient: "from-emerald-500/5 to-transparent",
	},
	Premium: {
		badge: "bg-purple-100 text-purple-700",
		accent: "border-purple-100 shadow-xs",
		featured: false,
		gradient: "from-purple-500/5 to-transparent",
	},
	Custom: {
		badge: "bg-orange-100 text-orange-700",
		accent: "border-orange-100 shadow-xs",
		featured: false,
		gradient: "from-orange-500/5 to-transparent",
	},
};
const DEFAULT_TIER_STYLE = {
	badge: "bg-blue-100 text-blue-700",
	accent: "border-blue-100 shadow-xs",
	featured: false,
	gradient: "from-blue-500/5 to-transparent",
};

function formatIDR(amount: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);
}

function PackageCard({ pkg, index }: { pkg: BusinessPackage; index: number }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const style = TIER_STYLE[pkg.tier] ?? DEFAULT_TIER_STYLE;
	const isPromoActive =
		pkg.promo_price != null &&
		pkg.promo_expires_at != null &&
		new Date(pkg.promo_expires_at) > new Date();

	const discount = isPromoActive
		? Math.round(((pkg.price - (pkg.promo_price as number)) / pkg.price) * 100)
		: 0;

	const visibleItems = isExpanded ? pkg.items : pkg.items.slice(0, 4);

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			whileHover={{ y: -6 }}
			viewport={{ once: false }}
			transition={{
				duration: 0.7,
				delay: index * 0.1,
				ease: [0.16, 1, 0.3, 1],
			}}
			className={`relative flex flex-col h-full rounded-[2rem] border bg-white p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] min-w-0 ${style.accent}`}
		>
			<div
				className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none rounded-[2rem]`}
			/>

			{style.featured && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="absolute -top-px left-1/2 -translate-x-1/2 z-20"
				>
					<span className="inline-flex px-6 py-2 rounded-b-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200/50 whitespace-nowrap">
						Paling Populer
					</span>
				</motion.div>
			)}

			<div className="relative z-10 flex flex-col h-full pt-4">
				<div className="flex justify-center">
					<span
						className={`inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${style.badge}`}
					>
						{pkg.tier} Tier
					</span>
				</div>

				<h3 className="mt-6 text-2xl md:text-3xl font-black text-slate-900 leading-tight text-center sm:text-left">
					{pkg.name}
				</h3>

				<div className="mt-4 flex flex-col items-center sm:items-start">
					{isPromoActive ? (
						<div className="flex flex-col items-center sm:items-start gap-1.5">
							<span className="inline-flex items-center gap-2">
								<span className="text-sm text-slate-400 line-through font-bold">
									{formatIDR(pkg.price)}
								</span>
								<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
									-{discount}%
								</span>
							</span>
							<span className="text-3xl md:text-4xl font-black text-red-600 tracking-tighter">
								{formatIDR(pkg.promo_price as number)}
							</span>
						</div>
					) : (
						<span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter break-words">
							{formatIDR(pkg.price)}
						</span>
					)}
					{pkg.estimated_roi && (
						<div className="flex items-center gap-2 mt-2">
							<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
							<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
								ROI: {pkg.estimated_roi}
							</p>
						</div>
					)}
				</div>

				<div className="my-8 h-px bg-slate-100" />

				<div className="flex-1 min-h-[160px]">
					<ul className="space-y-3">
						<AnimatePresence mode="popLayout">
							{visibleItems.map((item, i) => (
								<motion.li
									key={`${item.name}-${item.quantity ?? "item"}-${item.spec ?? "none"}`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.05 }}
									className="flex items-start gap-3 text-sm text-slate-600 font-medium"
								>
									<div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-brand-primary"
											aria-hidden="true"
										>
											<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
											<polyline points="22 4 12 14.01 9 11.01" />
										</svg>
									</div>
									<div className="flex flex-col min-w-0">
										<span>
											{item.quantity != null ? (
												<span className="font-black text-slate-900 mr-1">
													{item.quantity}
													{item.unit ? ` ${item.unit}` : "×"}{" "}
												</span>
											) : (
												""
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
					{pkg.items.length > 4 && (
						<motion.button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							whileHover={{ x: 5 }}
							aria-expanded={isExpanded}
							className="mt-6 text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] hover:underline underline-offset-8 flex items-center justify-center sm:justify-start gap-2"
						>
							{isExpanded ? "Tampilkan Sedikit" : `+${pkg.items.length - 4} Item Lainnya`}
							<motion.div
								animate={{ rotate: isExpanded ? 180 : 0 }}
								transition={{ duration: 0.2 }}
								className="w-4 h-4"
							>
								<ChevronDown size={14} />
							</motion.div>
						</motion.button>
					)}
				</div>

				<div className="mt-10">
					<a
						href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890"}?text=${encodeURIComponent(`Halo Mahira Laundry, saya tertarik dengan Paket Usaha ${pkg.name}. Bisa bantu jelaskan detailnya?`)}`}
						target="_blank"
						rel="noopener noreferrer"
						className={`flex items-center justify-center gap-3 w-full rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
							style.featured
								? "bg-brand-primary text-white shadow-brand-primary/20 hover:shadow-brand-primary/40"
								: "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800"
						}`}
					>
						Tanya via WhatsApp
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<line x1="5" y1="12" x2="19" y2="12" />
							<polyline points="12 5 19 12 12 19" />
						</svg>
					</a>
				</div>
			</div>
		</motion.div>
	);
}

export function HomeBusinessPackagesSection({ packages }: HomeBusinessPackagesSectionProps) {
	if (packages.length === 0) return null;

	return (
		<section className="py-14 sm:py-16 relative overflow-hidden bg-white w-full min-w-0">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
				className="absolute -top-8 right-0 w-48 sm:w-64 h-48 sm:h-64 border-[20px] sm:border-[32px] border-slate-50 rounded-full opacity-50"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 text-center md:text-left">
					<div className="max-w-2xl text-center md:text-left">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: false }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-primary/10"
						>
							<span className="text-sm">
								<MdOutlineLocalLaundryService />
							</span>
							<span>Investment Plan</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: false }}
							className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]"
						>
							Pilih Paket <br />
							<span className="text-brand-gradient">Usaha Anda.</span>
						</motion.h2>
					</div>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: false }}
						transition={{ delay: 0.3 }}
						className="text-lg text-slate-500 font-medium max-w-sm text-center md:text-left mx-auto md:mx-0"
					>
						Sistem autopilot yang dirancang untuk memberikan ROI tercepat dalam industri laundry.
					</motion.p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-md md:max-w-none mx-auto md:mx-0">
					{packages.slice(0, 3).map((pkg, i) => (
						<PackageCard key={pkg.id} pkg={pkg} index={i} />
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false }}
					className="text-center mt-20"
				>
					<Link
						href="/paket-usaha"
						className="group inline-flex items-center gap-4 px-8 py-4 bg-slate-50 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100"
					>
						Lihat Detail &amp; Bandingkan Semua
						<motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
							<HiOutlineArrowRight size={18} />
						</motion.div>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
