"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
	HiOutlineArrowRight,
	HiOutlineChatBubbleLeftRight,
	HiOutlineClipboardDocumentList,
	HiOutlineDocumentText,
	HiOutlineHome,
	HiOutlineInformationCircle,
	HiOutlineMagnifyingGlass,
	HiOutlineMapPin,
	HiOutlinePhoto,
	HiOutlineRocketLaunch,
	HiOutlineShieldCheck,
	HiOutlineSparkles,
	HiOutlineSquare2Stack,
} from "react-icons/hi2";

const sitemapData = [
	{
		title: "Halaman Utama",
		description: "Akses utama dan pelacakan pesanan",
		accent: "from-blue-500 to-cyan-400",
		iconBg: "bg-blue-50",
		iconColor: "text-blue-600",
		borderHover: "hover:border-blue-200",
		links: [
			{ name: "Beranda", href: "/", icon: HiOutlineHome },
			{ name: "Lacak Pesanan", href: "/lacak", icon: HiOutlineMagnifyingGlass },
		],
	},
	{
		title: "Layanan & Galeri",
		description: "Layanan premium dan portofolio kami",
		accent: "from-emerald-500 to-teal-400",
		iconBg: "bg-emerald-50",
		iconColor: "text-emerald-600",
		borderHover: "hover:border-emerald-200",
		links: [
			{ name: "Layanan Kami", href: "/layanan", icon: HiOutlineSquare2Stack },
			{ name: "Galeri Foto", href: "/galeri", icon: HiOutlinePhoto },
			{
				name: "Paket Usaha",
				href: "/paket-usaha",
				icon: HiOutlineRocketLaunch,
				badge: "Populer",
			},
		],
	},
	{
		title: "Tentang & Lokasi",
		description: "Kenali kami dan temukan outlet",
		accent: "from-purple-500 to-pink-400",
		iconBg: "bg-purple-50",
		iconColor: "text-purple-600",
		borderHover: "hover:border-purple-200",
		links: [
			{
				name: "Tentang Kami",
				href: "/tentang",
				icon: HiOutlineInformationCircle,
			},
			{ name: "Lokasi Outlet", href: "/lokasi", icon: HiOutlineMapPin },
		],
	},
	{
		title: "Legal & Privasi",
		description: "Kebijakan dan perlindungan data",
		accent: "from-orange-500 to-amber-400",
		iconBg: "bg-orange-50",
		iconColor: "text-orange-600",
		borderHover: "hover:border-orange-200",
		links: [
			{
				name: "Kebijakan Privasi",
				href: "/privacy",
				icon: HiOutlineShieldCheck,
			},
			{
				name: "Syarat & Ketentuan",
				href: "/terms",
				icon: HiOutlineDocumentText,
			},
			{
				name: "Kebijakan Cookie",
				href: "/cookies",
				icon: HiOutlineClipboardDocumentList,
			},
		],
	},
];

export function SitemapClient() {
	return (
		<div className="bg-white min-h-screen py-20 relative overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<motion.div
					animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[10%] -left-[10%] w-[40%] aspect-square bg-brand-primary/5 rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{ y: [0, 40, 0], rotate: [0, -5, 0] }}
					transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-[10%] -right-[10%] w-[40%] aspect-square bg-brand-accent/5 rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{ x: [0, 20, 0] }}
					transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[50%] left-[30%] w-[30%] aspect-square bg-purple-200/10 rounded-full blur-[100px]"
				/>
			</div>

			<div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
				{/* Header Section */}
				<div className="text-center mb-20">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-primary/10"
					>
						<HiOutlineSparkles size={14} />
						<span>Navigation Center</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="text-5xl md:text-7xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.85] tracking-tighter"
					>
						Peta <span className="text-brand-gradient">Situs Kami.</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-8 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed font-medium"
					>
						Temukan semua informasi dan layanan Mahira Laundry dengan mudah melalui navigasi
						terstruktur kami.
					</motion.p>
				</div>

				{/* Sitemap Grid */}
				<div className="grid md:grid-cols-2 gap-6">
					{sitemapData.map((category, idx) => (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 + idx * 0.1 }}
							className={`group relative p-8 sm:p-10 bg-white rounded-[2rem] border border-slate-100/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden ${category.borderHover}`}
						>
							{/* Category accent glow */}
							<div
								className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${category.accent} rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
							/>

							{/* Category header */}
							<div className="flex items-start justify-between mb-8 relative z-10">
								<div>
									<h2 className="text-xl font-black text-slate-900 tracking-tight">
										{category.title}
									</h2>
									<p className="text-[11px] text-slate-400 font-medium mt-1">
										{category.description}
									</p>
								</div>
								<div
									className={`w-10 h-10 rounded-xl ${category.iconBg} ${category.iconColor} flex items-center justify-center shrink-0`}
								>
									<HiOutlineArrowRight size={18} />
								</div>
							</div>

							{/* Links */}
							<div className="space-y-2 relative z-10">
								{category.links.map((link) => {
									const Icon = link.icon;
									return (
										<Link
											key={link.href}
											href={link.href}
											className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50/80 text-slate-500 hover:text-slate-900 font-bold transition-all duration-300 group/link"
										>
											<div
												className={`w-10 h-10 rounded-xl ${category.iconBg} ${category.iconColor} flex items-center justify-center group-hover/link:bg-brand-primary group-hover/link:text-white transition-all duration-300 shrink-0`}
											>
												<Icon size={18} />
											</div>
											<span className="text-sm flex-1">{link.name}</span>
											{link.badge && (
												<span className="text-[8px] font-black uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full">
													{link.badge}
												</span>
											)}
											<HiOutlineArrowRight size={14} />
										</Link>
									);
								})}
							</div>
						</motion.div>
					))}
				</div>

				{/* Help CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="mt-16"
				>
					<a
						href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890"}?text=${encodeURIComponent("Halo Mahira, saya butuh bantuan navigasi di website.")}`}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center justify-between p-8 sm:p-10 bg-gradient-to-r from-brand-primary to-brand-primary/90 rounded-[2rem] text-white shadow-2xl shadow-brand-primary/20 hover:shadow-brand-primary/30 transition-all duration-500"
					>
						<div className="flex items-center gap-5">
							<div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
								<HiOutlineChatBubbleLeftRight size={24} />
							</div>
							<div>
								<p className="text-lg font-black">Tidak menemukan yang Anda cari?</p>
								<p className="text-sm text-white/60 font-medium mt-1">
									Hubungi kami via WhatsApp untuk bantuan langsung
								</p>
							</div>
						</div>
						<div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300 shrink-0">
							<HiOutlineArrowRight size={20} />
						</div>
					</a>
				</motion.div>
			</div>
		</div>
	);
}
