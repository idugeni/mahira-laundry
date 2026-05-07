"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MahiraLogo } from "@/components/brand/mahira-logo";

const MINIMUM_LOADER_DURATION = 1200; // Minimum time loader stays visible (ms)

export default function GlobalLoading() {
	const [mounted, setMounted] = useState(false);
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		// Set mounted flag for hydration
		setMounted(true);
		// Prevent scrolling when loader is active
		document.body.style.overflow = "hidden";

		// Ensure loader stays visible for minimum duration to prevent flashing
		const hideTimer = setTimeout(() => {
			setShowLoader(false);
		}, MINIMUM_LOADER_DURATION);

		return () => {
			clearTimeout(hideTimer);
			document.body.style.overflow = "";
		};
	}, []);

	const loaderContent = (
		<div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-300">
			<div className="flex flex-col items-center gap-8 animate-in fade-in duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
				{/* Circular logo with spinning ring */}
				<div className="relative w-32 h-32 flex items-center justify-center">
					{/* Spinning ring */}
					<div
						className="absolute inset-0 rounded-full animate-spin"
						style={{ animationDuration: "1.5s" }}
					>
						<svg viewBox="0 0 128 128" className="w-full h-full" fill="none" aria-hidden="true">
							<circle cx="64" cy="64" r="60" stroke="oklch(var(--muted))" strokeWidth="4" />
							<circle
								cx="64"
								cy="64"
								r="60"
								stroke="url(#splash-gradient)"
								strokeWidth="4"
								strokeLinecap="round"
								strokeDasharray="94 282"
							/>
							<defs>
								<linearGradient id="splash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="var(--brand-primary)" />
									<stop offset="100%" stopColor="var(--brand-accent)" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					{/* Logo inside circle */}
					<div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/20">
						<MahiraLogo size={64} showText={false} />
					</div>
				</div>

				<div className="flex flex-col items-center gap-3">
					<span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
						Mahira Laundry
					</span>
					<div className="flex gap-1.5">
						<div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
						<div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce [animation-delay:-0.15s]" />
						<div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" />
					</div>
				</div>
			</div>
		</div>
	);

	// Server-side fallback: render inline but it will be hidden/trapped until hydration
	if (!mounted) {
		return loaderContent;
	}

	// Only show loader if showLoader state is true (after hydration and within minimum duration)
	if (!showLoader) {
		return null;
	}

	return createPortal(loaderContent, document.body);
}
