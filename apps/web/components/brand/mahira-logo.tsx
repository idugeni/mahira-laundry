"use client";

import Image from "next/image";

interface MahiraLogoProps {
	size?: number;
	className?: string;
	showText?: boolean;
}

export function MahiraLogo({ size = 40, className = "", showText = true }: MahiraLogoProps) {
	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<Image
				src="/logo.png"
				alt="Mahira Laundry Logo"
				width={size}
				height={size}
				className="object-contain"
				priority
				loading="eager"
				fetchPriority="high"
			/>
			{showText && (
				<div className="flex flex-col">
					<span className="font-[family-name:var(--font-heading)] font-bold text-lg leading-tight tracking-tight">
						<span className="text-brand-primary">Mahira</span>
						<span className="text-brand-accent">Laundry</span>
					</span>
					<span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
						Premium Laundry & Dry Cleaning
					</span>
				</div>
			)}
		</div>
	);
}
