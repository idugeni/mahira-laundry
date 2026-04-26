"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import {
	HiOutlineArrowRight,
	HiOutlineExclamationCircle,
	HiOutlineHome,
	HiOutlineLockClosed,
	HiOutlineSparkles,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { updatePassword } from "@/lib/actions/auth";

export default function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const params = React.use(searchParams);
	const error = params.error;

	const [formData, setFormData] = useState({
		password: "",
		confirm_password: "",
	});
	const [loading, setLoading] = useState(false);

	const isFormValid =
		formData.password.length >= 6 &&
		formData.confirm_password === formData.password;

	const handleAction = async (data: FormData) => {
		setLoading(true);
		try {
			await updatePassword(data);
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
					className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.05, 0.08, 0.05],
					}}
					transition={{ duration: 12, repeat: Infinity, delay: 1 }}
					className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-accent rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"
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
								Password <span className="text-brand-gradient">Baru.</span>
							</h1>
							<p className="text-slate-500 font-medium text-sm px-4">
								Setel kata sandi baru untuk mengamankan kembali akun Anda.
							</p>
						</div>
					</div>

					{/* Card Content (Refined Scrollbar) */}
					<div className="flex-1 overflow-y-auto custom-scrollbar px-8 lg:px-10 py-2 min-h-0">
						<div className="py-4">
							<AnimatePresence mode="wait">
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
								<div className="space-y-4">
									<div className="relative group">
										<label
											htmlFor="password"
											className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2.5 ml-4"
										>
											Sandi Baru
										</label>
										<div className="relative">
											<span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
												<HiOutlineLockClosed size={18} />
											</span>
											<input
												id="password"
												name="password"
												type="password"
												required
												value={formData.password}
												onChange={(e) =>
													setFormData({ ...formData, password: e.target.value })
												}
												placeholder="Minimal 6 karakter"
												className="w-full pl-14 pr-6 py-3.5 rounded-[1.2rem] border border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-300"
											/>
										</div>
									</div>

									<div className="relative group">
										<label
											htmlFor="confirm_password"
											className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-2.5 ml-4"
										>
											Konfirmasi Sandi
										</label>
										<div className="relative">
											<span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
												<HiOutlineLockClosed size={18} />
											</span>
											<input
												id="confirm_password"
												name="confirm_password"
												type="password"
												required
												value={formData.confirm_password}
												onChange={(e) =>
													setFormData({
														...formData,
														confirm_password: e.target.value,
													})
												}
												placeholder="Ulangi sandi baru"
												className={`w-full pl-14 pr-6 py-3.5 rounded-[1.2rem] border bg-slate-50/50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:bg-white transition-all placeholder:font-medium placeholder:text-slate-300 ${
													formData.confirm_password &&
													formData.confirm_password !== formData.password
														? "border-red-300 focus:ring-red-100 focus:border-red-400"
														: "border-slate-100 focus:ring-brand-primary/10 focus:border-brand-primary"
												}`}
											/>
										</div>
										<AnimatePresence>
											{formData.confirm_password &&
												formData.confirm_password !== formData.password && (
													<motion.p
														initial={{ opacity: 0, y: -10 }}
														animate={{ opacity: 1, y: 0 }}
														className="text-[8px] text-red-500 font-black uppercase tracking-widest mt-2 ml-4"
													>
														Sandi tidak cocok.
													</motion.p>
												)}
										</AnimatePresence>
									</div>
								</div>

								<motion.button
									whileHover={isFormValid && !loading ? { scale: 1.01 } : {}}
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
											Menyimpan...
										</span>
									) : (
										<>
											<span>Simpan Sandi Baru</span>
											<HiOutlineArrowRight size={16} />
										</>
									)}
								</motion.button>
							</form>
						</div>
					</div>

					{/* Card Footer (Optimized - With Home Link) */}
					<div className="p-8 pt-4 pb-8 shrink-0 text-center flex flex-col gap-4">
						<p className="text-slate-400 font-medium text-[13px]">
							Butuh bantuan?{" "}
							<Link
								href="/lokasi"
								className="text-brand-primary font-black hover:underline ml-1"
							>
								Hubungi Admin
							</Link>
						</p>
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
