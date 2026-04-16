"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { cn } from "@/lib/utils";

interface NavItem {
	href: string;
	label: string;
	icon: string;
	badge?: number;
}

interface AdminSidebarProps {
	navItems: NavItem[];
	panelLabel: string;
	panelBadge?: string;
	panelBadgeColor?: string;
	headerInfo?: string;
}

interface SidebarContentProps {
	navItems: NavItem[];
	panelLabel: string;
	panelBadgeColor: string;
	headerInfo?: string;
	onNavClick: () => void;
}

function SidebarContent({
	navItems,
	panelLabel,
	panelBadgeColor,
	headerInfo,
	onNavClick,
}: SidebarContentProps) {
	const pathname = usePathname();

	const isActive = (href: string) => {
		if (href === "/admin" || href === "/manager") return pathname === href;
		return pathname.startsWith(href);
	};

	return (
		<div className="flex flex-col h-screen max-h-screen overflow-hidden">
			{/* Header Area (Fixed) */}
			<div className="shrink-0">
				{/* Logo */}
				<div className="p-5 border-b border-slate-100 flex justify-center">
					<Link href="/" onClick={onNavClick}>
						<MahiraLogo size={30} />
					</Link>
				</div>

				{/* Panel Badge */}
				<div className="px-4 pt-4 pb-1 text-center">
					<div className="flex justify-center mb-1.5">
						<span
							className={cn(
								"inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
								panelBadgeColor,
							)}
						>
							{panelLabel}
						</span>
					</div>
					{headerInfo && (
						<p className="text-xs font-bold text-slate-400 px-1 truncate text-center">
							{headerInfo}
						</p>
					)}
				</div>
			</div>

			{/* Nav Area (Scrollable) */}
			<nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
				{navItems.map((item) => {
					const active = isActive(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavClick}
							className={cn(
								"group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
								active
									? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-200"
									: "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
							)}
						>
							<span
								className={cn(
									"text-base w-7 text-center transition-transform duration-150 group-hover:scale-110",
									active && "scale-110",
								)}
							>
								{item.icon}
							</span>
							<span className="tracking-tight flex-1">{item.label}</span>
							{item.badge !== undefined && item.badge > 0 && (
								<span
									className={cn(
										"text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1",
										active
											? "bg-white/30 text-white"
											: "bg-red-100 text-red-600",
									)}
								>
									{item.badge > 99 ? "99+" : item.badge}
								</span>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Logout Area (Fixed/Bottom) */}
			<div className="shrink-0 p-3 border-t border-slate-100 bg-white">
				<form action="/api/auth/signout" method="POST">
					<button
						type="submit"
						className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white transition-all duration-150"
					>
						<LogOut
							size={16}
							className="group-hover:-translate-x-1 transition-transform"
						/>
						<span>Logout</span>
					</button>
				</form>
			</div>
		</div>
	);
}

export function AdminSidebar({
	navItems,
	panelLabel,
	panelBadgeColor = "bg-red-100 text-red-600",
	headerInfo,
}: AdminSidebarProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden lg:flex lg:w-64 shrink-0 flex-col border-r border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 h-screen">
				<SidebarContent
					navItems={navItems}
					panelLabel={panelLabel}
					panelBadgeColor={panelBadgeColor}
					headerInfo={headerInfo}
					onNavClick={() => {}}
				/>
			</aside>

			{/* Mobile Top Bar */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
				<MahiraLogo size={24} priority />
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

			{/* Mobile Drawer */}
			{mobileOpen && (
				<>
					<button
						type="button"
						aria-label="Tutup menu"
						className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm cursor-default"
						onClick={() => setMobileOpen(false)}
					/>
					<aside className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col">
						<SidebarContent
							navItems={navItems}
							panelLabel={panelLabel}
							panelBadgeColor={panelBadgeColor}
							headerInfo={headerInfo}
							onNavClick={() => setMobileOpen(false)}
						/>
					</aside>
				</>
			)}
		</>
	);
}
