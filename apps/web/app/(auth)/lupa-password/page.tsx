"use client";

import { motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import {
	HiOutlineCheckCircle,
	HiOutlineExclamationCircle,
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
		<div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<Link href="/" className="inline-block">
						<MahiraLogo size={44} />
					</Link>
					<h1 className="mt-8 text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
						Lupa Password
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Masukkan email Anda untuk menerima link reset password
					</p>
				</div>

				{success ? (
					<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
						<div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
							<HiOutlineCheckCircle />
						</div>
						<h3 className="text-emerald-900 font-bold mb-2 text-lg">
							Email Terkirim!
						</h3>
						<p className="text-emerald-700 text-sm leading-relaxed mb-6">
							{success === "true"
								? "Link reset password telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam Anda."
								: success}
						</p>
						<Link
							href="/login"
							className="inline-block w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
						>
							Kembali ke Login
						</Link>
					</div>
				) : (
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
									htmlFor="email"
									className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"
								>
									Alamat Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="contoh: budi@gmail.com"
									className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white transition-all"
								/>
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
										Mengirim...
									</>
								) : (
									"Kirim Link Reset"
								)}
							</motion.button>
						</form>
					</div>
				)}

				{!success && (
					<div className="mt-8 text-center text-sm">
						<span className="text-slate-500">Ingat password?</span>{" "}
						<Link
							href="/login"
							className="text-brand-primary font-bold hover:underline ml-1"
						>
							Masuk Sekarang
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
