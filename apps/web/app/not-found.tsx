"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineHome } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-light via-white to-brand-accent-light p-6">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative inline-block"
        >
          <span className="text-[10rem] font-bold font-[family-name:var(--font-heading)] text-brand-primary/10 leading-none select-none">
            404
          </span>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-7xl">🧺</span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-2xl font-bold font-[family-name:var(--font-heading)]"
        >
          Halaman Tidak Ditemukan
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-muted-foreground"
        >
          Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak
          tersedia. Seperti cucian yang terselip — pasti ketemu!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full font-semibold text-sm hover:bg-brand-primary/90 transition-all hover:shadow-lg hover:shadow-brand-primary/25"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <HiOutlineHome />
            </span>
            Ke Beranda
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full font-semibold text-sm hover:bg-muted transition-colors"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <HiOutlineArrowLeft />
            </span>
            Kembali
          </button>
        </motion.div>
      </div>
    </div>
  );
}
