"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
	HiOutlineArrowLeft,
	HiOutlineHome,
	HiOutlineSparkles,
} from "react-icons/hi2";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
			{/* Cinematic Background Decor */}
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.1, 0.2, 0.1],
					}}
					transition={{ duration: 8, repeat: Infinity }}
					className="absolute top-[20%] left-[10%] w-96 h-96 bg-brand-primary rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.1, 0.15, 0.1],
					}}
					transition={{ duration: 10, repeat: Infinity, delay: 1 }}
					className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-brand-accent rounded-full blur-[120px]"
				/>
			</div>

			<div className="text-center max-w-2xl relative z-10">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: "spring", stiffness: 100, damping: 20 }}
					className="relative inline-block mb-16"
				>
					<span className="text-[12rem] lg:text-[18rem] font-black font-[family-name:var(--font-heading)] text-slate-100 leading-none select-none tracking-tighter">
						404
					</span>

					<motion.div
						animate={{
							y: [0, -25, 0],
							rotate: [-5, 5, -5],
						}}
						transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<div className="relative group">
							<span className="text-[10rem] drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
								🧺
							</span>
							<motion.div
								animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="absolute -top-4 -right-4 text-brand-primary"
							>
								<HiOutlineSparkles size={48} />
							</motion.div>
						</div>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<h1 className="text-4xl lg:text-6xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tighter leading-tight">
						Ups! Halaman Ini <br />
						<span className="text-brand-gradient">Sedang Dijemur.</span>
					</h1>

					<p className="mt-8 text-slate-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">
						Maaf, sepertinya halaman yang Anda cari terselip di tumpukan cucian
						lain. Mari kembali ke jalur yang benar.
					</p>

					<div className="mt-12 flex flex-wrap justify-center gap-6">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link
								href="/"
								className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
							>
								<span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full">
									<HiOutlineHome size={16} />
								</span>
								Ke Beranda
							</Link>
						</motion.div>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => window.history.back()}
							className="inline-flex items-center gap-4 px-10 py-5 border-2 border-slate-100 bg-white text-slate-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
						>
							<span className="w-5 h-5 flex items-center justify-center bg-slate-50 rounded-full">
								<HiOutlineArrowLeft size={16} />
							</span>
							Kembali
						</motion.button>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className="mt-24 pt-12 border-t border-slate-50"
				>
					<p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
						Mahira Laundry Premium Experience
					</p>
				</motion.div>
			</div>
		</div>
	);
}
