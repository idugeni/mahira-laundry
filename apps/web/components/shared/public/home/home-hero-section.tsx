"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { HiOutlineArrowRight, HiOutlineSparkles } from "react-icons/hi2";
import { MdOutlineLocalLaundryService, MdOutlineRocketLaunch } from "react-icons/md";
import { Badge } from "@/components/ui/badge";

import type { BusinessPackage } from "@/lib/types";

const tierBadgeColors: Record<string, string> = {
	Starter: "bg-blue-50 text-blue-600 border-blue-200",
	Standard: "bg-emerald-50 text-emerald-600 border-emerald-200",
	Premium: "bg-purple-50 text-purple-600 border-purple-200",
	Custom: "bg-orange-50 text-orange-600 border-orange-200",
};
const defaultBadgeColor = "bg-slate-50 text-slate-600 border-slate-200";

function isPromoActive(pkg: BusinessPackage): boolean {
	return (
		pkg.promo_price != null &&
		pkg.promo_expires_at != null &&
		new Date(pkg.promo_expires_at) > new Date()
	);
}

function getEffectivePrice(pkg: BusinessPackage): number {
	return isPromoActive(pkg) ? (pkg.promo_price as number) : pkg.price;
}

interface HomeHeroSectionProps {
	user: unknown;
	loading: boolean;
	dashboardHref: string;
	packages?: BusinessPackage[];
}

