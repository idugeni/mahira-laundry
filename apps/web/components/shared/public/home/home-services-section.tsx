"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { GiChelseaBoot } from "react-icons/gi";
import { HiOutlineArrowRight } from "react-icons/hi2";
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
	if (name.toLowerCase().includes("sepatu")) return GiChelseaBoot;
	if (name.toLowerCase().includes("setrika")) return MdOutlineIron;
	if (name.toLowerCase().includes("express")) return MdOutlineFlashOn;
	if (name.toLowerCase().includes("dry")) return MdOutlineDryCleaning;
	if (name.toLowerCase().includes("kost")) return RiGraduationCapLine;
	return MdOutlineLocalLaundryService;
}

function getServiceStyles(name: string) {
	if (name.toLowerCase().includes("sepatu"))
		return { color: "text-teal-500", bg: "bg-teal-50" };
	if (name.toLowerCase().includes("setrika"))
		return { color: "text-orange-500", bg: "bg-orange-50" };
	if (name.toLowerCase().includes("express"))
		return { color: "text-yellow-500", bg: "bg-yellow-50" };
	if (name.toLowerCase().includes("dry"))
		return { color: "text-purple-500", bg: "bg-purple-50" };
	if (name.toLowerCase().includes("kost"))
		return { color: "text-pink-500", bg: "bg-pink-50" };
	return { color: "text-blue-500", bg: "bg-blue-50" };
}

export function HomeServicesSection({
	services,
	isDetailOpen,
	onServiceClick,
}: HomeServicesSectionProps) {
	return (
		<section className="py-20 bg-slate-50/50" id="layanan">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-20">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-slate-900"
					>
						Layanan{" "}
						<span className="inline-block text-brand-gradient">Premium</span>{" "}
						Kami
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto"
					>
						Setiap pakaian diperlakukan khusus dengan deterjen premium dan
						teknologi modern.
					</motion.p>
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{services
						.slice(0, isDetailOpen ? services.length : 6)
						.map((service, i) => {
							const Icon = getServiceIcon(service.name);
							const styles = getServiceStyles(service.name);
							return (
								<motion.div
									key={service.id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.1 }}
									whileHover={{ y: -10 }}
									onClick={() => onServiceClick(service.slug || service.id)}
									className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-brand-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer"
								>
									<div
										className={`w-16 h-16 rounded-full ${styles.bg} flex items-center justify-center text-3xl ${styles.color} mb-8 ring-4 ring-white shadow-sm`}
									>
										{service.icon ? (
											<span className="shrink-0">{service.icon}</span>
										) : (
											<Icon />
										)}
									</div>
									<h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-3 grayscale group-hover:grayscale-0 transition-all">
										{service.name}
									</h3>
									<p className="text-slate-500 leading-relaxed text-sm mb-6 line-clamp-2">
										{service.description}
									</p>
									<div className="flex items-center justify-between pt-6 border-t border-slate-50">
										<span className="text-xl font-black text-brand-primary">
											{new Intl.NumberFormat("id-ID", {
												style: "currency",
												currency: "IDR",
												maximumFractionDigits: 0,
											}).format(service.price)}
											<span className="text-xs text-slate-400 font-medium">
												/{service.unit}
											</span>
										</span>
										<div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
											<span className="w-5 h-5 flex items-center justify-center">
												<HiOutlineArrowRight />
											</span>
										</div>
									</div>
								</motion.div>
							);
						})}
				</div>

				{services.length > 6 && (
					<div className="mt-16 text-center">
						<Link
							href="/layanan"
							className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/25"
						>
							Lihat Seluruh Layanan
							<HiOutlineArrowRight />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
