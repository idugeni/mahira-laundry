"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { BusinessPackage } from "@/lib/types";

interface HomeBusinessPackagesSectionProps {
	packages: BusinessPackage[];
}

const TIER_STYLE: Record<
	string,
	{ badge: string; accent: string; featured: boolean }
> = {
	Starter: {
		badge: "bg-blue-100 text-blue-700",
		accent: "border-blue-200",
		featured: false,
	},
	Standard: {
		badge: "bg-emerald-100 text-emerald-700",
		accent: "border-emerald-400 ring-2 ring-emerald-100",
		featured: true,
	},
	Premium: {
		badge: "bg-purple-100 text-purple-700",
		accent: "border-purple-200",
		featured: false,
	},
	Custom: {
		badge: "bg-orange-100 text-orange-700",
		accent: "border-orange-200",
		featured: false,
	},
};

function formatIDR(amount: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);
}

export function HomeBusinessPackagesSection({
	packages,
}: HomeBusinessPackagesSectionProps) {
	if (packages.length === 0) return null;

	return (
		<section className="py-20 bg-gradient-to-b from-slate-50 to-white">
			<div className="container mx-auto px-4">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-14"
				>
					<span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-black uppercase tracking-widest mb-4">
						Kemitraan Usaha
					</span>
					<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
						Buka Usaha Laundry{" "}
						<span className="text-brand-primary">Bersama Kami</span>
					</h2>
					<p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
						Mulai bisnis laundry dengan dukungan penuh dari Mahira — mesin,
						training, branding, dan sistem manajemen sudah termasuk.
					</p>
				</motion.div>

				{/* Package Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{packages.slice(0, 3).map((pkg, i) => {
						const style = TIER_STYLE[pkg.tier] ?? TIER_STYLE.Starter;
						const isPromoActive =
							pkg.promo_price != null &&
							pkg.promo_expires_at != null &&
							new Date(pkg.promo_expires_at) > new Date();

						return (
							<motion.div
								key={pkg.id}
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className={`relative flex flex-col rounded-3xl border-2 bg-white p-7 shadow-sm hover:shadow-lg transition-shadow ${style.accent}`}
							>
								{style.featured && (
									<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow">
										Paling Populer
									</div>
								)}

								{/* Tier badge */}
								<span
									className={`self-start rounded-full px-3 py-0.5 text-xs font-bold ${style.badge}`}
								>
									{pkg.tier}
								</span>

								{/* Name */}
								<h3 className="mt-3 text-lg font-black text-slate-900">
									{pkg.name}
								</h3>

								{/* Price */}
								<div className="mt-3">
									{isPromoActive ? (
										<div className="flex items-baseline gap-2">
											<span className="text-2xl font-black text-red-600">
												{formatIDR(pkg.promo_price as number)}
											</span>
											<span className="text-sm text-slate-400 line-through">
												{formatIDR(pkg.price)}
											</span>
										</div>
									) : (
										<span className="text-2xl font-black text-slate-900">
											{formatIDR(pkg.price)}
										</span>
									)}
									{pkg.estimated_roi && (
										<p className="text-xs text-slate-400 mt-0.5">
											Estimasi balik modal: {pkg.estimated_roi}
										</p>
									)}
								</div>

								{/* Top 4 items */}
								<ul className="mt-5 space-y-2 flex-1">
									{pkg.items.slice(0, 4).map((item) => (
										<li
											key={item.name}
											className="flex items-start gap-2 text-sm text-slate-600"
										>
											<CheckCircle2
												size={15}
												className="text-brand-primary shrink-0 mt-0.5"
											/>
											<span>
												{item.quantity != null ? `${item.quantity}× ` : ""}
												{item.name}
											</span>
										</li>
									))}
									{pkg.items.length > 4 && (
										<li className="text-xs text-slate-400 pl-5">
											+{pkg.items.length - 4} item lainnya
										</li>
									)}
								</ul>

								{/* CTA */}
								<Link
									href={`/paket-usaha#inquiry-form`}
									className={`mt-6 w-full rounded-xl py-3 text-sm font-black text-center transition-all ${
										style.featured
											? "bg-brand-primary text-white hover:bg-brand-primary/90"
											: "bg-slate-100 text-slate-800 hover:bg-slate-200"
									}`}
								>
									Ajukan Inquiry
								</Link>
							</motion.div>
						);
					})}
				</div>

				{/* View all link */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="text-center mt-10"
				>
					<Link
						href="/paket-usaha"
						className="inline-flex items-center gap-2 text-brand-primary font-black text-sm hover:gap-3 transition-all"
					>
						Lihat Detail & Bandingkan Semua Paket
						<ArrowRight size={16} />
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
