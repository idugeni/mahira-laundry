"use client";

import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { HiOutlineArrowUp } from "react-icons/hi2";

export function BackToTop() {
	const [isVisible, setIsVisible] = useState(false);
	const { scrollYProgress } = useScroll();

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 500) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<div
					key="back-to-top"
					className="fixed bottom-8 right-8 z-[60] flex items-center justify-center"
				>
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.8 }}
						className="relative group"
					>
						{/* Circular Progress Stroke */}
						<svg className="w-16 h-16 transform -rotate-90" aria-hidden="true">
							<circle
								cx="32"
								cy="32"
								r="28"
								stroke="currentColor"
								strokeWidth="2"
								fill="transparent"
								className="text-slate-200"
							/>
							<motion.circle
								cx="32"
								cy="32"
								r="28"
								stroke="currentColor"
								strokeWidth="3"
								fill="transparent"
								strokeDasharray="175.93"
								style={{ pathLength: scrollYProgress }}
								className="text-brand-primary"
							/>
						</svg>

						<motion.button
							onClick={scrollToTop}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="absolute inset-2 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl transition-colors hover:bg-brand-primary group-hover:shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)]"
							aria-label="Back to top"
						>
							<span className="text-xl group-hover:-translate-y-1 transition-transform">
								<HiOutlineArrowUp />
							</span>
						</motion.button>

						{/* Tooltip */}
						<div className="absolute bottom-full right-0 mb-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
							Kembali ke Atas
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
