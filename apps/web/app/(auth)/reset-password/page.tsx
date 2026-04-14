"use client";

import { motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import {
	HiOutlineExclamationCircle,
	HiOutlineLockClosed,
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
		<div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<Link href="/" className="inline-block">
						<MahiraLogo size={44} />
					</Link>
					<h1 className="mt-8 text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
						Setel Password Baru
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Pastikan password Anda kuat dan mudah diingat
					</p>
				</div>

				<div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in slide-in-from-top-2 duration-300">
							<span className="text-lg shrink-0 mt-0.5">
								<HiOutlineExclamationCircle />
							</span>
							<p className="font-medium">{error}</p>
						</div>
					)}

					<form action={handleAction} className="space-y-5">
						<div>
							<label
								htmlFor="password"
								className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"
							>
								Password Baru
							</label>
							<div className="relative group">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
									<HiOutlineLockClosed />
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
									placeholder="minimal 6 karakter"
									className="w-full pl-12 pr-6 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all font-medium"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="confirm_password"
								className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"
							>
								Konfirmasi Password Baru
							</label>
							<div className="relative group">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
									<HiOutlineLockClosed />
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
									placeholder="ulangi password"
									className={`w-full pl-12 pr-6 py-3.5 rounded-xl border bg-slate-50/50 text-sm focus:outline-none focus:ring-4 focus:bg-white transition-all font-medium ${
										formData.confirm_password &&
										formData.confirm_password !== formData.password
											? "border-red-300 focus:ring-red-100 focus:border-red-400"
											: "border-slate-100 focus:ring-brand-primary/10 focus:border-brand-primary"
									}`}
								/>
							</div>
							{formData.confirm_password &&
								formData.confirm_password !== formData.password && (
									<p className="text-[10px] text-red-500 font-bold mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
										Password konfirmasi tidak cocok.
									</p>
								)}
						</div>

						<motion.button
							whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
							type="submit"
							disabled={!isFormValid || loading}
							className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-brand-primary/25 active:scale-[0.98] flex items-center justify-center gap-2"
						>
							{loading ? (
								<>
									<span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
									Menyimpan...
								</>
							) : (
								"Simpan Password Baru"
							)}
						</motion.button>
					</form>
				</div>

				<div className="mt-8 text-center text-sm text-slate-400">
					Butuh bantuan?{" "}
					<Link
						href="/lokasi"
						className="text-brand-primary font-bold hover:underline"
					>
						Hubungi Kami
					</Link>
				</div>
			</div>
		</div>
	);
}
