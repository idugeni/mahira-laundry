"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { HiOutlineArrowRight, HiOutlineMapPin } from "react-icons/hi2";
import {
	MdOutlineCheckCircle,
	MdOutlineLocalLaundryService,
} from "react-icons/md";
import { PRIMARY_OUTLET } from "@/lib/constants";

interface HomeHeroSectionProps {
	user: unknown;
	loading: boolean;
	dashboardHref: string;
}

export function HomeHeroSection({
	user,
	loading,
	dashboardHref,
}: HomeHeroSectionProps) {
	return (
		<section className="relative py-16 lg:pt-24 lg:pb-32">
			<div className="absolute inset-0 bg-brand-gradient opacity-[0.03]" />
			<motion.div
				animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
				transition={{ duration: 10, repeat: Infinity }}
				className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-primary rounded-full blur-[120px]"
			/>
			<motion.div
				animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
				transition={{ duration: 15, repeat: Infinity, delay: 2 }}
				className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent rounded-full blur-[100px]"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="grid lg:grid-cols-2 gap-20 items-center">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-center lg:text-left flex flex-col items-center lg:items-start"
					>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-semibold mb-8 border border-brand-primary/10"
						>
							<span className="w-4 h-4 flex items-center justify-center animate-pulse">
								<MdOutlineLocalLaundryService />
							</span>
							<span>Standar Baru Laundry Indonesia</span>
						</motion.div>

						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[family-name:var(--font-heading)] leading-[1.1] tracking-tight text-slate-900">
							Cucian Bersih,
							<br />
							<span className="inline-block text-brand-gradient">
								Hidup Nyaman.
							</span>
						</h1>

						<p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-lg">
							Mahira Laundry hadir sebagai solusi modern untuk kebutuhan gaya
							hidup Anda. Pakaian Anda ditangani secara profesional dengan
							antar-jemput gratis.
						</p>

						<div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-5">
							{!loading ? (
								<Link
									href={user ? dashboardHref : "/register"}
									className="group relative px-8 py-4 bg-brand-primary text-white rounded-full font-bold overflow-hidden transition-all hover:shadow-2xl hover:shadow-brand-primary/30"
								>
									<motion.div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
									<span className="relative flex items-center gap-2">
										{user ? "Buka Dashboard" : "Mulai Sekarang"}
										<span className="w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
											<HiOutlineArrowRight />
										</span>
									</span>
								</Link>
							) : (
								<div className="w-48 h-14 bg-slate-100 animate-pulse rounded-full" />
							)}
							<Link
								href="/layanan"
								className="px-8 py-4 border-2 border-slate-200 rounded-full font-bold text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-2"
							>
								Lihat Layanan
							</Link>
						</div>

						<div className="mt-12 flex items-center gap-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 max-w-sm mx-auto lg:mx-0">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="w-12 h-12 rounded-full bg-slate-200 border-4 border-white overflow-hidden shadow-sm"
									>
										<img
											src={`https://i.pravatar.cc/150?u=${i + 10}`}
											alt="Pelanggan"
											className="w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
							<div>
								<div className="flex text-amber-500 text-sm">
									{"★★★★★".split("").map((s, i) => (
										<span key={i}>{s}</span>
									))}
								</div>
								<p className="text-sm font-medium text-slate-600">
									<strong className="text-slate-900">2,500+</strong> pelanggan
									puas
								</p>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
						className="relative"
					>
						<div className="relative z-10 glass-card p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-white/40 ring-1 ring-black/5">
							<div className="flex items-center gap-4 mb-8">
								<div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl text-brand-primary shadow-inner">
									<MdOutlineLocalLaundryService />
								</div>
								<div>
									<h3 className="text-lg font-bold text-slate-900 leading-tight">
										Order Aktif
									</h3>
									<p className="text-sm text-slate-500 font-medium">
										Pickup dalam 30 menit
									</p>
								</div>
							</div>

							<div className="space-y-4">
								{[
									"Cuci Setrika 3kg",
									"Dry Cleaning 2 item",
									"Express Setrika 1kg",
								].map((item, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 + i * 0.1 }}
										className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
									>
										<span className="text-sm font-semibold text-slate-700">
											{item}
										</span>
										<span className="text-emerald-500 w-5 h-5 flex items-center justify-center">
											<MdOutlineCheckCircle />
										</span>
									</motion.div>
								))}
							</div>

							<div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
								<div>
									<p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
										Total Pembayaran
									</p>
									<p className="text-2xl font-black text-brand-primary mt-1">
										Rp 85.000
									</p>
								</div>
								<div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold ring-1 ring-emerald-100 uppercase">
									Paid
								</div>
							</div>
						</div>

						{/* Float Element */}
						<motion.div
							animate={{ y: [0, -15, 0] }}
							transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
							className="absolute -bottom-8 -right-8 z-20 glass-card p-5 shadow-2xl ring-1 ring-black/5 flex items-center gap-4 max-w-[220px]"
						>
							<div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-2xl">
								<span className="text-brand-accent flex items-center justify-center">
									<HiOutlineMapPin />
								</span>
							</div>
							<div>
								<p className="text-[10px] uppercase font-bold text-slate-400">
									Kurir Mahira
								</p>
								<p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
									Sedang Menuju Lokasi
								</p>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
