"use client";

import { useState } from "react";
import Link from "next/link";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { cn } from "@/lib/utils";

interface KasirMobileNavProps {
	navItems: { href: string; label: string; icon: string }[];
}

export function KasirMobileNav({ navItems }: KasirMobileNavProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			{/* Mobile Top Bar */}
			<div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-border">
				<MahiraLogo size={24} />
				<button
					type="button"
					onClick={() => setMobileOpen(!mobileOpen)}
					className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
					aria-label="Toggle menu"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						{mobileOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile Drawer Overlay */}
			<button
				type="button"
				aria-label="Tutup menu"
				className={cn(
					"md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-xs cursor-default transition-opacity duration-300",
					mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
				)}
				onClick={() => setMobileOpen(false)}
			/>

			{/* Mobile Drawer Panel */}
			<aside
				className={cn(
					"md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
					mobileOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="p-6 border-b border-border">
					<Link href="/" onClick={() => setMobileOpen(false)}>
						<MahiraLogo size={32} />
					</Link>
				</div>
				<div className="px-4 py-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Kasir Panel
					</span>
				</div>
				<nav className="flex-1 p-4 space-y-1">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						>
							<span>{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					))}
				</nav>
			</aside>
		</>
	);
}
