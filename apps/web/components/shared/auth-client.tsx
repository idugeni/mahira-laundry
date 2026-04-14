"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";
import {
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineStar,
  HiOutlineUser,
} from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";

interface AuthClientProps {
  type: "login" | "register";
  action: (formData: FormData) => Promise<void>;
}

import { useSearchParams } from "next/navigation";

export function AuthClient({ type, action }: AuthClientProps) {
  const isLogin = type === "login";
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  if (success === "verify-email") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-5xl">
            <HiOutlineEnvelope />
          </div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 mb-4">
            Cek Email Anda
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan klik
            tautan tersebut untuk mengaktifkan akun Mahira Laundry Anda.
          </p>
          <Link
            href="/login"
            className="inline-flex py-4 px-10 bg-slate-900 text-white rounded-full font-black hover:bg-brand-primary transition-all shadow-xl shadow-slate-200"
          >
            Kembali ke Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <Link href="/">
            <MahiraLogo size={48} />
          </Link>

          <div className="mt-12 mb-10">
            <h1 className="text-4xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
              {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
            </h1>
            <p className="mt-3 text-slate-500 font-medium text-lg">
              {isLogin
                ? "Masuk untuk kelola cucian Anda."
                : "Mulai nikmati layanan laundry premium hari ini."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex gap-3 items-center">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <HiOutlineCheckCircle />
              </span>
              <p>{error}</p>
            </div>
          )}

          <form action={action} className="space-y-5">
            {!isLogin && (
              <>
                <input
                  type="hidden"
                  name="referred_by_code"
                  value={searchParams.get("ref") || ""}
                />
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <span className="w-5 h-5 flex items-center justify-center">
                      <HiOutlineUser />
                    </span>
                  </span>
                  <input
                    name="full_name"
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium"
                  />
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <span className="w-5 h-5 flex items-center justify-center">
                      <HiOutlinePhone />
                    </span>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Nomor WhatsApp"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium"
                  />
                </div>
              </>
            )}

            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                <span className="w-5 h-5 flex items-center justify-center">
                  <HiOutlineEnvelope />
                </span>
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="Alamat Email"
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium"
              />
            </div>

            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                <span className="w-5 h-5 flex items-center justify-center">
                  <HiOutlineLockClosed />
                </span>
              </span>
              <input
                name="password"
                type="password"
                required
                placeholder="Kata Sandi"
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-medium"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-end">
                <Link
                  href="/lupa-password"
                  title="Forgot Password"
                  className="text-sm font-bold text-slate-400 hover:text-brand-primary transition-colors"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
            >
              {isLogin ? "Masuk ke Akun" : "Daftar Sekarang"}
              <span className="w-5 h-5 flex items-center justify-center">
                <HiOutlineArrowRight />
              </span>
            </button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400">
                <span className="bg-white px-4 italic">Atau gunakan</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-4 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all font-bold text-slate-600"
            >
              <span className="text-red-500 text-xl flex items-center justify-center">
                <FaGoogle />
              </span>
              Masuk dengan Google
            </button>
          </div>

          <p className="mt-12 text-center text-slate-500 font-medium">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="text-brand-primary font-black hover:underline"
            >
              {isLogin ? "Daftar Gratis" : "Masuk di sini"}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Overlay */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-brand-gradient opacity-20 mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 p-24 bg-gradient-to-t from-slate-900 via-transparent to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white"
          >
            <div className="w-16 h-1 bg-brand-accent mb-8" />
            <h2 className="text-5xl font-black leading-tight mb-6">
              Standar Baru
              <br />
              Layanan Kebersihan.
            </h2>
            <p className="text-white/60 text-xl max-w-md leading-relaxed">
              Lebih dari sekadar laundry, kami menjaga pakaian Anda dengan
              standar internasional.
            </p>
          </motion.div>
        </div>

        {/* Floating cards for "wow" effect */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-white shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-emerald-400 text-2xl flex items-center justify-center">
                <HiOutlineCheckCircle />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Status
              </p>
              <p className="font-bold">Cucian Selesai!</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute top-60 right-40 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-white shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center">
              <span className="text-brand-accent text-2xl flex items-center justify-center">
                <HiOutlineStar />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Loyalty
              </p>
              <p className="font-bold">+50 Poin Didapat</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
