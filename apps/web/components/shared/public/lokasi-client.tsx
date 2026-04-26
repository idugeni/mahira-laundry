"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
	HiOutlineChevronRight,
	HiOutlineClock,
	HiOutlineMapPin,
	HiOutlinePhone,
	HiOutlineSparkles,
} from "react-icons/hi2";
import { PRIMARY_OUTLET } from "@/lib/constants";

interface Outlet {
	name: string;
	address: string;
	phone: string;
	hours: {
		weekday: string;
		weekend: string;
	};
	links: string;
	color: string;
}

const outlets: Outlet[] = [
	{
		name: PRIMARY_OUTLET.name,
		address: PRIMARY_OUTLET.address,
		phone: PRIMARY_OUTLET.phone,
		hours: PRIMARY_OUTLET.operatingHours,
		links: `https://www.google.com/maps/dir/?api=1&destination=${PRIMARY_OUTLET.lat},${PRIMARY_OUTLET.lng}`,
		color: "bg-brand-primary",
	},
];

export function LokasiClient() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="py-24 bg-white relative overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
			<div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<div className="text-center mb-24">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-primary/10"
					>
						<span className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm">
							<HiOutlineMapPin size={14} />
						</span>
						<span>Jaringan Outlet Premium</span>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="text-6xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.85] tracking-tighter"
					>
						Temukan <br />
						<span className="text-brand-gradient">Kami Disini.</span>
					</motion.h1>
				</div>

				<div className="grid lg:grid-cols-12 gap-12">
					{/* Map Section */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="lg:col-span-7 h-full"
					>
						<div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-[12px] border-white h-full min-h-[500px] bg-slate-100 group">
							{mounted ? (
								<iframe
									src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d${PRIMARY_OUTLET.lng}!3d${PRIMARY_OUTLET.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInNDIuNSJTIDEwNsKwNTEnMjEuMiJF!5e0!3m2!1sid!2sid!4v1`}
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									title="Lokasi Mahira Laundry"
									className="grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
								/>
							) : (
								<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-6">
									<div className="w-16 h-16 rounded-full border-[6px] border-slate-100 border-t-brand-primary animate-spin" />
									<p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
										Menyelaraskan Koordinat...
									</p>
								</div>
							)}

							{/* Map Overlay Button */}
							<div className="absolute bottom-10 left-10 right-10 pointer-events-none">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white flex items-center justify-between shadow-2xl"
								>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
											<HiOutlineMapPin size={24} />
										</div>
										<div>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
												Alamat Presisi
											</p>
											<p className="text-sm font-black text-slate-900">
												Jatiwaringin, Bekasi
											</p>
										</div>
									</div>
									<a
										href={outlets[0].links}
										target="_blank"
										rel="noopener noreferrer"
										className="pointer-events-auto px-6 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all"
									>
										Buka Maps
									</a>
								</motion.div>
							</div>
						</div>
					</motion.div>

					{/* Outlet Details */}
					<div className="lg:col-span-5">
						{outlets.map((outlet, i) => (
							<motion.div
								key={outlet.name}
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 + i * 0.1 }}
								className="group relative bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden h-full flex flex-col justify-between"
							>
								{/* Accent Decor */}
								<div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-500" />

								<div className="relative z-10">
									<div className="flex items-center gap-3 mb-10">
										<div className="flex h-4 w-4 relative">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
											<span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
										</div>
										<span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
											Cabang Aktif
										</span>
									</div>

									<h2 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.9] tracking-tighter mb-8">
										{outlet.name}
									</h2>

									<p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 border-l-4 border-brand-primary pl-6">
										{outlet.address}
									</p>

									<div className="grid gap-10 mb-14">
										{/* Phone */}
										<div className="flex items-center gap-6 group/item">
											<div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-brand-primary shadow-inner group-hover/item:bg-brand-primary group-hover/item:text-white transition-all duration-500">
												<HiOutlinePhone size={28} />
											</div>
											<div className="flex flex-col">
												<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
													Hubungi Admin
												</span>
												<span className="text-xl font-black text-slate-900 tracking-tight">
													{outlet.phone}
												</span>
											</div>
										</div>

										{/* Hours */}
										<div className="flex items-start gap-6 group/item">
											<div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-brand-primary shadow-inner group-hover/item:bg-brand-primary group-hover/item:text-white transition-all duration-500 shrink-0">
												<HiOutlineClock size={28} />
											</div>
											<div className="flex flex-col gap-3 pt-1">
												<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
													Jam Operasional
												</span>
												<div className="space-y-2">
													<div className="flex items-center gap-4">
														<span className="text-xs font-bold text-slate-400 w-16">
															Sen - Jum
														</span>
														<span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-wider">
															{outlet.hours.weekday}
														</span>
													</div>
													<div className="flex items-center gap-4">
														<span className="text-xs font-bold text-slate-400 w-16">
															Sab - Min
														</span>
														<span className="px-3 py-1 bg-brand-accent/20 text-brand-accent-dark rounded-full text-[10px] font-black uppercase tracking-wider">
															{outlet.hours.weekend}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									<motion.a
										whileHover={{ scale: 1.02, y: -5 }}
										whileTap={{ scale: 0.98 }}
										href={outlet.links}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-between w-full p-2 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200 group/btn hover:bg-brand-primary transition-all duration-500"
									>
										<span className="text-white font-black text-xs uppercase tracking-[0.2em] pl-8">
											Navigasi Langsung
										</span>
										<div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover/btn:bg-white group-hover/btn:text-brand-primary transition-all duration-500">
											<HiOutlineChevronRight size={24} />
										</div>
									</motion.a>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
