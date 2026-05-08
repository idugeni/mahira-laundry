"use client";

import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	HiOutlineBars3BottomRight,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineInformationCircle,
	HiOutlineMapPin,
	HiOutlinePhoto,
	HiOutlineSparkles,
	HiOutlineSquares2X2,
	HiOutlineUser,
	HiOutlineXMark,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { AdminAvatar } from "@/components/shared/admin/admin-avatar";
import { UniversalSearch } from "@/components/shared/public/universal-search";
import { useAuth } from "@/hooks/use-auth";
import type { Profile } from "@/lib/types";
import { getDashboardUrl } from "@/lib/utils";

const megaMenuItems = [
	{
		href: "/layanan",
		label: "Layanan",
		description: "Laundry & dry cleaning premium",
		icon: HiOutlineSparkles,
		badge: "Populer",
	},
	{
		href: "/galeri",
		label: "Galeri",
		description: "Portofolio hasil kerja terbaik",
		icon: HiOutlinePhoto,
		badge: null,
	},
	{
		href: "/lokasi",
		label: "Lokasi",
		description: "Temukan outlet terdekat",
		icon: HiOutlineMapPin,
		badge: null,
	},
	{
		href: "/tentang",
		label: "Tentang",
		description: "Cerita & visi Mahira Laundry",
		icon: HiOutlineInformationCircle,
		badge: null,
	},
	{
		href: "/faq",
		label: "Bantuan & FAQ",
		description: "Pertanyaan yang sering diajukan",
		icon: HiOutlineSquares2X2,
		badge: null,
	},
];

const megaContainerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.06 },
	},
};

const megaItemVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
	},
};

