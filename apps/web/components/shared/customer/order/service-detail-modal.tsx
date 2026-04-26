"use client";

import { AnimatePresence, motion } from "motion/react";
import {
	HiCheckBadge,
	HiOutlineArrowRight,
	HiOutlineBolt,
	HiOutlineClock,
	HiOutlineSparkles,
	HiOutlineTag,
	HiOutlineXMark,
} from "react-icons/hi2";
import { PRIMARY_OUTLET } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { formatIDR } from "@/lib/utils";

interface ServiceDetailModalProps {
	service: Service | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ServiceDetailModal({
	service,
	isOpen,
	onClose,
}: ServiceDetailModalProps) {
	if (!service) return null;

	const containerVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 300,
				staggerChildren: 0.1,
			},
		},
		exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.3 } },
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 15 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
					{/* Backdrop with Deep Cinematic Blur */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
					/>

					{/* Modal Container: High-End Card Design */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="relative w-full max-w-4xl bg-white rounded-t-[3rem] sm:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row z-10 max-h-[95vh]"
					>
						{/* Left Side: Brand Visual Strip */}
						<div className="relative w-full md:w-[35%] bg-slate-900 p-10 lg:p-14 flex flex-col items-center justify-center text-center shrink-0">
							{/* Background Decorative */}
							<div className="absolute inset-0 bg-brand-gradient opacity-20 mix-blend-overlay" />
							<div className="absolute top-0 left-0 w-full h-full bg-brand-primary/10 blur-[80px] rounded-full" />

							<div className="relative z-10 w-full flex flex-col items-center gap-8">
								<motion.div
									variants={itemVariants}
									className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-6xl shadow-2xl relative rotate-3 group"
								>
									{service.icon || "🧺"}
									<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center shadow-xl border-4 border-slate-900">
										<span className="text-white text-sm">
											<HiCheckBadge />
										</span>
									</div>
								</motion.div>

								<motion.div
									variants={itemVariants}
									className="text-white space-y-2"
								>
									<span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-brand-primary border border-white/5">
										<HiOutlineSparkles size={12} />
										Investasi Bersih
									</span>
									<div className="flex flex-col items-center pt-4">
										<h3 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] tracking-tighter leading-none text-brand-accent">
											{formatIDR(Number(service.price))}
										</h3>
										<p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-4">
											Per {service.unit}
										</p>
									</div>
								</motion.div>
							</div>

							{/* Close Mobile Button */}
							<button
								type="button"
								onClick={onClose}
								className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex md:hidden items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
							>
								<HiOutlineXMark size={24} />
							</button>
						</div>

						{/* Right Side: Content Area */}
						<div className="relative w-full md:w-[65%] bg-white flex flex-col h-full overflow-hidden">
							{/* Desktop Close Button */}
							<button
								type="button"
								onClick={onClose}
								className="absolute top-10 right-10 z-20 w-12 h-12 bg-slate-50 hidden md:flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all active:scale-90"
							>
								<HiOutlineXMark size={24} />
							</button>

							<div className="flex-1 overflow-y-auto px-10 py-12 lg:px-16 lg:py-16 custom-scrollbar">
								<div className="space-y-12">
									<motion.div variants={itemVariants} className="text-left">
										<h2 className="text-4xl lg:text-5xl font-black text-slate-900 font-[family-name:var(--font-heading)] tracking-tighter leading-[0.9] mb-6">
											{service.name}
										</h2>
										<div className="flex flex-wrap items-center gap-6">
											<div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
												<span className="text-brand-primary">
													<HiOutlineClock size={16} />
												</span>
												<span>
													{service.estimated_duration_hours} Jam Pengerjaan
												</span>
											</div>
											{service.is_express && (
												<div className="flex items-center gap-3 text-amber-600 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
													<HiOutlineBolt size={16} />
													<span>Express Available</span>
												</div>
											)}
										</div>
									</motion.div>

									<motion.div variants={itemVariants} className="space-y-4">
										<div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
											<HiOutlineTag size={14} />
											<span>Layanan Overview</span>
										</div>
										<p className="text-slate-500 text-lg lg:text-xl leading-relaxed font-medium italic">
											"
											{service.description ||
												"Komitmen kami adalah memberikan hasil pengerjaan terbaik untuk setiap serat pakaian Anda."}
											"
										</p>
									</motion.div>

									<motion.div
										variants={itemVariants}
										className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100"
									>
										<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
											Fitur & Keunggulan
										</p>
										<ul className="grid sm:grid-cols-2 gap-6">
											{(service.features && service.features.length > 0
												? service.features
												: [
														"Detergen Premium RAM",
														"Setrika Uap Industri",
														"Parfum Signature Mahira",
														"Packing Anti Bakteri",
													]
											).map((feat, i) => (
												<motion.li
													key={feat}
													initial={{ opacity: 0, x: -10 }}
													whileInView={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.5 + i * 0.1 }}
													className="flex items-center gap-4 text-sm font-black text-slate-700"
												>
													<span className="text-brand-primary w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
														<HiCheckBadge size={14} />
													</span>
													{feat}
												</motion.li>
											))}
										</ul>
									</motion.div>
								</div>
							</div>

							{/* Footer Actions */}
							<motion.div
								variants={itemVariants}
								className="px-10 py-10 lg:px-16 border-t border-slate-50 bg-white"
							>
								<motion.a
									whileHover={{ scale: 1.02, y: -2 }}
									whileTap={{ scale: 0.98 }}
									href={`https://wa.me/${PRIMARY_OUTLET.whatsapp}?text=Halo Mahira Laundry, saya ingin pesan layanan ${service.name}`}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full py-6 bg-slate-900 text-white text-center text-xs font-black rounded-full shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] group"
								>
									<span>Booking Layanan Sekarang</span>
									<span className="group-hover:translate-x-2 transition-transform">
										<HiOutlineArrowRight size={20} />
									</span>
								</motion.a>
							</motion.div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
