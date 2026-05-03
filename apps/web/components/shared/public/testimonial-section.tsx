"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa6";
import { HiStar, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

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

const ITEMS_PER_PAGE = 6; // Max 6 testimonials (3x2 grid)

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
	const [currentPage, setCurrentPage] = useState(0);
	const displayTestimonials = testimonials || [];

	if (!displayTestimonials || displayTestimonials.length === 0) {
		return null;
	}

	const totalPages = Math.ceil(displayTestimonials.length / ITEMS_PER_PAGE);
	const startIndex = currentPage * ITEMS_PER_PAGE;
	const visibleTestimonials = displayTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const goToPrev = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
	const goToNext = () => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));

	return (
		<section className="py-14 sm:py-16 bg-slate-50 relative [overflow:clip] w-full min-w-0">
			{/* Background Blurs */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
				<div className="absolute top-1/4 left-0 w-52 sm:w-72 h-52 sm:h-72 bg-brand-primary/10 rounded-full blur-[100px]" />
				<div className="absolute bottom-1/4 right-0 w-52 sm:w-72 h-52 sm:h-72 bg-brand-accent/10 rounded-full blur-[100px]" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-12 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: false }}
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
					viewport={{ once: false }}
					transition={{ delay: 0.1 }}
					className="text-3xl sm:text-4xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-tight"
				>
					Dipercaya Ribuan <br />
					<span className="text-brand-gradient">Pelanggan Setia Setiap Hari</span>
				</motion.h2>
			</div>

			{/* Carousel Container */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="relative">
					{/* Navigation Arrows */}
					{totalPages > 1 && (
						<>
							<button
								onClick={goToPrev}
								className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:shadow-xl transition-all duration-300"
								aria-label="Testimonial sebelumnya"
							>
								<HiOutlineChevronLeft size={20} />
							</button>
							<button
								onClick={goToNext}
								className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:shadow-xl transition-all duration-300"
								aria-label="Testimonial berikutnya"
							>
								<HiOutlineChevronRight size={20} />
							</button>
							</>
						)}

					{/* Testimonials Grid with Animation */}
					<div className="overflow-hidden">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentPage}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
							>
								{visibleTestimonials.map((testimonial) => (
									<TestimonialCard key={testimonial.id} testimonial={testimonial} />
								))}
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Pagination Dots */}
					{totalPages > 1 && (
						<div className="flex justify-center gap-2 mt-10">
							{Array.from({ length: totalPages }, (_, i) => i).map((index) => (
								<button
									key={index}
									onClick={() => setCurrentPage(index)}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${
										index === currentPage
											? "w-8 bg-brand-primary"
											: "bg-slate-200 hover:bg-slate-300"
									}`}
									aria-label={`Halaman ${index + 1}`}
								/>
							))}
							</div>
						)}
					</div>
				</div>
			</section>
	);
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
	const name = testimonial.guest_name || testimonial.profiles?.full_name || "Pelanggan Setia";

	return (
		<motion.div
			whileHover={{ y: -6 }}
			transition={{ type: "spring", stiffness: 300, damping: 25 }}
			className="w-full min-w-0 h-full p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-brand-primary/5 transition-[box-shadow] duration-500 group"
		>
			<div className="flex gap-1 mb-6">
				{Array.from({ length: testimonial.rating || 5 }, (_, i) => i).map((i) => (
					<span key={`star-${testimonial.id}-${i}`} className="text-amber-400 transition-transform">
						<HiStar />
					</span>
				))}
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
				<div className="w-12 h-12 rounded-full bg-brand-primary/10 border-2 border-white flex items-center justify-center font-black text-brand-primary text-sm shadow-xs ring-4 ring-slate-50">
					{name.charAt(0)}
				</div>
				<div>
					<p className="font-bold text-slate-900 leading-none">{name}</p>
					<p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
						Terverifikasi
					</p>
				</div>
			</div>
		</motion.div>
	);
}
