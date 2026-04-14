"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { HiOutlineArrowPath, HiOutlineHome } from "react-icons/hi2";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Mahira Laundry] Error:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white/50">
      <div className="text-center max-w-lg mb-20">
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-block"
        >
          <div className="w-24 h-24 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <span className="text-5xl">⚠️</span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 text-xl font-bold font-[family-name:var(--font-heading)]"
        >
          Terjadi Kesalahan
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-2 text-muted-foreground text-sm"
        >
          Maaf, terjadi gangguan saat memuat halaman ini. Tim kami sudah
          diberitahu dan sedang bekerja untuk memperbaikinya.
        </motion.p>

        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-3 text-xs text-muted-foreground font-mono bg-muted px-3 py-1.5 rounded-lg inline-block"
          >
            Kode Error: {error.digest}
          </motion.p>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-full font-semibold text-sm hover:bg-brand-primary/90 transition-all hover:shadow-lg hover:shadow-brand-primary/25"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <HiOutlineArrowPath />
            </span>
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-full font-semibold text-sm hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <HiOutlineHome />
            </span>
            Ke Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
