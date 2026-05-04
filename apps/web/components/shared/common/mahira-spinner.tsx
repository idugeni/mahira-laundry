"use client";

import { motion } from "motion/react";

export function MahiraSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
	const sizeMap = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
	const insetMap = { sm: "inset-1", md: "inset-2", lg: "inset-2.5" };
	const coreMap = { sm: "inset-2", md: "inset-3.5", lg: "inset-5" };

	return (
		<div className="flex flex-col items-center gap-6">
			<div className={`${sizeMap[size]} relative flex items-center justify-center`}>
				{/* Outer spinning ring */}
				<motion.div
					className="absolute inset-0 border-t-2 border-r-2 border-brand-primary rounded-full shadow-[0_0_15px_rgba(219,39,119,0.3)]"
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				/>
				{/* Inner counter-rotating ring */}
				<motion.div
					className={`absolute ${insetMap[size]} border-b-2 border-l-2 border-brand-accent rounded-full opacity-60`}
					animate={{ rotate: -360 }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
				/>
				{/* Core pulsing dot */}
				<motion.div
					className={`absolute ${coreMap[size]} bg-brand-primary rounded-full shadow-[0_0_10px_rgba(219,39,119,0.5)]`}
					animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
				/>
			</div>
			<div className="flex flex-col items-center gap-1">
				<span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary animate-pulse">
					Mahira Laundry
				</span>
				<span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">
					Premium Care • Quality First
				</span>
			</div>
		</div>
	);
}
