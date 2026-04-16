"use client";

import { motion } from "motion/react";
import { FaQuoteLeft } from "react-icons/fa6";
import { HiStar } from "react-icons/hi2";

export interface TestimonialData {
	id: string;
	content: string;
	rating: number;
	profiles?: {
		full_name?: string;
	};
	guest_name?: string;
}

interface TestimonialSectionProps {
	testimonials: TestimonialData[];
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
	const displayTestimonials = testimonials || [];

	if (!displayTestimonials || displayTestimonials.length === 0) {
		return null;
	}

	// Duplicate testimonials to create a seamless loop
	const duplicatedTestimonials = [
		...displayTestimonials,
		...displayTestimonials,
		...displayTestimonials,
	];

	return (
		<section className="py-24 bg-slate-50 relative overflow-hidden">
			{/* Background Blurs */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px]" />
				<div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px]" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-16 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6"
				>
					<span className="animate-pulse flex items-center justify-center">
						<HiStar />
					</span>
					<span>Real Experiences</span>
				</motion.div>

				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.1 }}
					className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-tight"
				>
					Dipercaya Ribuan <br />
					<span className="text-brand-gradient">
						Pelanggan Setia Setiap Hari
					</span>
				</motion.h2>
			</div>

			{/* Infinite Marquee Container */}
			<div className="relative flex flex-col gap-8 py-10 overflow-hidden">
				{/* Row 1: Scrolling Left */}
				<div className="flex w-full">
					<motion.div
						animate={{
							x: [0, -1920],
						}}
						transition={{
							x: {
								duration: 40,
								repeat: Infinity,
								ease: "linear",
							},
						}}
						className="flex gap-6 whitespace-nowrap"
					>
						{duplicatedTestimonials.map((t, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: intentional duplicate items for infinite marquee
							<TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
						))}
					</motion.div>
				</div>

				{/* Row 2: Scrolling Right (Reverse Offset) */}
				<div className="flex w-full">
					<motion.div
						animate={{
							x: [-1920, 0],
						}}
						transition={{
							x: {
								duration: 50,
								repeat: Infinity,
								ease: "linear",
							},
						}}
						className="flex gap-6 whitespace-nowrap"
					>
						{[...duplicatedTestimonials].reverse().map((t, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: intentional duplicate items for infinite marquee
							<TestimonialCard key={`rev-${t.id}-${i}`} testimonial={t} />
						))}
					</motion.div>
				</div>

				{/* Shading Gradients for Smooth Edges */}
				<div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 to-transparent z-10" />
				<div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 to-transparent z-10" />
			</div>
		</section>
	);
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
	const name =
		testimonial.guest_name ||
		testimonial.profiles?.full_name ||
		"Pelanggan Setia";

	return (
		<div className="w-[350px] sm:w-[450px] shrink-0 p-8 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500 group">
			<div className="flex gap-1 mb-6">
				{Array.from({ length: testimonial.rating || 5 }, (_, i) => i).map(
					(i) => (
						<span
							key={i}
							className="text-amber-400 group-hover:scale-110 transition-transform"
						>
							<HiStar />
						</span>
					),
				)}
			</div>

			<div className="relative">
				<span className="absolute -top-4 -left-2 text-slate-100 text-5xl -z-10">
					<FaQuoteLeft />
				</span>
				<p className="text-slate-700 font-medium italic leading-relaxed mb-8 whitespace-normal line-clamp-3">
					"{testimonial.content}"
				</p>
			</div>

			<div className="flex items-center gap-4">
				<div className="w-12 h-12 rounded-full bg-brand-primary/10 border-2 border-white flex items-center justify-center font-black text-brand-primary text-sm shadow-sm ring-4 ring-slate-50">
					{name.charAt(0)}
				</div>
				<div>
					<p className="font-bold text-slate-900 leading-none">{name}</p>
					<p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						Verified
					</p>
				</div>
			</div>
		</div>
	);
}
