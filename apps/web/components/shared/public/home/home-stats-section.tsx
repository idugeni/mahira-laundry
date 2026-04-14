"use client";

import { motion } from "motion/react";
import {
	HiOutlineMapPin,
	HiOutlineSparkles,
	HiOutlineStar,
} from "react-icons/hi2";
import { MdOutlineFlashOn } from "react-icons/md";

interface Stat {
	value: string;
	label: string;
}

interface HomeStatsSectionProps {
	stats: Stat[];
}

export function HomeStatsSection({ stats }: HomeStatsSectionProps) {
	const icons = [
		<HiOutlineSparkles key="1" />,
		<HiOutlineStar key="2" />,
		<HiOutlineMapPin key="3" />,
		<MdOutlineFlashOn key="4" />,
	];

	return (
		<section className="py-24 relative bg-slate-900 overflow-hidden">
			{/* Elite Decorative Elements */}
			<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
			<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
					{stats.map((stat, i) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.8 }}
							className="relative group flex flex-col items-center text-center"
						>
							<div className="mb-6 relative">
								<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl text-brand-accent transition-all duration-500 group-hover:bg-brand-accent group-hover:text-slate-900 group-hover:rotate-[15deg] shadow-xl group-hover:shadow-brand-accent/30 ring-1 ring-white/5 group-hover:ring-brand-accent">
									{icons[i]}
								</div>
								<div className="absolute -inset-4 bg-brand-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
							</div>

							<div className="text-4xl lg:text-5xl font-black text-white font-[family-name:var(--font-heading)] mb-2 tracking-tight">
								{stat.value}
							</div>
							<div className="text-[10px] lg:text-xs font-black text-brand-accent uppercase tracking-[0.3em] leading-relaxed">
								{stat.label}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
