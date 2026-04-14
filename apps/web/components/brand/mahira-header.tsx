"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
	HiOutlineBars3BottomRight,
	HiOutlineChevronRight,
	HiOutlineSquares2X2,
	HiOutlineUser,
	HiOutlineXMark,
} from "react-icons/hi2";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardUrl } from "@/lib/utils";
import { MahiraLogo } from "./mahira-logo";

const links = [
	{ href: "/layanan", label: "Layanan" },
	{ href: "/lacak", label: "Lacak Pesanan" },
	{ href: "/galeri", label: "Galeri" },
	{ href: "/tentang", label: "Tentang" },
	{ href: "/lokasi", label: "Lokasi" },
];

export function MahiraHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const { user, profile, loading } = useAuth();

	const getInitials = (name?: string) => {
		if (!name) return "??";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	const dashboardHref = getDashboardUrl(profile?.role as string);

	return (
		<motion.header
			initial={{ y: -64, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 lg:h-20">
					<Link href="/" className="flex items-center">
						<MahiraLogo size={36} />
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden lg:flex items-center gap-8">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-semibold text-slate-500 hover:text-brand-primary transition-colors"
							>
								{link.label}
							</Link>
						))}

						{loading ? (
							<div className="flex items-center gap-3 pl-2 pr-6 py-1.5 bg-slate-100/50 rounded-full animate-pulse">
								<div className="w-8 h-8 rounded-full bg-slate-200" />
								<div className="h-4 w-12 bg-slate-200 rounded" />
							</div>
						) : user ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
							>
								<Link
									href={dashboardHref}
									className="group flex items-center gap-3 pl-2 pr-6 py-1.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200"
								>
									<div className="w-8 h-8 rounded-full bg-brand-accent text-slate-900 flex items-center justify-center font-bold text-xs ring-2 ring-slate-800 group-hover:ring-brand-accent transition-all">
										{getInitials(profile?.full_name as string)}
									</div>
									<div className="flex flex-col items-start leading-none">
										<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
											Dashboard
										</span>
										<span className="text-sm font-bold">
											{profile?.full_name?.toString().split(" ")[0] || "User"}
										</span>
									</div>
									<span className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all">
										<HiOutlineSquares2X2 />
									</span>
								</Link>
							</motion.div>
						) : (
							<Link
								href="/login"
								className="group text-sm font-bold px-6 py-2.5 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-all hover:shadow-lg hover:shadow-brand-primary/25 flex items-center gap-2"
							>
								<span className="w-4 h-4 flex items-center justify-center">
									<HiOutlineUser />
								</span>
								<span>Masuk</span>
								<span className="w-3 h-3 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
									<HiOutlineChevronRight />
								</span>
							</Link>
						)}
					</nav>

					{/* Mobile Toggle */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 rounded-full hover:bg-slate-50 transition-colors ring-1 ring-slate-100"
					>
						{isOpen ? (
							<span className="text-2xl flex items-center justify-center">
								<HiOutlineXMark />
							</span>
						) : (
							<span className="text-2xl flex items-center justify-center">
								<HiOutlineBars3BottomRight />
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl p-6 space-y-4"
					>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className="block text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl"
							>
								{link.label}
							</Link>
						))}
						{!loading &&
							(user ? (
								<Link
									href={dashboardHref}
									onClick={() => setIsOpen(false)}
									className="flex items-center justify-between w-full px-5 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-200"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-brand-accent text-slate-900 flex items-center justify-center font-bold">
											{getInitials(profile?.full_name as string)}
										</div>
										<span>Portal {profile?.role as string}</span>
									</div>
									<span className="flex items-center justify-center text-xl text-brand-accent">
										<HiOutlineSquares2X2 />
									</span>
								</Link>
							) : (
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="flex items-center justify-between w-full px-5 py-4 bg-brand-primary text-white rounded-full font-bold shadow-xl shadow-brand-primary/20"
								>
									<span>Masuk ke Akun</span>
									<span className="flex items-center justify-center text-xl">
										<HiOutlineUser />
									</span>
								</Link>
							))}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
