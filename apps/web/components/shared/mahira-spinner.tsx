"use client";

import { motion } from "motion/react";

export function MahiraSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
	const sizeMap = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
	const dotSize = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-3 h-3" };

	return (
		<div className="flex flex-col items-center gap-4">
			<div className={`${sizeMap[size]} relative`}>
				{[0, 1, 2, 3].map((i) => (
					<motion.div
						key={i}
						className={`absolute ${dotSize[size]} rounded-full bg-brand-primary`}
						style={{
							top: "50%",
							left: "50%",
							x: "-50%",
							y: "-50%",
						}}
						animate={{
							x: [
								"-50%",
								`calc(-50% + ${Math.cos((i * Math.PI) / 2) * 14}px)`,
								"-50%",
							],
							y: [
								"-50%",
								`calc(-50% + ${Math.sin((i * Math.PI) / 2) * 14}px)`,
								"-50%",
							],
							opacity: [0.4, 1, 0.4],
						}}
						transition={{
							duration: 1.2,
							repeat: Infinity,
							delay: i * 0.15,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>
			<span className="text-sm text-muted-foreground font-medium">
				Memuat...
			</span>
		</div>
	);
}
