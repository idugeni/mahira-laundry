"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
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
		accent: "border-blue-100 shadow-sm",
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
		accent: "border-purple-100 shadow-sm",
		featured: false,
		gradient: "from-purple-500/5 to-transparent",
	},
	Custom: {
		badge: "bg-orange-100 text-orange-700",
		accent: "border-orange-100 shadow-sm",
		featured: false,
		gradient: "from-orange-500/5 to-transparent",
	},
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
	const style = TIER_STYLE[pkg.tier] ?? TIER_STYLE.Starter;
	const isPromoActive =
		pkg.promo_price != null &&
		pkg.promo_expires_at != null &&
		new Date(pkg.promo_expires_at) > new Date();

	const visibleItems = isExpanded ? pkg.items : pkg.items.slice(0, 4);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{
				duration: 0.7,
				delay: index * 0.1,
				ease: [0.16, 1, 0.3, 1],
			}}
			whileHover={{ y: -10 }}
			className={`relative flex flex-col h-full rounded-[2rem] border bg-white p-6 sm:p-8 transition-all duration-500 overflow-hidden ${style.accent}`}
		>
			<div
				className={`absolute inset-0 bg-gradient-to-br ${style.gradient} pointer-events-none`}
			/>

			{style.featured && (
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="absolute -top-1 left-1/2 -translate-x-1/2 px-6 py-2 rounded-b-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 z-10"
				>
					Paling Populer
				</motion.div>
			)}

			<div className="relative z-10 flex flex-col h-full">
				{/* Tier badge */}
				<span
					className={`inline-block self-start rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${style.badge}`}
				>
					{pkg.tier} Tier
				</span>

				{/* Name */}
				<h3 className="mt-6 text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
					{pkg.name}
				</h3>

				{/* Price */}
				<div className="mt-4 flex flex-col">
					{isPromoActive ? (
						<div className="flex flex-col">
							<span className="text-sm text-slate-400 line-through font-bold">
								{formatIDR(pkg.price)}
							</span>
							<span className="text-3xl lg:text-4xl font-black text-red-600 tracking-tighter">
								{formatIDR(pkg.promo_price as number)}
							</span>
						</div>
					) : (
						<span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">
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

				{/* Divider */}
				<div className="my-8 h-px bg-slate-100" />

				{/* Items list */}
				<div className="flex-1 min-h-[160px]">
					<ul className="space-y-3">
						<AnimatePresence mode="popLayout" initial={false}>
							{visibleItems.map((item, i) => (
								<motion.li
									layout
									key={item.name}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ delay: i * 0.05 }}
									className="flex items-start gap-3 text-sm text-slate-600 font-medium"
								>
									<div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
										<CheckCircle2 size={12} className="text-brand-primary" />
									</div>
									<span>
										{item.quantity != null ? (
											<span className="font-black text-slate-900">
												{item.quantity}×{" "}
											</span>
										) : (
											""
										)}
										{item.name}
									</span>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>
					{pkg.items.length > 4 && (
						<motion.button
							layout
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							whileHover={{ x: 5 }}
							className="mt-6 text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] hover:underline underline-offset-8 flex items-center gap-2"
						>
							{isExpanded
								? "Tampilkan Sedikit"
								: `+${pkg.items.length - 4} Item Lainnya`}
							<motion.div
								animate={{ rotate: isExpanded ? 180 : 0 }}
								className="w-4 h-4"
							>
								<ArrowRight size={14} />
							</motion.div>
						</motion.button>
					)}
				</div>

				{/* CTA */}
				<motion.div layout className="mt-10">
					<motion.a
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
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
						<ArrowRight size={16} />
					</motion.a>
				</motion.div>
			</div>
		</motion.div>
	);
}

export function HomeBusinessPackagesSection({
	packages,
}: HomeBusinessPackagesSectionProps) {
	if (packages.length === 0) return null;

	return (
		<section className="py-24 relative overflow-hidden bg-white">
			{/* Decorative Elements */}
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
				className="absolute -top-24 -right-24 w-96 h-96 border-[40px] border-slate-50 rounded-full opacity-50"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 text-center lg:text-left">
					<div className="max-w-2xl">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
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
							viewport={{ once: true }}
							className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]"
						>
							Pilih Paket <br />
							<span className="text-brand-gradient">Usaha Anda.</span>
						</motion.h2>
					</div>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="text-lg text-slate-500 font-medium max-w-sm"
					>
						Sistem autopilot yang dirancang untuk memberikan ROI tercepat dalam
						industri laundry.
					</motion.p>
				</div>

				{/* Package Cards */}
				<LayoutGroup>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{packages.slice(0, 3).map((pkg, i) => (
							<PackageCard key={pkg.id} pkg={pkg} index={i} />
						))}
					</div>
				</LayoutGroup>

				{/* View all link */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mt-20"
				>
					<motion.div whileHover={{ scale: 1.05 }} className="inline-block">
						<Link
							href="/paket-usaha"
							className="group inline-flex items-center gap-4 px-8 py-4 bg-slate-50 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
						>
							Lihat Detail & Bandingkan Semua
							<motion.div
								animate={{ x: [0, 5, 0] }}
								transition={{ repeat: Infinity, duration: 1.5 }}
							>
								<ArrowRight size={18} className="text-brand-primary" />
							</motion.div>
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