export function MahiraHeader({
	initialUser,
	initialProfile,
}: {
	initialUser?: User | null;
	initialProfile?: Profile | null;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [megaOpen, setMegaOpen] = useState(false);
	const megaRef = useRef<HTMLDivElement>(null);
	const { user: ctxUser, profile: ctxProfile, loading: ctxLoading } = useAuth();

	const user = ctxLoading && initialUser !== undefined ? initialUser : ctxUser;
	const profile = ctxLoading && initialProfile !== undefined ? initialProfile : ctxProfile;
	const loading = ctxLoading && initialUser === undefined;

	const _getInitials = (name?: string) => {
		if (!name) return "??";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	const dashboardHref = getDashboardUrl(profile?.role as string);

	// Close mega menu on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
				setMegaOpen(false);
			}
		};
		if (megaOpen) document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [megaOpen]);

	// Prevent background scrolling when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<div key="header-root-container" className="contents">
			<header
				key="header-main"
				className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-20 gap-4 min-w-0">
						<Link href="/" className="flex items-center min-w-0">
							<MahiraLogo size={36} />
						</Link>

						{/* Desktop Nav */}
						<nav className="hidden lg:flex items-center gap-5">
							<UniversalSearch variant="header" className="mr-1" />

							{/* Mega Menu Trigger */}
							<div ref={megaRef} className="relative">
								<button
									type="button"
									onClick={() => setMegaOpen(!megaOpen)}
									className={`flex items-center gap-1.5 text-sm font-bold transition-all duration-300 px-4 py-2 rounded-full ${
										megaOpen
											? "text-brand-primary bg-brand-primary/5 shadow-sm shadow-brand-primary/10"
											: "text-slate-500 hover:text-brand-primary hover:bg-slate-50"
									}`}
								>
									Jelajahi
									<motion.span
										animate={{ rotate: megaOpen ? 180 : 0 }}
										transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
										className="inline-flex"
									>
										<HiOutlineChevronDown size={14} />
									</motion.span>
								</button>

								{/* Mega Menu Dropdown */}
								<AnimatePresence>
									{megaOpen && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.96 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 6, scale: 0.98 }}
											transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
											className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[520px] bg-white rounded-[1.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
										>
											{/* Featured Promo Strip */}
											<Link
												href="/paket-usaha"
												onClick={() => setMegaOpen(false)}
												className="group flex items-center justify-between mx-4 mt-4 px-5 py-3.5 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-2xl hover:from-brand-primary/10 hover:to-brand-accent/10 transition-all duration-300"
											>
												<div className="flex items-center gap-3">
													<div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
														<HiOutlineSparkles size={18} />
													</div>
													<div>
														<p className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors duration-300">
															Paket Usaha
															<span className="ml-2 text-[9px] font-black text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
																Baru
															</span>
														</p>
														<p className="text-[11px] text-slate-400 mt-0.5">
															Mulai bisnis laundry Anda
														</p>
													</div>
												</div>
												<span className="text-brand-primary group-hover:translate-x-1 transition-transform duration-300">
													<HiOutlineChevronRight size={16} />
												</span>
											</Link>

											{/* Divider */}
											<div className="mx-4 my-3">
												<div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
											</div>

											{/* Menu Grid */}
											<motion.div
												variants={megaContainerVariants}
												initial="hidden"
												animate="visible"
												className="grid grid-cols-2 gap-1 px-3 pb-3"
											>
												{megaMenuItems.map((item) => {
													const Icon = item.icon;
													return (
														<motion.div key={item.href} variants={megaItemVariants}>
															<Link
																href={item.href}
																onClick={() => setMegaOpen(false)}
																className="group flex items-start gap-3 p-3.5 rounded-2xl hover:bg-brand-primary/5 transition-all duration-300 relative"
															>
																<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/25 transition-all duration-300 shrink-0">
																	<Icon size={20} />
																</div>
																<div className="min-w-0">
																	<div className="flex items-center gap-2">
																		<p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors duration-300">
																			{item.label}
																		</p>
																		{item.badge && (
																			<span className="text-[8px] font-black text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
																				{item.badge}
																			</span>
																		)}
																	</div>
																	<p className="text-[11px] text-slate-400 leading-snug mt-0.5 group-hover:text-slate-500 transition-colors duration-300">
																		{item.description}
																	</p>
																</div>
															</Link>
														</motion.div>
													);
												})}
											</motion.div>

											{/* CTA Footer */}
											<div className="mx-3 mb-3 mt-1 pt-3 border-t border-slate-100/60">
												<Link
													href="/layanan"
													onClick={() => setMegaOpen(false)}
													className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-brand-primary/5 transition-all duration-300 group"
												>
													<span className="text-xs font-bold text-slate-400 group-hover:text-brand-primary transition-colors duration-300">
														Lihat Semua Layanan →
													</span>
													<span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
														<HiOutlineChevronRight size={12} />
													</span>
												</Link>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Paket Usaha - Featured */}
							<Link
								href="/paket-usaha"
								className="text-sm font-bold text-brand-primary px-5 py-2 bg-brand-primary/5 rounded-full hover:bg-brand-primary/10 transition-colors duration-200 whitespace-nowrap flex items-center gap-2"
							>
								Paket Usaha
								<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
							</Link>

							<div className="h-6 w-px bg-slate-200 mx-1" />

							{loading ? (
								<div
									key="header-loading"
									className="flex items-center gap-3 pl-2 pr-6 py-1.5 bg-slate-100/50 rounded-full animate-pulse"
								>
									<div className="w-8 h-8 rounded-full bg-slate-200" />
									<div className="h-4 w-12 bg-slate-200 rounded-sm" />
								</div>
							) : user && profile ? (
								<motion.div
									key="header-user-profile"
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
								>
									<Link
										href={dashboardHref}
										className="group flex items-center gap-3 pl-2 pr-6 py-1.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors duration-200"
									>
										<AdminAvatar
											fullName={profile?.full_name}
											avatarUrl={profile?.avatar_url}
											className="w-8 h-8 ring-2 ring-slate-800 group-hover:ring-brand-accent transition-all"
										/>
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
									key="header-login-button"
									href="/login"
									className="group text-sm font-bold px-6 py-2.5 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-colors duration-200 flex items-center gap-2"
								>
									<span className="w-4 h-4 flex items-center justify-center">
										<HiOutlineUser />
									</span>
									<span>Masuk</span>
									<span className="w-3 h-3 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
										<HiOutlineChevronRight />
									</span>
								</Link>
							)}
						</nav>

						{/* Mobile Toggle */}
						<button
							type="button"
							onClick={() => setIsOpen(true)}
							className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 rounded-full hover:bg-slate-50 transition-colors ring-1 ring-slate-100"
						>
							<span className="text-2xl flex items-center justify-center text-brand-primary">
								<HiOutlineBars3BottomRight />
							</span>
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Sidebar */}
			<AnimatePresence key="mobile-menu-presence">
				{isOpen && (
					<motion.div
						key="mobile-menu-backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsOpen(false)}
						className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs lg:hidden"
					/>
				)}
				{isOpen && (
					<motion.div
						key="mobile-menu-panel"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] lg:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-slate-100">
							<MahiraLogo size={32} />
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900 hover:bg-slate-100 transition-colors"
							>
								<HiOutlineXMark size={24} />
							</button>
						</div>

						{/* Links */}
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							<div className="px-2">
								<UniversalSearch
									variant="section"
									className="!px-0"
									placeholder="Cari layanan..."
								/>
							</div>

							{/* Featured */}
							<div>
								<Link
									href="/paket-usaha"
									onClick={() => setIsOpen(false)}
									className="flex items-center justify-between w-full px-5 py-4 bg-brand-primary/5 text-brand-primary border border-brand-primary/10 text-lg font-black rounded-2xl group"
								>
									<span className="flex items-center gap-3">
										Paket Usaha
										<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
									</span>
									<span className="text-brand-primary">
										<HiOutlineChevronRight size={18} />
									</span>
								</Link>
							</div>

							{/* Mega Menu Items */}
							<div>
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-4">
									Jelajahi
								</p>
								<div className="space-y-1">
									{megaMenuItems.map((item) => {
										const Icon = item.icon;
										return (
											<Link
												key={item.href}
												href={item.href}
												onClick={() => setIsOpen(false)}
												className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-slate-900 hover:bg-slate-50 transition-colors group"
											>
												<div className="w-9 h-9 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors shrink-0">
													<Icon size={18} />
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-bold">{item.label}</p>
													<p className="text-[11px] text-slate-400 truncate">{item.description}</p>
												</div>
												<span className="text-slate-300">
													<HiOutlineChevronRight size={16} />
												</span>
											</Link>
										);
									})}
								</div>
							</div>
						</div>

						{/* Footer Actions */}
						<div className="p-6 bg-slate-50/50 border-t border-slate-100">
							{!loading &&
								(user ? (
									<Link
										href={dashboardHref}
										onClick={() => setIsOpen(false)}
										className="flex items-center justify-between w-full px-6 py-4 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl shadow-slate-200"
									>
										<div className="flex items-center gap-4">
											<AdminAvatar
												fullName={profile?.full_name}
												avatarUrl={profile?.avatar_url}
												className="w-10 h-10"
											/>
											<div className="flex flex-col items-start leading-tight">
												<span className="text-[10px] text-slate-400 uppercase tracking-widest">
													Akses Portal
												</span>
												<span className="text-sm">Dashboard</span>
											</div>
										</div>
										<span className="text-brand-accent">
											<HiOutlineSquares2X2 size={24} />
										</span>
									</Link>
								) : (
									<Link
										href="/login"
										onClick={() => setIsOpen(false)}
										className="flex items-center justify-between w-full px-8 py-5 bg-brand-primary text-white rounded-[2rem] font-black shadow-xl shadow-brand-primary/20 group"
									>
										<span>MASUK AKUN</span>
										<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
											<HiOutlineUser size={20} />
										</div>
									</Link>
								))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
