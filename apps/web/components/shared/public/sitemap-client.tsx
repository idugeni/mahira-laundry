"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
	HiOutlineClipboardDocumentList,
	HiOutlineDocumentText,
	HiOutlineHome,
	HiOutlineInformationCircle,
	HiOutlineMagnifyingGlass,
	HiOutlineMapPin,
	HiOutlinePhoto,
	HiOutlineRocketLaunch,
	HiOutlineShieldCheck,
	HiOutlineSquare2Stack,
} from "react-icons/hi2";

const sitemapData = [
	{
		title: "Halaman Utama",
		links: [
			{ name: "Beranda", href: "/", icon: HiOutlineHome },
			{ name: "Lacak Pesanan", href: "/lacak", icon: HiOutlineMagnifyingGlass },
		],
	},
	{
		title: "Layanan & Galeri",
		links: [
			{ name: "Layanan Kami", href: "/layanan", icon: HiOutlineSquare2Stack },
			{ name: "Galeri Foto", href: "/galeri", icon: HiOutlinePhoto },
			{
				name: "Paket Usaha",
				href: "/paket-usaha",
				icon: HiOutlineRocketLaunch,
			},
		],
	},
	{
		title: "Tentang & Lokasi",
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
		<div className="bg-white min-h-screen py-32 relative overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
				<motion.div
					animate={{
						y: [0, -30, 0],
						rotate: [0, 5, 0],
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[10%] -left-[10%] w-[40%] aspect-square bg-brand-primary/5 rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{
						y: [0, 40, 0],
						rotate: [0, -5, 0],
					}}
					transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-[10%] -right-[10%] w-[40%] aspect-square bg-brand-accent/5 rounded-full blur-[120px]"
				/>
			</div>

			<div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
				{/* Header Section */}
				<div className="text-center mb-24">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-brand-primary/10"
					>
						<span>Navigation Center</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="text-5xl lg:text-7xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.9] tracking-tighter"
					>
						Peta <span className="text-brand-gradient">Situs Kami.</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-10 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
					>
						Temukan semua informasi dan layanan Mahira Laundry dengan mudah
						melalui navigasi terstruktur kami.
					</motion.p>
				</div>

				{/* Sitemap Grid */}
				<div className="grid md:grid-cols-2 gap-8">
					{sitemapData.map((category, idx) => (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 + idx * 0.1 }}
							className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] transition-all duration-500"
						>
							<h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
								{category.title}
							</h2>
							<div className="space-y-4">
								{category.links.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 hover:text-brand-primary font-bold transition-all group"
									>
										<div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
											<link.icon size={20} />
										</div>
										<span className="text-lg">{link.name}</span>
									</Link>
								))}
							</div>
						</motion.div>
					))}
				</div>

				{/* Help Note */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className="mt-24 text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-100"
				>
					<p className="text-slate-500 font-medium">
						Tidak menemukan yang Anda cari? Silakan hubungi layanan pelanggan
						kami melalui WhatsApp untuk bantuan langsung.
					</p>
				</motion.div>
			</div>
		</div>
	);
}
