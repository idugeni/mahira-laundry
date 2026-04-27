"use client";

import { motion } from "motion/react";

export function MahiraSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
	const sizeMap = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
	const dotSize = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-3 h-3" };

	return (
		<div className="flex flex-col items-center gap-6">
			<div className={`${sizeMap[size]} relative`}>
				{/* Inner rotating ring */}
				<motion.div
					className="absolute inset-0 border-2 border-brand-primary/10 rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
				/>
				{/* Outer glow dots */}
				{[0, 1, 2, 3].map((i) => (
					<motion.div
						key={i}
						className={`absolute ${dotSize[size]} rounded-full bg-brand-primary shadow-[0_0_15px_rgba(219,39,119,0.5)]`}
						style={{
							top: "50%",
							left: "50%",
							x: "-50%",
							y: "-50%",
						}}
						animate={{
							x: [
								"-50%",
								`calc(-50% + ${Math.cos((i * Math.PI) / 2) * (size === "lg" ? 24 : 16)}px)`,
								"-50%",
							],
							y: [
								"-50%",
								`calc(-50% + ${Math.sin((i * Math.PI) / 2) * (size === "lg" ? 24 : 16)}px)`,
								"-50%",
							],
							scale: [1, 1.5, 1],
							opacity: [0.3, 1, 0.3],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							delay: i * 0.2,
							ease: "easeInOut",
						}}
					/>
				))}
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
