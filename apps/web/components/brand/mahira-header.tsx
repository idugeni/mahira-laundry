"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	HiOutlineBars3BottomRight,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineGlobeAlt,
	HiOutlineInformationCircle,
	HiOutlineMapPin,
	HiOutlinePhoto,
	HiOutlineSquares2X2,
	HiOutlineSparkles,
	HiOutlineUser,
	HiOutlineXMark,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { UniversalSearch } from "@/components/shared/public/universal-search";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardUrl } from "@/lib/utils";

const megaMenuItems = [
	{
		href: "/layanan",
		label: "Layanan",
		description: "Daftar layanan laundry & dry cleaning premium",
		icon: HiOutlineSparkles,
	},
	{
		href: "/galeri",
		label: "Galeri",
		description: "Portofolio hasil kerja berkualitas tinggi",
		icon: HiOutlinePhoto,
	},
	{
		href: "/lokasi",
		label: "Lokasi",
		description: "Temukan outlet Mahira terdekat",
		icon: HiOutlineMapPin,
	},
	{
		href: "/tentang",
		label: "Tentang",
		description: "Cerita & visi Mahira Laundry",
		icon: HiOutlineInformationCircle,
	},
];

export function MahiraHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const [megaOpen, setMegaOpen] = useState(false);
	const megaRef = useRef<HTMLDivElement>(null);
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

	return (
		<div key="header-root-container">
			<motion.header
				key="header-main"
				initial={{ y: -64, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-20">
						<Link href="/" className="flex items-center">
							<MahiraLogo size={36} priority />
						</Link>

						{/* Desktop Nav */}
						<nav className="hidden lg:flex items-center gap-5">
							<UniversalSearch variant="header" className="mr-1" />

							{/* Mega Menu Trigger */}
							<div ref={megaRef} className="relative">
								<button
									type="button"
									onClick={() => setMegaOpen(!megaOpen)}
									className={`flex items-center gap-1.5 text-sm font-bold transition-colors duration-200 ${
										megaOpen
											? "text-brand-primary"
											: "text-slate-500 hover:text-brand-primary"
									}`}
								>
									Jelajahi
									<motion.span
										animate={{ rotate: megaOpen ? 180 : 0 }}
										transition={{ duration: 0.2 }}
										className="inline-flex"
									>
										<HiOutlineChevronDown size={14} />
									</motion.span>
								</button>

								{/* Mega Menu Dropdown */}
								<AnimatePresence>
									{megaOpen && (
										<motion.div
											initial={{ opacity: 0, y: 8, scale: 0.98 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 8, scale: 0.98 }}
											transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
											className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] p-3 bg-white rounded-[1.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-slate-100"
										>
											{/* Arrow */}
											<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-100 rotate-45" />

											<div className="grid grid-cols-2 gap-2">
												{megaMenuItems.map((item, i) => {
													const Icon = item.icon;
													return (
														<Link
															key={item.href}
															href={item.href}
															onClick={() => setMegaOpen(false)}
															className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200"
														>
															<div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-200 shrink-0">
																<Icon size={20} />
															</div>
															<div>
																<p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors duration-200">
																	{item.label}
																</p>
																<p className="text-[11px] text-slate-400 leading-snug mt-0.5">
																	{item.description}
																</p>
															</div>
														</Link>
													);
												})}
											</div>

											{/* CTA Footer */}
											<div className="mt-2 pt-2 border-t border-slate-50">
												<Link
													href="/layanan"
													onClick={() => setMegaOpen(false)}
													className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-brand-primary/5 transition-colors duration-200 group"
												>
													<span className="text-xs font-bold text-slate-500 group-hover:text-brand-primary transition-colors">
														Lihat Semua Layanan
													</span>
													<span className="text-brand-primary group-hover:translate-x-1 transition-transform duration-200">
														<HiOutlineChevronRight size={14} />
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
									<div className="h-4 w-12 bg-slate-200 rounded" />
								</div>
							) : user ? (
								<motion.div
									key="header-user-profile"
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
								>
									<Link
										href={dashboardHref}
										className="group flex items-center gap-3 pl-2 pr-6 py-1.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors duration-200"
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
			</motion.header>

			{/* Mobile Sidebar */}
			<AnimatePresence key="mobile-menu-presence">
				{isOpen && (
					<motion.div
						key="mobile-menu-backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsOpen(false)}
						className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"
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
													<p className="text-[11px] text-slate-400 truncate">
														{item.description}
													</p>
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
											<div className="w-10 h-10 rounded-full bg-brand-accent text-slate-900 flex items-center justify-center font-bold">
												{getInitials(profile?.full_name as string)}
											</div>
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
