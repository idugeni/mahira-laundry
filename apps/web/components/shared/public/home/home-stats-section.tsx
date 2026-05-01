"use client";

import { motion } from "motion/react";
import {
	HiOutlineMapPin,
	HiOutlineSparkles,
	HiOutlineStar,
} from "react-icons/hi2";
import { MdOutlineFlashOn } from "react-icons/md";

import { CountUp } from "@/components/ui/count-up";

interface Stat {
	value: string;
	label: string;
	numericValue?: number;
	decimal?: number;
	suffix?: string;
	prefix?: string;
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
		<div className="relative">
			{/* Top Wave */}
			<div className="relative -mb-1 z-10">
				<svg
					viewBox="0 0 1440 80"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-[50px] sm:h-[80px]"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M0,45 C480,65 960,25 1440,45 L1440,80 L0,80 Z"
						fill="rgb(15 23 42)"
					/>
				</svg>
			</div>

			<section className="py-14 sm:py-16 relative bg-slate-900 overflow-hidden">
				{/* Elite Decorative Elements */}
				<div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
						{stats.map((stat, i) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: false }}
								transition={{ delay: i * 0.1, duration: 0.8 }}
								className="relative group flex flex-col items-center text-center"
							>
								<div className="mb-6 relative">
									<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl text-brand-accent transition-all duration-500 group-hover:bg-brand-accent group-hover:text-slate-900 group-hover:rotate-[15deg] shadow-xl group-hover:shadow-brand-accent/30 ring-1 ring-white/5 group-hover:ring-brand-accent">
										{icons[i]}
									</div>
									<div className="absolute -inset-4 bg-brand-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
								</div>

								<div className="text-4xl md:text-5xl font-black text-white font-[family-name:var(--font-heading)] mb-2 tracking-tight">
									{stat.numericValue !== undefined ? (
										<CountUp
											to={stat.numericValue}
											decimal={stat.decimal ?? 0}
											suffix={stat.suffix ?? ""}
											prefix={stat.prefix ?? ""}
											duration={2}
											delay={i * 0.15}
										/>
									) : (
										stat.value
									)}
								</div>
								<div className="text-[10px] md:text-xs font-black text-brand-accent uppercase tracking-[0.3em] leading-relaxed">
									{stat.label}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Bottom Wave */}
			<div className="relative -mt-1 z-10">
				<svg
					viewBox="0 0 1440 80"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-[50px] sm:h-[80px]"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path
						d="M0,45 C480,25 960,65 1440,45 L1440,0 L0,0 Z"
						fill="rgb(15 23 42)"
					/>
				</svg>
			</div>
		</div>
	);
}
