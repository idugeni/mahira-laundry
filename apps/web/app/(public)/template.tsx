"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MahiraLogo } from "@/components/brand/mahira-logo";

export default function Template({ children }: { children: React.ReactNode }) {
	const [isFinishing, setIsFinishing] = useState(false);

	useEffect(() => {
		// Memberikan jeda sangat singkat agar mata pengguna sempat melihat logo brand
		const timer = setTimeout(() => {
			setIsFinishing(true);
		}, 400);

		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{/* Splash Screen */}
			<AnimatePresence>
				{!isFinishing && (
					<motion.div
						key="splash-screen"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 z-[999] flex items-center justify-center bg-white"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0.5 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 1.1, opacity: 0 }}
							className="flex flex-col items-center gap-4"
						>
							<MahiraLogo size={60} showText={false} priority />
							<div className="h-0.5 w-12 bg-slate-100 rounded-full overflow-hidden">
								<motion.div
									initial={{ x: "-100%" }}
									animate={{ x: "100%" }}
									transition={{
										duration: 0.4,
										repeat: Infinity,
										ease: "linear",
									}}
									className="h-full w-full bg-brand-primary"
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Page Content always rendered to avoid Next.js routing issues, but opacity animated */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: isFinishing ? 1 : 0 }}
				transition={{ duration: 0.3 }}
				className={isFinishing ? "" : "pointer-events-none"}
			>
				{children}
			</motion.div>
		</>
	);
}
