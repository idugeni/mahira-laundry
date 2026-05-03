"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { AdminAvatarDropdown } from "@/components/shared/admin/admin-avatar-dropdown";
import { cn } from "@/lib/utils";

interface NavItem {
	href: string;
	label: string;
	icon: ReactNode;
	badge?: number;
}

interface NavGroup {
	label?: string;
	items: NavItem[];
}

interface AdminSidebarProps {
	navItems: NavGroup[];
	panelLabel: string;
	panelBadge?: string;
	panelBadgeColor?: string;
	headerInfo?: string;
	profile?: { full_name: string | null; avatar_url: string | null } | null;
}

interface SidebarContentProps {
	navItems: NavGroup[];
	onNavClick: () => void;
}

function SidebarContent({ navItems, onNavClick }: SidebarContentProps) {
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
				<div className="px-5 py-5 border-b border-slate-100 flex items-center">
					<Link href="/" onClick={onNavClick}>
						<MahiraLogo size={30} />
					</Link>
				</div>
			</div>

			{/* Nav Area (Scrollable) */}
			<nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-hide space-y-4">
				{navItems.map((group) => (
					<div key={group.label ?? "default"} className="space-y-0.5">
						{group.label && (
							<p className="px-3 pt-2 pb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
								{group.label}
							</p>
						)}
						{group.items.map((item) => {
							const active = isActive(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={onNavClick}
									className={cn(
										"group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
										active
											? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs shadow-pink-200"
											: "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
									)}
								>
									<span
										className={cn(
											"flex w-7 items-center justify-center text-base transition-transform duration-150 group-hover:-translate-y-0.5",
											active && "-translate-y-0.5",
										)}
									>
										{item.icon}
									</span>
									<span className="tracking-tight flex-1 whitespace-nowrap">{item.label}</span>
									{item.badge !== undefined && item.badge > 0 && (
										<span
											className={cn(
												"text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1",
												active ? "bg-white/30 text-white" : "bg-red-100 text-red-600",
											)}
										>
											{item.badge > 99 ? "99+" : item.badge}
										</span>
									)}
								</Link>
							);
						})}
					</div>
				))}
			</nav>
		</div>
	);
}

export function AdminSidebar({
	navItems,
	panelLabel,
	panelBadgeColor = "bg-red-100 text-red-600",
	headerInfo,
	profile,
}: AdminSidebarProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-slate-100 bg-white/95 backdrop-blur-xs sticky top-0 h-screen">
				<SidebarContent navItems={navItems} onNavClick={() => {}} />
			</aside>

			{/* Mobile Top Bar */}
			<div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-slate-100">
				<MahiraLogo size={24} />
				<div className="flex items-center gap-3">
					<AdminAvatarDropdown
						fullName={profile?.full_name}
						avatarUrl={profile?.avatar_url}
						panelLabel={panelLabel}
						panelBadgeColor={panelBadgeColor}
						headerInfo={headerInfo}
					/>
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
				<SidebarContent navItems={navItems} onNavClick={() => setMobileOpen(false)} />
			</aside>
		</>
	);
}
