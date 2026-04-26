"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import {
	HiOutlineArrowRight,
	HiOutlineCheckCircle,
	HiOutlineEnvelope,
	HiOutlineExclamationCircle,
	HiOutlineHome,
	HiOutlineSparkles,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { resetPassword } from "@/lib/actions/auth";

export default function LupaPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ success?: string; error?: string }>;
}) {
	const params = React.use(searchParams);
	const success = params.success;
	const error = params.error;

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const isFormValid = email.includes("@") && email.length > 5;

	const handleAction = async (data: FormData) => {
		setLoading(true);
		try {
			await resetPassword(data);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen w-full flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
			{/* Decorative Cinematic Background */}
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.05, 0.1, 0.05],
					}}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.05, 0.08, 0.05],
					}}
					transition={{ duration: 12, repeat: Infinity, delay: 1 }}
					className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"
				/>
			</div>

			<div className="w-full max-w-md relative z-10 flex flex-col items-center justify-center h-full">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 w-full overflow-hidden flex flex-col max-h-[90vh] my-auto"
				>
					{/* Card Header (Optimized - No Logo) */}
					<div className="p-8 pb-4 shrink-0 text-center">
						<div className="mb-2">
							<div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[8px] font-black uppercase tracking-widest mb-4 border border-brand-primary/10">
								<HiOutlineSparkles size={12} />
								<span>Security Protocol</span>
							</div>
							<h1 className="text-2xl lg:text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-none tracking-tighter mb-3">
								Lupa <span className="text-brand-gradient">Password.</span>
							</h1>
							<p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
								Masukkan email Anda untuk memulai proses pemulihan akses akun.
							</p>
						</div>
					</div>

					{/* Card Content (Refined Scrollbar) */}
					<div className="flex-1 overflow-y-auto custom-scrollbar px-8 lg:px-10 py-2 min-h-0">
						<AnimatePresence mode="wait">
							{success ? (
								<motion.div
									key="success-card"
									initial={{ opacity: 0, scale: 0.9, y: 20 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									className="text-center py-4"
								>
									<div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
										<HiOutlineEnvelope />
									</div>
									<h3 className="text-slate-900 font-black mb-2 text-xl tracking-tighter">
										Email Terkirim!
									</h3>
									<p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
										Link reset password telah dikirim ke email Anda. Silakan
										periksa kotak masuk atau folder spam.
									</p>
									<Link
										href="/login"
										className="inline-flex py-3.5 px-8 bg-slate-900 text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl shadow-slate-200 active:scale-95"
									>
										Kembali ke Login
									</Link>
								</motion.div>
							) : (
								<div className="py-4">
									<AnimatePresence>
										{error && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold overflow-hidden"
											>
												<span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-red-400">
													<HiOutlineExclamationCircle size={14} />
												</span>
												<p>{error}</p>
											</motion.div>
										)}
									</AnimatePresence>

									<form action={handleAction} className="space-y-6">
										<div className="relative group">
											<label
												htmlFor="email"
												className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-3 ml-4"
											>
												Alamat Email Terdaftar
											</label>
											<div className="relative">
												<span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
													<HiOutlineEnvelope size={18} />
												</span>
												<input
													id="email"
													name="email"
													type="email"
													required
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													placeholder="Masukkan email Anda"
													className="w-full pl-14 pr-6 py-3.5 rounded-[1.2rem] border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-300"
												/>
											</div>
										</div>

										<motion.button
											whileHover={
												isFormValid && !loading ? { scale: 1.01 } : {}
											}
											whileTap={isFormValid && !loading ? { scale: 0.99 } : {}}
											type="submit"
											disabled={!isFormValid || loading}
											className="w-full py-4 bg-slate-900 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
										>
											{loading ? (
												<span className="flex items-center gap-3">
													<motion.span
														animate={{ rotate: 360 }}
														transition={{
															duration: 1,
															repeat: Infinity,
															ease: "linear",
														}}
														className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full"
													/>
													Memproses...
												</span>
											) : (
												<>
													<span>Kirim Instruksi Reset</span>
													<HiOutlineArrowRight size={16} />
												</>
											)}
										</motion.button>
									</form>
								</div>
							)}
						</AnimatePresence>
					</div>

					{/* Card Footer (Optimized - With Home Link) */}
					<div className="p-8 pt-4 pb-8 shrink-0 text-center flex flex-col gap-4">
						{!success && (
							<p className="text-slate-400 font-medium text-[13px]">
								Sudah ingat password?{" "}
								<Link
									href="/login"
									className="text-brand-primary font-black hover:underline ml-1"
								>
									Masuk
								</Link>
							</p>
						)}
						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-600 transition-colors"
						>
							<HiOutlineHome size={14} />
							<span>Kembali ke Beranda</span>
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
