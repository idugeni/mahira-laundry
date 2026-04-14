"use client";

import { motion } from "motion/react";
import { HiOutlineSparkles } from "react-icons/hi2";

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
		<div className="bg-white min-h-screen py-32">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="text-center mb-24">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-bold mb-6"
					>
						<span className="w-4 h-4">
							<HiOutlineSparkles />
						</span>
						<span>Policy & Terms</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-4xl lg:text-6xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-tight"
					>
						{title.split(" ")[0]}{" "}
						<span className="inline-block text-brand-gradient">
							{title.split(" ").slice(1).join(" ")}
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
					>
						{subtitle}
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
					>
						Last Updated: <span className="text-slate-900">{lastUpdated}</span>
					</motion.div>
				</div>

				{/* Content Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="relative"
				>
					<div className="absolute -left-4 top-0 w-1 h-full bg-slate-50 rounded-full hidden lg:block" />
					<div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:font-[family-name:var(--font-heading)] prose-p:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-li:text-lg prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 font-medium">
						{children}
					</div>
				</motion.div>

				{/* Footer Note */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="mt-32 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left"
				>
					<div>
						<h4 className="font-bold text-slate-900 text-lg mb-1">
							Butuh bantuan lebih lanjut?
						</h4>
						<p className="text-slate-500 text-sm">
							Tim legal kami siap membantu menjawab pertanyaan Anda.
						</p>
					</div>
					<a
						href="mailto:help@mahiralaundry.id"
						className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95"
					>
						Hubungi Kami
					</a>
				</motion.div>
			</div>
		</div>
	);
}
