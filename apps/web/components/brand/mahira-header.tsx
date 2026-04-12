"use client";

import { useState } from "react";
import Link from "next/link";
import { MahiraLogo } from "./mahira-logo";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineUser, HiOutlineChevronRight, HiOutlineBars3BottomRight, HiOutlineXMark } from "react-icons/hi2";

const links = [
  { href: "/layanan", label: "Layanan" },
  { href: "/tentang", label: "Tentang" },
  { href: "/lokasi", label: "Lokasi" },
];

export function MahiraHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center">
            <MahiraLogo size={36} />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-500 hover:text-brand-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="group text-sm font-bold px-6 py-2.5 bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-all hover:shadow-lg hover:shadow-brand-primary/25 flex items-center gap-2"
            >
              <span className="w-4 h-4 flex items-center justify-center"><HiOutlineUser /></span>
              <span>Masuk</span>
              <span className="w-3 h-3 flex items-center justify-center group-hover:translate-x-0.5 transition-transform"><HiOutlineChevronRight /></span>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {isOpen ? <span className="text-2xl flex items-center justify-center"><HiOutlineXMark /></span> : <span className="text-2xl flex items-center justify-center"><HiOutlineBars3BottomRight /></span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl p-6 space-y-4"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold text-slate-900 px-4 py-2 hover:bg-slate-50 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between w-full px-5 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20"
            >
              <span>Masuk ke Akun</span>
              <span className="flex items-center justify-center text-xl"><HiOutlineUser /></span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
