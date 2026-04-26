"use client";

import { motion } from "motion/react";
import {
	HiOutlineEnvelope,
	HiOutlineScale,
	HiOutlineSparkles,
} from "react-icons/hi2";

interface LegalLayoutProps {
	title: string;
	subtitle: string;
	lastUpdated: string;
	children: React.ReactNode;
}

export function LegalLayout({
	title,
	subtitle,
	lastUpdated,
	children,
}: LegalLayoutProps) {
	return (
		<div className="bg-white min-h-screen py-32 relative overflow-hidden">
			{/* Decorative Cinematic Background */}
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

			<div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
				{/* Header Section */}
				<div className="text-center mb-24">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-brand-primary/10"
					>
						<span className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm">
							<HiOutlineScale size={14} />
						</span>
						<span>Trust & Transparency</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="text-5xl lg:text-7xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.9] tracking-tighter"
					>
						{title.split(" ")[0]}{" "}
						<span className="text-brand-gradient">
							{title.split(" ").slice(1).join(" ")}
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="mt-10 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium italic"
					>
						"{subtitle}"
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="mt-12 inline-flex items-center gap-3 px-5 py-2 bg-slate-50 rounded-full"
					>
						<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
							Terakhir Diperbarui
						</span>
						<span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
						<span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
							{lastUpdated}
						</span>
					</motion.div>
				</div>

				{/* Content Section */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 1 }}
					className="relative p-10 lg:p-20 bg-white rounded-[4rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)]"
				>
					<div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:font-[family-name:var(--font-heading)] prose-headings:tracking-tighter prose-p:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:text-lg prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-10 prose-h2:border-b-2 prose-h2:border-slate-50 prose-h2:pb-4 font-medium">
						{children}
					</div>
				</motion.div>

				{/* Footer Note */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mt-32 p-12 lg:p-16 bg-slate-900 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left relative overflow-hidden"
				>
					{/* Accent for CTA */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[80px] -mr-20 -mt-20" />

					<div className="relative z-10">
						<h4 className="font-black text-white text-3xl mb-3 tracking-tight">
							Ada pertanyaan legal?
						</h4>
						<p className="text-white/50 text-lg font-medium">
							Tim kami siap membantu menjelaskan syarat dan ketentuan Mahira.
						</p>
					</div>

					<motion.a
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						href="mailto:help@mahiralaundry.id"
						className="relative z-10 flex items-center gap-4 px-10 py-5 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-primary/20 transition-all group"
					>
						<HiOutlineEnvelope size={20} />
						<span>Hubungi Tim Support</span>
					</motion.a>
				</motion.div>
			</div>
		</div>
	);
}
