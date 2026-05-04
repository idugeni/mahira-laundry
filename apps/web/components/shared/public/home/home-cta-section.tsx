"use client";

import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineCheckCircle } from "react-icons/md";
import { PRIMARY_OUTLET } from "@/lib/constants";

export function HomeCtaSection() {
	return (
		<section className="py-20 relative overflow-hidden bg-white w-full min-w-0">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false }}
					transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
					className="group relative p-6 sm:p-10 lg:p-10 rounded-[2rem] bg-slate-900 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
				>
					{/* Elite Background Effects */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 0.5 }}
						viewport={{ once: false }}
						transition={{ duration: 1.2, delay: 0.3 }}
						className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-brand-primary/20 via-transparent to-transparent group-hover:opacity-70 transition-opacity duration-1000"
					/>
					<div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-brand-accent/10 rounded-full blur-[100px]" />
					<div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

					<div className="relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-16">
						<div className="flex-1 text-center md:text-left">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: false }}
								transition={{
									duration: 0.5,
									delay: 0.1,
									ease: [0.16, 1, 0.3, 1],
								}}
								className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8"
							>
								<span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
								Premium Services
							</motion.div>

							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: false }}
								transition={{
									duration: 0.6,
									delay: 0.2,
									ease: [0.16, 1, 0.3, 1],
								}}
								className="text-3xl sm:text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] leading-[1.1] mb-6"
							>
								Nikmati Kualitas <br />
								<span className="text-brand-gradient">Perawatan Pakaian</span> <br />
								Terbaik Hari Ini
							</motion.h2>

							<motion.p
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: false }}
								transition={{ duration: 0.6, delay: 0.35 }}
								className="text-lg text-white/60 leading-relaxed max-w-xl mb-10"
							>
								Berikan yang terbaik untuk pakaian favorit Anda. Tim profesional kami siap
								memberikan hasil yang higienis, wangi, dan rapi sempurna.
							</motion.p>

							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: false }}
								transition={{ duration: 0.6, delay: 0.5 }}
								className="flex flex-wrap justify-center md:justify-start gap-8 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
							>
								{["Hygienic", "Professional", "Fast Result"].map((feat, i) => (
									<motion.div
										key={feat}
										initial={{ opacity: 0, x: -10 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: false }}
										transition={{
											duration: 0.4,
											delay: 0.55 + i * 0.1,
											ease: [0.16, 1, 0.3, 1],
										}}
										className="flex items-center gap-2 text-sm font-bold"
									>
										<span className="text-brand-accent">
											<MdOutlineCheckCircle />
										</span>
										<span>{feat}</span>
									</motion.div>
								))}
							</motion.div>
						</div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: false }}
							transition={{
								duration: 0.6,
								delay: 0.6,
								ease: [0.16, 1, 0.3, 1],
							}}
							className="shrink-0 w-full md:w-auto flex justify-center"
						>
							<motion.a
								href={`https://wa.me/${PRIMARY_OUTLET.whatsapp}?text=Halo Mahira Laundry, saya ingin order laundry`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-6 sm:px-10 py-5 bg-white text-slate-900 hover:bg-emerald-500 hover:text-white rounded-[2rem] font-black text-base sm:text-lg transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)] group/btn"
							>
								<span className="w-10 h-10 flex items-center justify-center text-white bg-emerald-500 rounded-full group-hover/btn:bg-white group-hover/btn:text-emerald-500 transition-all duration-300 shrink-0 text-xl">
									<FaWhatsapp />
								</span>
								Hubungi Kami Sekarang
							</motion.a>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
