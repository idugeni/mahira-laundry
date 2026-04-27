"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { HiOutlineArrowRight, HiOutlineSparkles } from "react-icons/hi2";
import {
	MdOutlineLocalLaundryService,
	MdOutlineRocketLaunch,
	MdOutlineSupportAgent,
} from "react-icons/md";

import type { BusinessPackage } from "@/lib/types";

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
	const rotateValue = useTransform(smoothScrollY, [0, 500], [0, 0]); // Disable scroll rotation as it feels broken on mobile

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
			className="relative py-16 lg:pt-24 lg:pb-32 overflow-hidden"
		>
			{/* Animated Background Elements */}
			<div className="absolute inset-0 bg-brand-gradient opacity-[0.02]" />
			<motion.div
				style={{ y: y1 }}
				className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"
			/>
			<motion.div
				style={{ y: y2 }}
				className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="grid lg:grid-cols-2 gap-20 items-center">
					{/* Left Content */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="text-center lg:text-left flex flex-col items-center lg:items-start"
					>
						<motion.div
							variants={itemVariants}
							className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black mb-8 border border-brand-primary/20 shadow-sm uppercase tracking-[0.2em]"
						>
							<motion.span
								animate={{ rotate: 360 }}
								transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
								className="w-4 h-4 flex items-center justify-center"
							>
								<HiOutlineSparkles />
							</motion.span>
							<span>Peluang Bisnis 2026</span>
						</motion.div>

						<motion.h1
							variants={itemVariants}
							className="text-4xl sm:text-5xl lg:text-7xl font-black font-[family-name:var(--font-heading)] leading-[1] tracking-tighter text-slate-900"
						>
							Jual Paket
							<br />
							<span className="inline-block text-brand-gradient py-2">
								Usaha Laundry.
							</span>
						</motion.h1>

						<motion.p
							variants={itemVariants}
							className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg font-medium"
						>
							Wujudkan impian bisnis Anda dengan sistem franchise-like yang
							sudah teruji. Mulai dari peralatan premium hingga sistem autopilot
							siap pakai.
						</motion.p>

						<motion.div
							variants={itemVariants}
							className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
						>
							<Link
								href="/paket-usaha"
								className="group relative px-8 py-4 bg-brand-primary text-white rounded-full font-black overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(var(--brand-primary-rgb),0.4)] text-sm"
							>
								<motion.div
									initial={{ x: "-100%" }}
									whileHover={{ x: "100%" }}
									transition={{ duration: 0.5 }}
									className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
								/>
								<span className="relative flex items-center gap-2">
									PILIH PAKET USAHA
									<span className="group-hover:translate-x-2 transition-transform duration-300">
										<HiOutlineArrowRight />
									</span>
								</span>
							</Link>
							<a
								href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890"}?text=${encodeURIComponent("Halo Mahira, saya ingin konsultasi mengenai paket usaha laundry.")}`}
								target="_blank"
								rel="noopener noreferrer"
								className="px-8 py-4 border-2 border-slate-200 rounded-full font-black text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-2 text-sm"
							>
								KONSULTASI GRATIS
							</a>
						</motion.div>

						{/* Social Proof */}
						<motion.div
							variants={itemVariants}
							className="mt-16 flex items-center gap-6"
						>
							<div className="flex -space-x-4">
								{[1, 2, 3, 4].map((i) => (
									<motion.div
										key={i}
										whileHover={{ y: -5, zIndex: 10 }}
										className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg cursor-pointer"
									>
										<Image
											src={`https://i.pravatar.cc/150?u=${i + 20}`}
											alt="Partner"
											width={56}
											height={56}
											className="w-full h-full object-cover"
										/>
									</motion.div>
								))}
							</div>
							<div className="h-12 w-px bg-slate-200" />
							<div>
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
									Dipercaya oleh
								</p>
								<p className="text-lg font-black text-slate-900">
									150+ <span className="text-brand-primary">Mitra Aktif</span>
								</p>
							</div>
						</motion.div>
					</motion.div>

					{/* Right Visual Content */}
					<div className="relative py-12 lg:py-0 lg:h-[600px] flex items-center justify-center">
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								style={{
									rotate: rotateValue,
									y: y2,
									willChange: "transform",
								}}
								className="relative z-10 w-full max-w-md p-8 rounded-[2.5rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden"
							>
							{/* Floating Decoration Icons */}
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
								{packages.length > 0 ? (
									packages.slice(0, 3).map((pkg, i) => (
										<motion.div
											key={pkg.id}
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.5 + i * 0.1 }}
											className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
										>
											<div className="flex items-center gap-3">
												<div className="w-2 h-2 rounded-full bg-brand-primary" />
												<span className="text-xs font-black text-slate-700 uppercase tracking-widest">
													{pkg.name}
												</span>
											</div>
											<span className="text-brand-primary font-black text-sm">
												Rp {(pkg.price / 1000000).toFixed(0)}jt
											</span>
										</motion.div>
									))
								) : (
									<div className="space-y-4">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className="h-14 bg-slate-50 animate-pulse rounded-2xl border border-slate-100"
											/>
										))}
									</div>
								)}
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
									Verified 2026
								</div>
							</div>
						</motion.div>

						{/* Floating Stats Badge (Simplified for performance) */}
						<motion.div
							style={{ y: y1 }}
							className="absolute -bottom-10 -right-4 lg:-bottom-6 lg:-right-12 z-20 p-5 lg:p-6 bg-slate-900 rounded-[2rem] shadow-2xl flex items-center gap-4 min-w-[220px] lg:min-w-[240px] border border-slate-800"
						>
							<div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-2xl text-brand-accent">
								<MdOutlineSupportAgent />
							</div>
							<div>
								<p className="text-[10px] uppercase font-black text-brand-accent tracking-widest">
									Full Support
								</p>
								<p className="text-sm font-black text-white leading-tight mt-0.5">
									Bimbingan Bisnis <br />
									Sampai Berhasil
								</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
