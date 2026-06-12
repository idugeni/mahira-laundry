"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
	HiOutlineArrowRight,
	HiOutlineCheckBadge,
	HiOutlineShieldCheck,
	HiOutlineSparkles,
} from "react-icons/hi2";
import {
	MdBolt,
	MdOutlineCleanHands,
	MdOutlineColorLens,
	MdOutlineLocalLaundryService,
	MdOutlineSecurity,
} from "react-icons/md";
import { useAuth } from "@/hooks/use-auth";
import type { BusinessPackage, Service } from "@/lib/types";
import { formatIDR, getDashboardUrl } from "@/lib/utils";

interface HomeHeroSectionProps {
	user: unknown;
	loading: boolean;
	dashboardHref: string;
	packages?: BusinessPackage[];
	services?: Service[];
	outlet?: any;
}

export function HomeHeroSection({
	packages = [],
	services = [],
	outlet,
	user,
	loading,
}: HomeHeroSectionProps) {
	const { profile } = useAuth();
	const dashboardHref = getDashboardUrl(profile?.role as string);
	const containerRef = useRef(null);
	const { scrollY } = useScroll();

	const smoothScrollY = useSpring(scrollY, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const y1 = useTransform(smoothScrollY, [0, 500], [0, 40]);
	const y2 = useTransform(smoothScrollY, [0, 500], [0, -30]);

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
			transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
		},
	};

	const premiumFeatures = [
		{ icon: <HiOutlineCheckBadge />, text: "Sistem Cuci Profesional" },
		{ icon: <MdOutlineSecurity />, text: "Proses Higienis & Steril" },
		{ icon: <MdOutlineColorLens />, text: "Bahan Aman & Ramah Kain" },
	];

	// Get Featured Services from DB
	const featuredServices = services.filter((s) => s.is_featured).slice(0, 4);

	return (
		<section
			ref={containerRef}
			className="relative w-full min-w-0 lg:min-h-[calc(100vh-80px)] flex flex-col justify-center py-10 md:py-12 lg:py-12 bg-white overflow-hidden"
		>
			{/* Ambient Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-primary/[0.03] rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
				<div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pink-500/[0.02] rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
			</div>

			<div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-20 relative flex items-center min-w-0">
				<div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 md:gap-12 lg:gap-16 items-center w-full min-w-0">
					{/* LEFT COLUMN: THE ELITE MESSAGE */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="text-center lg:text-left flex flex-col items-center lg:items-start min-w-0 relative z-20"
					>
						<motion.div
							variants={itemVariants}
							className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:px-6 sm:py-2.5 bg-brand-primary/[0.03] border border-brand-primary/20 text-brand-primary rounded-full text-[9px] sm:text-[11px] font-black mb-6 sm:mb-8 uppercase tracking-[0.3em] transition-all duration-500 hover:bg-brand-primary hover:text-white cursor-default group/badge"
						>
							<span className="text-sm sm:text-base animate-pulse flex items-center justify-center group-hover/badge:text-white transition-colors duration-500">
								<HiOutlineShieldCheck />
							</span>
							<span className="tracking-[0.2em] sm:tracking-[0.25em]">Trusted Since 2023</span>
						</motion.div>

						<motion.h1
							variants={itemVariants}
							className="text-4xl sm:text-5xl md:text-7xl lg:text-[64px] xl:text-[80px] font-[950] font-[family-name:var(--font-heading)] leading-[0.95] tracking-[-0.05em] text-slate-900 mb-6"
						>
							Laundry Premium.
							<br />
							<span className="inline-block text-brand-gradient py-1">Hasil Sempurna.</span>
						</motion.h1>

						<motion.div variants={itemVariants} className="w-full lg:max-w-[95%]">
							<p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 leading-relaxed font-medium mb-8 max-w-3xl">
								Manjakan diri dengan kemewahan waktu yang tak ternilai. Sahabat Mahira cukup duduk
								manis dan menikmati momen berharga, biar kurir kami yang menjemput pakaian Anda.
								Setiap helai akan kembali dalam kondisi sempurna—bersih maksimal, rapi presisi, dan
								harum elegan yang siap meningkatkan kepercayaan diri Anda.
							</p>

							{/* Premium Pillars */}
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-5 mb-10">
								{premiumFeatures.map((feature, i) => (
									<div key={i} className="flex items-center gap-3 sm:gap-4 group">
										<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center text-lg sm:text-xl transition-all duration-500 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/30">
											{feature.icon}
										</div>
										<span className="text-[10px] sm:text-[11px] xl:text-[13px] font-bold text-slate-800 tracking-tight">
											{feature.text}
										</span>
									</div>
								))}
							</div>
						</motion.div>

						<motion.div
							variants={itemVariants}
							className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-5 w-full sm:w-auto"
						>
							<Link
								href="/layanan"
								className="group relative w-full sm:w-auto px-12 py-4.5 bg-brand-primary text-white rounded-2xl font-black overflow-hidden transition-all duration-500 text-xs inline-flex items-center justify-center gap-4 shadow-xl shadow-brand-primary/20"
							>
								{/* Glass Shimmer Effect */}
								<motion.div
									initial={{ x: "-100%" }}
									whileHover={{ x: "100%" }}
									transition={{ duration: 0.6, ease: "easeInOut" }}
									className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
								/>
								<span className="relative z-10">LAYANAN PREMIUM</span>
								<span className="text-xl group-hover:translate-x-2 transition-transform flex items-center justify-center relative z-10">
									<HiOutlineArrowRight />
								</span>
							</Link>

							<Link
								href="/paket-usaha"
								className="group relative w-full sm:w-auto px-12 py-4.5 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all duration-500 overflow-hidden text-xs flex items-center justify-center gap-2 shadow-sm"
							>
								{/* Glass Shimmer Effect */}
								<motion.div
									initial={{ x: "-100%" }}
									whileHover={{ x: "100%" }}
									transition={{ duration: 0.6, ease: "easeInOut" }}
									className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent skew-x-[-20deg]"
								/>
								<span className="relative z-10 uppercase">MULAI BISNIS LAUNDRY</span>
							</Link>
						</motion.div>

						{/* VIP Concierge WhatsApp Link */}
						<motion.a
							href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS?.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent("Halo Mahira Laundry, saya ingin memesan layanan antar jemput. Mohon informasinya.")}`}
							target="_blank"
							rel="noopener noreferrer"
							variants={itemVariants}
							className="mt-8 flex items-center gap-4 py-3 px-5 bg-slate-50 rounded-2xl border border-slate-100 w-fit group cursor-pointer hover:bg-white hover:shadow-lg hover:border-emerald-500/30 transition-all duration-500"
						>
							<div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
								<svg
									stroke="currentColor"
									fill="currentColor"
									strokeWidth="0"
									viewBox="0 0 448 512"
									height="1em"
									width="1em"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 445.9c-33.1 0-65.7-8.9-94.1-25.7l-6.7-4-69.8 18.3L71.6 366l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.4 0 101.7-82.8 184.5-184.5 184.5zm100.5-138c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.2 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.6-13.3 37.2-26.2 4.6-12.9 4.6-24 3.2-26.2-1.3-2.2-5-3.3-10.5-6.1z"></path>
								</svg>
							</div>
							<div className="flex flex-col">
								<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
									ORDER CEPAT
								</span>
								<span className="text-sm font-bold text-slate-900">
									{`+${process.env.NEXT_PUBLIC_WHATSAPP_CS}`}
								</span>
							</div>
							<div className="ml-4 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
						</motion.a>
					</motion.div>

					{/* RIGHT COLUMN: THE ELITE ARTISANAL GALLERY */}
					<div className="relative py-12 lg:py-0 flex items-center justify-center w-full min-w-0">
						<div className="relative w-full aspect-auto sm:aspect-square max-w-[500px] lg:max-w-none xl:max-w-[580px] grid grid-cols-2 sm:grid-cols-6 sm:grid-rows-6 gap-3 sm:gap-4">
							{(() => {
								// CURATION: 6 diverse services
								const curatedSelection = [
									services.find((s) => s.name.includes("Lipat Premium")) || services[0],
									services.find((s) => s.name.includes("Executive")) || services[1],
									services.find((s) => s.name.includes("Bag")) || services[6],
									services.find((s) => s.name.includes("Dry Cleaning")) || services[7],
									services.find((s) => s.name.includes("Sepatu") && s.is_featured) || services[5],
									services.find((s) => s.name.includes("Bed Cover Luxury")) || services[10],
								].filter(Boolean);

								// Precise 6-card layout for 6x6 Grid (36 Cells) - NO row-span-1
								const layouts = [
									"col-span-2 row-span-2 sm:col-span-3 sm:row-span-4", // 1: Flagship (Large Tall)
									"col-span-1 row-span-1 sm:col-span-3 sm:row-span-2", // 2: Secondary (Wide)
									"col-span-1 row-span-1 sm:col-span-3 sm:row-span-2", // 3: Wide
									"col-span-1 row-span-1 sm:col-span-2 sm:row-span-2", // 4: Square
									"col-span-1 row-span-1 sm:col-span-2 sm:row-span-2", // 5: Square
									"col-span-2 row-span-1 sm:col-span-2 sm:row-span-2", // 6: Square
								];

								// 0: THE MIDNIGHT (Elite & Bold)
								// 1: THE BRAND (Solid Identity)
								// 2: THE SIGNATURE (Pure & Clean)
								// 3: THE GLASS (Premium Transparency)
								// 4: THE SOFT (Minimalist)
								// 5: THE DARK ACCENT (Modern)
								const styles = [
									"bg-slate-900 text-white hover:bg-slate-800 shadow-2xl",
									"bg-brand-primary text-white hover:bg-brand-primary/90 shadow-xl shadow-brand-primary/20",
									"bg-white text-slate-900 border-slate-100 hover:border-brand-primary/30 shadow-md",
									"bg-white/60 backdrop-blur-xl border-white/50 text-slate-900 hover:bg-white/80 shadow-xl",
									"bg-slate-50 text-slate-600 border-slate-100 hover:bg-white",
									"bg-slate-900 text-white border-white/10 hover:border-brand-primary/40",
								];

								return curatedSelection.map((service, idx) => {
									if (!service) return null;
									const layout = layouts[idx] || "hidden";
									const style = styles[idx] || "bg-white";

									// Determine dynamic colors for child elements based on background
									const isDark = idx === 0 || idx === 1 || idx === 5;
									const isBrand = idx === 1;

									return (
										<motion.div
											key={service.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.05, duration: 0.5 }}
											whileHover={{
												scale: 1.015,
												transition: { duration: 0.2 },
											}}
											className={`${layout} ${style} rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden relative p-3 sm:p-5 flex flex-col justify-between group cursor-pointer border border-transparent transition-all duration-500`}
										>
											<Link href={`/?s=${service.slug}`} className="absolute inset-0 z-10" />

											{/* Living Watermark - Centered, Adaptive, and Animated */}
											<motion.div
												animate={{
													y: [0, -12, 0],
													rotate: [0, 3, 0],
												}}
												transition={{
													duration: 8,
													repeat: Infinity,
													ease: "easeInOut",
													delay: idx * 0.3,
												}}
												className={`absolute inset-0 flex items-center justify-center text-[100px] sm:text-[180px] xl:text-[240px] select-none pointer-events-none transition-all duration-700
													${isDark ? "text-white opacity-[0.03] group-hover:opacity-[0.06]" : "text-brand-primary opacity-[0.02] group-hover:opacity-[0.05]"}
													group-hover:scale-110
												`}
											>
												{service.icon || "✨"}
											</motion.div>

											{/* Top Section: Icon */}
											<div className="relative z-20">
												<div
													className={`flex items-center justify-center rounded-lg sm:rounded-2xl shadow-sm w-7 h-7 sm:w-10 sm:h-10 xl:w-12 xl:h-12 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1
													${
														isBrand
															? "bg-white text-brand-primary"
															: isDark
																? "bg-white/10 text-white backdrop-blur-md border border-white/20"
																: "bg-slate-900 text-white"
													}
												`}
												>
													<span className="text-base sm:text-2xl">{service.icon || "🧺"}</span>
												</div>
											</div>

											{/* Bottom Section: Info */}
											<div className="relative z-20 w-full mt-2">
												{/* Meta Info */}
												<div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1.5">
													<div
														className={`text-[6px] sm:text-[9px] xl:text-[10px] font-black uppercase tracking-[0.25em] ${
															isDark ? "text-brand-primary" : "text-brand-primary"
														}`}
													>
														{service.category || "Premium"}
													</div>
												</div>

												{/* Service Name */}
												<h3
													className={`font-[950] leading-[1.1] tracking-tighter transition-all duration-300
													${idx === 0 ? "text-base sm:text-2xl xl:text-4xl mb-0.5 sm:mb-2" : "text-[10px] sm:text-lg xl:text-2xl"}
													${
														isBrand
															? "text-white"
															: isDark
																? "text-white group-hover:text-brand-primary"
																: "text-slate-900 group-hover:text-brand-primary"
													}
												`}
												>
													{service.name.split(" ").slice(0, 3).join(" ")}
												</h3>

												{idx === 0 && (
													<p
														className={`text-[8px] sm:text-[11px] font-medium leading-relaxed line-clamp-1 sm:line-clamp-2 mt-1 sm:mt-2 transition-all duration-300
														${
															isBrand
																? "text-white/80"
																: isDark
																	? "text-white/50 group-hover:text-white/70"
																	: "text-slate-500"
														}
													`}
													>
														{service.description}
													</p>
												)}
											</div>
										</motion.div>
									);
								});
							})()}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
