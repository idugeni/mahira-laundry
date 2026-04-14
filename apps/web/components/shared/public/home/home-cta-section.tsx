"use client";

import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineCheckCircle } from "react-icons/md";
import { PRIMARY_OUTLET } from "@/lib/constants";

export function HomeCtaSection() {
	return (
		<section className="py-24 relative overflow-hidden bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="group relative p-12 lg:p-24 rounded-[4rem] bg-slate-900 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
				>
					{/* Elite Background Effects */}
					<div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-brand-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
					<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px]" />
					<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

					<div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
						<div className="flex-1 text-center lg:text-left">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 }}
								className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8"
							>
								<span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
								Premium Services
							</motion.div>

							<h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[family-name:var(--font-heading)] leading-[1.1] mb-8">
								Nikmati Kualitas <br />
								<span className="text-brand-gradient">Perawatan Pakaian</span>{" "}
								<br />
								Terbaik Hari Ini
							</h2>

							<p className="text-xl text-white/60 leading-relaxed max-w-xl mb-12">
								Berikan yang terbaik untuk pakaian favorit Anda. Tim profesional
								kami siap memberikan hasil yang higienis, wangi, dan rapi
								sempurna.
							</p>

							<div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
								{["Hygienic", "Professional", "Fast Result"].map((feat) => (
									<div
										key={feat}
										className="flex items-center gap-2 text-sm font-bold"
									>
										<span className="text-brand-accent">
											<MdOutlineCheckCircle />
										</span>
										<span>{feat}</span>
									</div>
								))}
							</div>
						</div>

						<div className="shrink-0 w-full lg:w-auto flex justify-center">
							<motion.a
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								href={`https://wa.me/${PRIMARY_OUTLET.whatsapp}?text=Halo Mahira Laundry, saya ingin order laundry`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black text-xl hover:bg-brand-accent hover:text-slate-900 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group/btn"
							>
								<span className="w-8 h-8 flex items-center justify-center text-emerald-500 bg-emerald-50 rounded-full group-hover/btn:bg-slate-900 transition-colors">
									<FaWhatsapp />
								</span>
								Hubungi Kami Sekarang
							</motion.a>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
