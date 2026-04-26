"use client";

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import {
	HiOutlineArrowRight,
	HiOutlineCheckCircle,
	HiOutlineEnvelope,
	HiOutlineExclamationCircle,
	HiOutlineHome,
	HiOutlineLockClosed,
	HiOutlinePhone,
	HiOutlineSparkles,
	HiOutlineStar,
	HiOutlineUser,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { createClient } from "@/lib/supabase/client";

interface AuthClientProps {
	type: "login" | "register";
	action: (formData: FormData) => Promise<void>;
}

export function AuthClient({ type, action }: AuthClientProps) {
	const isLogin = type === "login";
	const searchParams = useSearchParams();
	const router = useRouter();
	const supabase = createClient();
	const error = searchParams.get("error");
	const success = searchParams.get("success");

	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		full_name: "",
		phone: "",
	});

	// Motion values for 3D effect on the right side
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const mouseXSpring = useSpring(x);
	const mouseYSpring = useSpring(y);
	const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
	const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

	const handleMouseMove = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const xPct = mouseX / width - 0.5;
		const yPct = mouseY / height - 0.5;
		x.set(xPct);
		y.set(yPct);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	const isFormValid = isLogin
		? formData.email.includes("@") && formData.password.length >= 6
		: formData.email.includes("@") &&
			formData.password.length >= 6 &&
			formData.full_name.length > 2 &&
			formData.phone.length > 8;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleAction = async (data: FormData) => {
		setLoading(true);
		try {
			await action(data);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	if (success === "verify-email") {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
				<div className="absolute inset-0 bg-brand-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					className="max-w-md w-full bg-white p-10 lg:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] text-center border border-slate-100 relative z-10"
				>
					<div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
						<HiOutlineEnvelope />
					</div>
					<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 mb-4 tracking-tighter">
						Cek Email Anda
					</h1>
					<p className="text-slate-500 font-medium leading-relaxed mb-10 text-base">
						Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan klik
						tautan tersebut untuk mengaktifkan akun Mahira Laundry Anda.
					</p>
					<Link
						href="/login"
						className="inline-flex py-4 px-10 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all shadow-2xl shadow-slate-200 active:scale-95"
					>
						Kembali ke Login
					</Link>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="h-screen w-full flex bg-slate-50 overflow-hidden">
			{/* Left Side - Compact Card Layout */}
			<div className="flex-1 flex flex-col h-full relative z-20 overflow-hidden p-4 lg:p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="w-full max-w-md mx-auto bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col overflow-hidden my-auto max-h-[95vh]"
				>
					{/* Card Header (Optimized - No Logo) */}
					<div className="p-8 pb-4 shrink-0 text-center">
						<div className="mb-2">
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[8px] font-black uppercase tracking-widest mb-4 border border-brand-primary/10"
							>
								<HiOutlineSparkles size={10} />
								<span>Exclusive Access</span>
							</motion.div>
							<h1 className="text-3xl lg:text-4xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tighter leading-[0.95] mb-2">
								{isLogin ? "Selamat Datang" : "Bergabunglah"} <br />
								<span className="text-brand-gradient">
									{isLogin ? "Kembali." : "Sekarang."}
								</span>
							</h1>
							<p className="text-slate-500 font-medium text-sm lg:text-base leading-relaxed">
								{isLogin
									? "Masuk untuk melanjutkan standar kebersihan premium."
									: "Mulai pengalaman perawatan pakaian terbaik bersama Mahira."}
							</p>
						</div>
					</div>

					{/* Card Content (Refined Scrollbar) */}
					<div className="flex-1 overflow-y-auto custom-scrollbar px-8 lg:px-10 py-2 min-h-0">
						<AnimatePresence mode="wait">
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold flex gap-3 items-center"
								>
									<span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-red-400">
										<HiOutlineExclamationCircle size={14} />
									</span>
									<p>{error}</p>
								</motion.div>
							)}
						</AnimatePresence>

						<form action={handleAction} className="space-y-3">
							{!isLogin && (
								<>
									<input
										type="hidden"
										name="referred_by_code"
										value={searchParams.get("ref") || ""}
									/>
									<div className="relative group">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
											<HiOutlineUser size={16} />
										</span>
										<input
											name="full_name"
											type="text"
											required
											value={formData.full_name}
											onChange={handleChange}
											placeholder="Nama Lengkap"
											className="w-full pl-12 pr-6 py-3.5 rounded-[1.2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 text-sm"
										/>
									</div>
									<div className="relative group">
										<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
											<HiOutlinePhone size={16} />
										</span>
										<input
											name="phone"
											type="tel"
											required
											value={formData.phone}
											onChange={handleChange}
											placeholder="Nomor WhatsApp"
											className="w-full pl-12 pr-6 py-3.5 rounded-[1.2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 text-sm"
										/>
									</div>
								</>
							)}

							<div className="relative group">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
									<HiOutlineEnvelope size={16} />
								</span>
								<input
									name="email"
									type="email"
									required
									value={formData.email}
									onChange={handleChange}
									placeholder="Alamat Email"
									className="w-full pl-12 pr-6 py-3.5 rounded-[1.2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 text-sm"
								/>
							</div>

							<div className="relative group">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
									<HiOutlineLockClosed size={16} />
								</span>
								<input
									name="password"
									type="password"
									required
									value={formData.password}
									onChange={handleChange}
									placeholder="Kata Sandi (Min. 6 Karakter)"
									className="w-full pl-12 pr-6 py-3.5 rounded-[1.2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 text-sm"
								/>
							</div>

							{isLogin && (
								<div className="flex items-center justify-end px-1">
									<Link
										href="/lupa-password"
										className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-brand-primary transition-colors"
									>
										Lupa Kata Sandi?
									</Link>
								</div>
							)}

							<motion.button
								whileHover={isFormValid && !loading ? { scale: 1.01 } : {}}
								whileTap={isFormValid && !loading ? { scale: 0.99 } : {}}
								type="submit"
								disabled={!isFormValid || loading}
								className="w-full py-4 bg-slate-900 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 mt-2"
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
											aria-hidden="true"
										/>
										Memproses...
									</span>
								) : (
									<>
										<span>{isLogin ? "Masuk Sekarang" : "Daftar Akun"}</span>
										<HiOutlineArrowRight size={16} />
									</>
								)}
							</motion.button>
						</form>

						<div className="mt-6 mb-4">
							<div className="relative mb-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-slate-100" />
								</div>
								<div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em] font-black text-slate-200">
									<span className="bg-white px-4 italic">Secure Access</span>
								</div>
							</div>

							<motion.button
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								type="button"
								onClick={handleGoogleLogin}
								className="w-full py-3.5 border-2 border-slate-100 rounded-[1.2rem] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-black text-[9px] uppercase tracking-widest text-slate-500"
							>
								<span className="text-red-500 text-base">
									<FaGoogle />
								</span>
								Google Account
							</motion.button>
						</div>
					</div>

					{/* Card Footer (Refined - With Home Link) */}
					<div className="p-8 pt-4 pb-8 shrink-0 text-center flex flex-col gap-4">
						<p className="text-slate-400 font-medium text-xs">
							{isLogin ? "Belum memiliki akses?" : "Sudah memiliki akun?"}{" "}
							<Link
								href={isLogin ? "/register" : "/login"}
								className="text-brand-primary font-black hover:underline ml-1"
							>
								{isLogin ? "Daftar Disini" : "Masuk Sekarang"}
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

			{/* Right Side - Interactive Cinematic Overlay */}
			<div
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				className="hidden lg:block lg:flex-1 relative overflow-hidden bg-slate-900 group cursor-default h-full"
			>
				{/* Background Gradients */}
				<div className="absolute inset-0 bg-brand-gradient opacity-30 mix-blend-overlay" />
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute top-0 right-0 w-full h-full bg-brand-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"
				/>

				<div className="absolute inset-0 flex flex-col justify-between p-16 lg:p-20 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-white/20 font-black text-7xl lg:text-8xl leading-none select-none tracking-tighter"
					>
						MAHIRA
					</motion.div>

					<motion.div
						style={{
							rotateX,
							rotateY,
							transformStyle: "preserve-3d",
						}}
						className="text-white"
					>
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: "60px" }}
							className="h-1 bg-brand-accent mb-6 rounded-full"
						/>
						<h2 className="text-5xl lg:text-6xl font-black leading-[0.9] mb-6 tracking-tighter">
							Standar Baru <br />
							<span className="text-brand-accent">Kualitas Hidup.</span>
						</h2>
						<p className="text-white/30 text-lg max-w-sm leading-relaxed font-medium italic">
							"Kami tidak hanya mencuci pakaian, kami merawat memori dan
							kenyamanan Anda."
						</p>
					</motion.div>
				</div>

				{/* Floating Interactive Cards */}
				<motion.div
					style={{ rotateX, rotateY, translateZ: "60px" }}
					animate={{ y: [0, -10, 0] }}
					transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[25%] right-[12%] bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] max-w-xs scale-90"
				>
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shadow-inner text-emerald-400">
							<HiOutlineCheckCircle size={24} />
						</div>
						<div>
							<p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">
								Real-time Status
							</p>
							<p className="font-black text-sm leading-tight">
								Cucian Selesai!
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					style={{ rotateX, rotateY, translateZ: "100px" }}
					animate={{ y: [0, 15, 0] }}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
					className="absolute bottom-[25%] right-[18%] bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] max-w-xs scale-90"
				>
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-brand-accent/20 rounded-xl flex items-center justify-center shadow-inner text-brand-accent">
							<HiOutlineStar size={24} />
						</div>
						<div>
							<p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">
								Loyalty Points
							</p>
							<p className="font-black text-sm leading-tight">
								+100 Poin Mahira
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