export function HomeHeroSection({ packages = [] }: HomeHeroSectionProps) {
	const containerRef = useRef(null);
	const { scrollY } = useScroll();

	// Use Spring for smoother scroll animations (fixes jitter/choppiness)
	const smoothScrollY = useSpring(scrollY, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const y1 = useTransform(smoothScrollY, [0, 500], [0, 50]);
	const y2 = useTransform(smoothScrollY, [0, 500], [0, -40]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
		},
	};

	return (
		<section
			ref={containerRef}
			className="relative w-full min-w-0 lg:min-h-screen pt-10 sm:pt-12 md:pt-14 lg:pt-16 pb-8 lg:pb-4 flex flex-col"
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(219,39,119,0.08),transparent)]" />
				<motion.div
					style={{ y: y1 }}
					className="absolute -top-10 right-[8%] max-w-[70vw] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(219,39,119,0.12)_0%,transparent_70%)] hidden md:block"
				/>
				<motion.div
					style={{ y: y2 }}
					className="absolute -bottom-20 left-0 max-w-[70vw] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.10)_0%,transparent_70%)] hidden md:block"
				/>
				<motion.div
					animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
					transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[30%] left-[5%] max-w-[70vw] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.08)_0%,transparent_70%)] hidden md:block"
				/>
				<motion.div
					animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
					transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[40%] right-[15%] max-w-[60vw] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.06)_0%,transparent_70%)] hidden md:block"
				/>
				<motion.div
					animate={{ x: [0, 15, 0] }}
					transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[10%] left-[25%] max-w-[50vw] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(190,24,93,0.05)_0%,transparent_70%)] hidden md:block"
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex-1 flex items-start w-full min-w-0">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full min-w-0">
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="text-center lg:text-left flex flex-col items-center lg:items-start min-w-0"
					>
						<motion.div
							variants={itemVariants}
							className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black mb-8 border border-brand-primary/20 shadow-xs uppercase tracking-[0.2em]"
						>
							<motion.span
								animate={{ rotate: 360 }}
								transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
								className="w-4 h-4 flex items-center justify-center"
							>
								<HiOutlineSparkles />
							</motion.span>
							<span>Terpercaya Sejak 2023</span>
						</motion.div>

						<motion.h1
							variants={itemVariants}
							className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black font-[family-name:var(--font-heading)] leading-[1] tracking-tighter text-slate-900"
						>
							Punya Bisnis Laundry
							<br />
							<span className="inline-block text-brand-gradient py-2">Autopilot, Tanpa Pusing</span>
							<br />
							Mulai dari Nol.
						</motion.h1>

						<motion.p
							variants={itemVariants}
							className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg font-medium"
						>
							Tinggalkan cara lama yang ribet dan rawan rugi. Kami siapkan sistem teruji: mulai dari
							mesin premium, training SDM, hingga operasional otomatis. Anda terima beres dan
							tinggal pantau profit setiap hari.
						</motion.p>

						<motion.div
							variants={itemVariants}
							className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 w-full sm:w-auto"
						>
							<Link
								href="/paket-usaha"
								className="group relative w-full sm:w-auto px-8 py-4 bg-brand-primary text-white rounded-full font-black overflow-hidden transition-all duration-300 hover:bg-pink-700 text-sm inline-flex items-center justify-center gap-4"
							>
								PILIH PAKET USAHA
								<motion.div
									animate={{ x: [0, 5, 0] }}
									transition={{ repeat: Infinity, duration: 1.5 }}
								>
									<HiOutlineArrowRight size={18} />
								</motion.div>
							</Link>
							<a
								href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890"}?text=${encodeURIComponent("Halo Mahira, saya ingin konsultasi mengenai paket usaha laundry.")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 rounded-full font-black text-slate-700 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
							>
								KONSULTASI GRATIS
							</a>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="mt-10 lg:mt-16 flex items-center gap-4 md:gap-6"
						>
							<div className="flex -space-x-3 md:-space-x-4">
								{[1, 2, 3, 4].map((i) => (
									<motion.div
										key={`partner-avatar-${i}`}
										whileHover={{ y: -4 }}
										transition={{ type: "spring", stiffness: 400, damping: 25 }}
										className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white overflow-hidden shadow-lg cursor-pointer relative z-0 hover:z-10"
									>
										<Image
											src={`/avatars/partner_${i}.png`}
											alt={`Indonesian Partner ${i}`}
											width={56}
											height={56}
											className="w-full h-full object-cover"
										/>
									</motion.div>
								))}
							</div>
							<div className="h-8 md:h-12 w-px bg-slate-200" />
							<div>
								<p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
									Dipercaya oleh
								</p>
								<p className="text-base md:text-lg font-black text-slate-900">
									150+ <span className="text-brand-primary">Mitra Aktif</span>
								</p>
							</div>
						</motion.div>
					</motion.div>

					<div className="relative py-4 lg:py-0 lg:h-[600px] flex items-center justify-center min-w-0">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="relative z-10 w-full max-w-md p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden"
						>
							<motion.div
								animate={{ y: [0, -10, 0] }}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute top-10 right-10 text-brand-primary/10 text-6xl"
							>
								<MdOutlineLocalLaundryService />
							</motion.div>

							<div className="flex items-center gap-5 mb-10 relative z-10">
								<div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-3xl text-white shadow-xl shadow-brand-primary/20">
									<MdOutlineRocketLaunch />
								</div>
								<div>
									<h3 className="text-xl font-black text-slate-900 leading-tight">
										Estimasi Profit
									</h3>
									<p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.2em]">
										ROI CEPAT & TERUJI
									</p>
								</div>
							</div>

							<div className="space-y-4 relative z-10">
								{packages.slice(0, 3).map((pkg, i) => (
									<motion.div
										key={pkg.id}
										initial={{ opacity: 0, y: 10 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
										className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs min-w-0"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div
												className={`w-2 h-2 rounded-full ${pkg.tier === "Starter" ? "bg-blue-500" : pkg.tier === "Standard" ? "bg-emerald-500" : pkg.tier === "Premium" ? "bg-purple-500" : "bg-orange-500"}`}
											/>
											<span className="text-xs font-black uppercase tracking-widest text-slate-900 min-w-0">
												{pkg.name.split(" ")[0]}{" "}
												<Badge
													variant="secondary"
													className={`${tierBadgeColors[pkg.tier] ?? defaultBadgeColor} text-[10px] font-black uppercase tracking-widest px-2 py-0.5 whitespace-normal`}
												>
													{pkg.name.split(" ").slice(1).join(" ")}
												</Badge>
											</span>
										</div>
										<div className="flex items-center gap-2 shrink-0">
											{isPromoActive(pkg) && (
												<span className="text-slate-400 font-bold text-xs line-through">
													Rp {(pkg.price / 1000000).toFixed(0)}jt
												</span>
											)}
											<span className="text-brand-primary font-black text-sm">
												Rp {(getEffectivePrice(pkg) / 1000000).toFixed(0)}jt
											</span>
										</div>
									</motion.div>
								))}
							</div>

							<div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
								<div>
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
										Status Franchise
									</p>
									<div className="flex items-center gap-2">
										<div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
										<p className="text-2xl font-black text-slate-900 tracking-tighter">
											OPEN <span className="text-emerald-500">NOW</span>
										</p>
									</div>
								</div>
								<div className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
									Teruji Sejak 2023
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
