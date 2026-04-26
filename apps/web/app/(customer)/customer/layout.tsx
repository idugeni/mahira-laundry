"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	HiOutlineArrowLeftOnRectangle,
	HiOutlineChatBubbleOvalLeftEllipsis,
	HiOutlineCreditCard,
	HiOutlineShoppingBag,
	HiOutlineSquares2X2,
	HiOutlineStar,
	HiOutlineUserCircle,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";

const customerNav = [
	{ href: "/customer", label: "Dashboard", icon: HiOutlineSquares2X2 },
	{ href: "/customer/order", label: "Order", icon: HiOutlineShoppingBag },
	{ href: "/customer/loyalty", label: "Loyalty", icon: HiOutlineStar },
	{
		href: "/customer/pembayaran",
		label: "Pembayaran",
		icon: HiOutlineCreditCard,
	},
	{
		href: "/customer/testimonial",
		label: "Testimoni",
		icon: HiOutlineChatBubbleOvalLeftEllipsis,
	},
	{ href: "/customer/profil", label: "Profil", icon: HiOutlineUserCircle },
];

import { NotificationPopover } from "@/components/shared/common/notification-popover";
import { useAuth } from "@/hooks/use-auth";

export default function CustomerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { profile } = useAuth();

	const getInitials = (name?: string) => {
		if (!name) return "??";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/50">
			{/* Sidebar ... */}
			<motion.aside
				initial={{ x: -260 }}
				animate={{ x: 0 }}
				className="hidden lg:flex lg:w-64 flex-col bg-white shadow-[20px_0_40px_-15px_rgba(0,0,0,0.03)] sticky top-0 h-screen"
			>
				<div className="p-6 mb-2">
					<Link href="/">
						<MahiraLogo size={32} />
					</Link>
				</div>
				<nav className="flex-1 px-4 py-4 space-y-1">
					{customerNav.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
									isActive
										? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
										: "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
								}`}
							>
								<span
									className={`w-5 h-5 flex items-center justify-center transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
								>
									<item.icon />
								</span>
								<span>{item.label}</span>
								{isActive && (
									<motion.div
										layoutId="active-pill"
										className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40"
									/>
								)}
							</Link>
						);
					})}
				</nav>
				<div className="p-4 border-t border-slate-100 bg-slate-50/50">
					<form action="/api/auth/signout" method="POST">
						<button
							type="submit"
							className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all w-full text-left"
						>
							<div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-red-100 group-hover:text-red-600 transition-all">
								<HiOutlineArrowLeftOnRectangle size={20} />
							</div>
							<span className="tracking-tight">Keluar Sesi</span>
						</button>
					</form>
				</div>
			</motion.aside>

			{/* Main content */}
			<div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
				<header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
					<div className="flex items-center gap-3 lg:hidden">
						<Link href="/">
							<MahiraLogo size={28} showText={false} />
						</Link>
						<div className="w-px h-6 bg-slate-200 mx-1" />
						<h2 className="font-bold font-[family-name:var(--font-heading)] text-slate-800 text-sm truncate">
							{customerNav.find((n) => n.href === pathname)?.label || "Menu"}
						</h2>
					</div>

					<h2 className="hidden lg:block font-bold font-[family-name:var(--font-heading)] text-slate-800">
						{customerNav.find((n) => n.href === pathname)?.label ||
							"Portal Pelanggan"}
					</h2>

					<div className="flex items-center gap-2 sm:gap-3">
						<NotificationPopover />
						<Link
							href="/customer/profil"
							className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary overflow-hidden relative"
						>
							{profile?.avatar_url ? (
								<img
									src={profile.avatar_url}
									alt={profile.full_name || "Avatar"}
									className="w-full h-full object-cover object-top"
								/>
							) : (
								getInitials(profile?.full_name as string)
							)}
						</Link>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-8">
					<motion.div
						key={pathname}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="max-w-5xl mx-auto"
					>
						{children}
					</motion.div>
				</main>

				{/* Dashboard Footer */}
				<footer className="p-4 lg:p-6 text-center text-sm text-slate-500 bg-transparent shrink-0">
					<p>
						© {new Date().getFullYear()} Mahira Laundry Group. All rights
						reserved.
					</p>
				</footer>
			</div>

			{/* Mobile Bottom Navigation */}
			<nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.05)] px-2 py-2 flex items-center justify-around z-40 pb-safe">
				{customerNav.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all ${
								isActive ? "text-brand-primary" : "text-slate-400"
							}`}
						>
							<span
								className={`text-2xl transition-transform ${isActive ? "scale-110" : ""}`}
							>
								<item.icon />
							</span>
							<span className="text-[10px] font-bold uppercase tracking-tighter">
								{item.label}
							</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
