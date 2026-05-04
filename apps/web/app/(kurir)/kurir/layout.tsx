"use client";

import Link from "next/link";
import { useState } from "react";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { DynamicBreadcrumb } from "@/components/shared/admin/dynamic-breadcrumb";
import { cn } from "@/lib/utils";

export default function KurirLayout({ children }: { children: React.ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className="min-h-screen flex bg-muted/30">
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-white">
				<div className="p-6 border-b border-border">
					<Link href="/">
						<MahiraLogo size={32} />
					</Link>
				</div>
				<div className="px-4 py-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Kurir Panel
					</span>
				</div>
				<nav className="flex-1 p-4 space-y-1">
					<Link
						href="/kurir/tugas"
						className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					>
						<span>🗺️</span>
						<span>Peta Tugas</span>
					</Link>
				</nav>
			</aside>

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
						Kurir Panel
					</span>
				</div>
				<nav className="flex-1 p-4 space-y-1">
					<Link
						href="/kurir/tugas"
						onClick={() => setMobileOpen(false)}
						className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					>
						<span>🗺️</span>
						<span>Peta Tugas</span>
					</Link>
				</nav>
			</aside>

			<div className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0">
				<header className="hidden md:flex h-16 border-b border-border bg-white items-center px-6">
					<DynamicBreadcrumb />
				</header>
				<main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
				<footer className="p-4 md:p-6 border-t border-border text-center text-sm text-muted-foreground bg-white/50 shrink-0">
					<p>© 2023-{new Date().getFullYear()} Mahira Group. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
}
