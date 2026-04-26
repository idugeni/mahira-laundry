"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { GiChelseaBoot } from "react-icons/gi";
import { HiOutlineArrowRight, HiOutlineSparkles } from "react-icons/hi2";
import {
	MdOutlineDryCleaning,
	MdOutlineFlashOn,
	MdOutlineIron,
	MdOutlineLocalLaundryService,
} from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import type { Service } from "@/lib/types";

interface HomeServicesSectionProps {
	services: Service[];
	isDetailOpen: boolean;
	onServiceClick: (slug: string) => void;
}

function getServiceIcon(name: string) {
	const n = name.toLowerCase();
	if (n.includes("sepatu")) return GiChelseaBoot;
	if (n.includes("setrika")) return MdOutlineIron;
	if (n.includes("express")) return MdOutlineFlashOn;
	if (n.includes("dry")) return MdOutlineDryCleaning;
	if (n.includes("kost")) return RiGraduationCapLine;
	return MdOutlineLocalLaundryService;
}

function getServiceStyles(name: string) {
	const n = name.toLowerCase();
	if (n.includes("sepatu"))
		return {
			color: "text-teal-500",
			bg: "bg-teal-50",
			shadow: "shadow-teal-100",
		};
	if (n.includes("setrika"))
		return {
			color: "text-orange-500",
			bg: "bg-orange-50",
			shadow: "shadow-orange-100",
		};
	if (n.includes("express"))
		return {
			color: "text-yellow-500",
			bg: "bg-yellow-50",
			shadow: "shadow-yellow-100",
		};
	if (n.includes("dry"))
		return {
			color: "text-purple-500",
			bg: "bg-purple-50",
			shadow: "shadow-purple-100",
		};
	if (n.includes("kost"))
		return {
			color: "text-pink-500",
			bg: "bg-pink-50",
			shadow: "shadow-pink-100",
		};
	return {
		color: "text-blue-500",
		bg: "bg-blue-50",
		shadow: "shadow-blue-100",
	};
}

export function HomeServicesSection({
	services,
	onServiceClick,
}: HomeServicesSectionProps) {
	return (
		<section
			className="py-24 relative bg-slate-50/40 overflow-hidden"
			id="layanan"
		>
			{/* Animated background accent */}
			<motion.div
				animate={{
					x: [0, 50, 0],
					y: [0, 30, 0],
					rotate: [0, 180, 360],
				}}
				transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-200/50 rounded-full opacity-30 pointer-events-none"
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 text-center lg:text-left">
					<div className="max-w-2xl">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-primary/10"
						>
							<span className="text-sm">
								<HiOutlineSparkles />
							</span>
							<span>Premium Quality</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-5xl lg:text-7xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tighter leading-[0.9]"
						>
							Layanan <br />
							<span className="text-brand-gradient">Unggulan.</span>
						</motion.h2>
					</div>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="text-lg text-slate-500 font-medium max-w-sm"
					>
						Setiap helai kain ditangani oleh tenaga profesional dengan standar
						kualitas terbaik.
					</motion.p>
				</div>

				<LayoutGroup>
					<motion.div
						layout
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
					>
						<AnimatePresence mode="popLayout">
							{services.slice(0, 6).map((service, i) => {
								const Icon = getServiceIcon(service.name);
								const styles = getServiceStyles(service.name);
								return (
									<motion.div
										layout
										key={service.id}
										initial={{ opacity: 0, scale: 0.9, y: 20 }}
										whileInView={{ opacity: 1, scale: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{
											duration: 0.5,
											delay: i * 0.1,
											ease: [0.16, 1, 0.3, 1],
										}}
										whileHover={{
											y: -15,
											rotateX: 2,
											rotateY: -2,
											transition: { duration: 0.3 },
										}}
										onClick={() => onServiceClick(service.slug || service.id)}
										className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-brand-primary/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all cursor-pointer relative overflow-hidden perspective-1000"
									>
										<div
											className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${styles.bg} rounded-bl-[5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
										/>

										<motion.div
											whileHover={{ scale: 1.1, rotate: 10 }}
											className={`relative w-20 h-20 rounded-[2rem] ${styles.bg} flex items-center justify-center text-4xl ${styles.color} mb-10 shadow-2xl ${styles.shadow} ring-4 ring-white`}
										>
											{service.icon ? (
												<span className="shrink-0">{service.icon}</span>
											) : (
												<Icon />
											)}
										</motion.div>

										<div className="relative">
											<h3 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900 mb-4 tracking-tight">
												{service.name}
											</h3>
											<p className="text-slate-500 leading-relaxed text-base mb-8 line-clamp-3 font-medium">
												{service.description}
											</p>
										</div>

										<div className="flex items-center justify-between pt-8 border-t border-slate-50">
											<div className="flex flex-col">
												<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
													Mulai Dari
												</span>
												<span className="text-2xl font-black text-brand-primary tracking-tighter">
													{new Intl.NumberFormat("id-ID", {
														style: "currency",
														currency: "IDR",
														maximumFractionDigits: 0,
													}).format(service.price)}
													<span className="text-xs text-slate-400 font-bold ml-1">
														/{service.unit}
													</span>
												</span>
											</div>
											<motion.div
												whileHover={{ x: 5 }}
												className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/30 transition-all duration-300"
											>
												<HiOutlineArrowRight size={20} />
											</motion.div>
										</div>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</motion.div>
				</LayoutGroup>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mt-20 text-center"
				>
					<motion.div whileHover={{ scale: 1.05 }} className="inline-block">
						<Link
							href="/layanan"
							className="group inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-2xl shadow-slate-200 hover:shadow-brand-primary/40"
						>
							Eksplor Semua Layanan
							<motion.div
								animate={{ x: [0, 5, 0] }}
								transition={{ repeat: Infinity, duration: 1.5 }}
							>
								<HiOutlineArrowRight size={18} />
							</motion.div>
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
