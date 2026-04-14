"use client";

import { motion } from "motion/react";
import {
	HiOutlineChevronRight,
	HiOutlineClock,
	HiOutlinePhone,
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

import { useEffect, useState } from "react";

export function LokasiClient() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="py-24 bg-slate-50/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<motion.h1
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900"
					>
						Lokasi{" "}
						<span className="inline-block text-brand-gradient">Outlet</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="mt-4 text-slate-500 max-w-xl mx-auto text-lg font-medium"
					>
						Temukan kenyamanan layanan Mahira Laundry di dekat Anda.
					</motion.p>
				</div>

				{/* Map embed */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-8 border-white mb-16 aspect-video lg:aspect-[21/9] relative z-10 bg-slate-100"
				>
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
							className="grayscale hover:grayscale-0 transition-all duration-700"
						/>
					) : (
						<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
							<div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-primary animate-spin" />
							<p className="text-sm font-bold uppercase tracking-widest animate-pulse">
								Memuat Peta...
							</p>
						</div>
					)}
				</motion.div>

				{/* Outlet cards */}
				<div className="max-w-xl mx-auto">
					{outlets.map((outlet, i) => (
						<motion.div
							key={outlet.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1 }}
							className="relative group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
						>
							{/* Decorative Brand Accent */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-primary/10 transition-colors" />

							<div className="relative z-10">
								<div className="flex items-center gap-2.5 mb-8">
									<div className="relative flex h-3 w-3">
										<span
											className={`animate-ping absolute inline-flex h-full w-full rounded-full ${outlet.color} opacity-20`}
										></span>
										<span
											className={`relative inline-flex rounded-full h-3 w-3 ${outlet.color}`}
										></span>
									</div>
									<span className="uppercase text-[11px] font-black tracking-[0.25em] text-slate-400">
										Active Branch
									</span>
								</div>

								<h3 className="font-extrabold font-[family-name:var(--font-heading)] text-3xl text-slate-900 mb-5 leading-tight">
									{outlet.name}
								</h3>

								<p className="text-base text-slate-500 leading-relaxed font-medium mb-10 max-w-sm">
									{outlet.address}
								</p>

								<div className="grid gap-6 mb-12">
									<div className="flex items-center gap-5 group/item">
										<div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover/item:bg-brand-primary group-hover/item:text-white transition-all duration-300 shadow-sm">
											<span className="w-5 h-5 flex items-center justify-center">
												<HiOutlinePhone />
											</span>
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] uppercase font-black tracking-widest text-slate-300">
												Hubungi Kami
											</span>
											<span className="text-lg font-bold text-slate-700">
												{outlet.phone}
											</span>
										</div>
									</div>

									<div className="flex items-start gap-5 group/item">
										<div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover/item:bg-brand-primary group-hover/item:text-white transition-all duration-300 shadow-sm shrink-0">
											<span className="w-5 h-5 flex items-center justify-center">
												<HiOutlineClock />
											</span>
										</div>
										<div className="flex flex-col gap-1.5 pt-0.5">
											<span className="text-[10px] uppercase font-black tracking-widest text-slate-300">
												Jam Operasional
											</span>
											<div className="text-sm font-bold text-slate-700 space-y-1">
												<p className="flex items-center gap-2">
													<span className="text-slate-400 font-medium w-16">
														Sen–Jum
													</span>
													<span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
														{outlet.hours.weekday}
													</span>
												</p>
												<p className="flex items-center gap-2">
													<span className="text-slate-400 font-medium w-16">
														Sab–Min
													</span>
													<span className="bg-brand-accent/20 text-brand-accent-dark px-2 py-0.5 rounded text-xs">
														{outlet.hours.weekend}
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>

								<a
									href={outlet.links}
									target="_blank"
									rel="noopener noreferrer"
									className="group/btn flex items-center justify-between w-full p-1.5 rounded-2xl bg-slate-900 hover:bg-brand-primary transition-all duration-500 shadow-xl shadow-slate-200"
								>
									<span className="pl-6 font-bold text-white text-sm">
										Petunjuk Arah
									</span>
									<div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover/btn:bg-white group-hover/btn:text-brand-primary transition-all duration-500">
										<span className="w-5 h-5 flex items-center justify-center">
											<HiOutlineChevronRight />
										</span>
									</div>
								</a>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
