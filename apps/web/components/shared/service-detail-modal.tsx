"use client";

import { motion, AnimatePresence } from "motion/react";
import { HiOutlineXMark, HiOutlineClock, HiOutlineSparkles, HiOutlineTag, HiOutlineBolt, HiCheckBadge } from "react-icons/hi2";
import { formatIDR } from "@/lib/utils";
import { PRIMARY_OUTLET } from "@/lib/constants";
import Link from "next/link";
import { Service } from "@/lib/types";

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceDetailModal({ service, isOpen, onClose }: ServiceDetailModalProps) {
  if (!service) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 30, 
        stiffness: 400,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          {/* Backdrop with elegant blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
          />

          {/* Modal Container: Sleek Executive Style */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg md:max-w-3xl bg-white rounded-t-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-auto z-10"
          >
            {/* Left Side (Desktop) / Top Side (Mobile): Compact Header Strip */}
            <div className="relative w-full md:w-[28%] bg-gradient-to-br from-slate-900 via-brand-primary to-slate-900 p-6 md:p-8 flex flex-col items-center justify-center text-center shrink-0">
              <div className="relative z-10 w-full flex flex-col items-center gap-5">
                {/* 1. Icon - Compact Circle */}
                <motion.div 
                  variants={itemVariants}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-4xl sm:text-5xl shadow-lg relative"
                >
                  {service.icon || "🧺"}
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-brand-primary text-sm"><HiCheckBadge /></span>
                  </div>
                </motion.div>

                {/* 2. Price Display - Elegant & Small */}
                <motion.div variants={itemVariants} className="text-white">
                  <span className="block text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1">Investment</span>
                  <div className="flex flex-col items-center">
                    <h3 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-heading)] leading-none">
                        {formatIDR(Number(service.price))}
                    </h3>
                    <p className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.2em] mt-2 opacity-80">Per {service.unit}</p>
                  </div>
                </motion.div>
              </div>

              {/* Close Button Inside Header (Mobile Only) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex md:hidden items-center justify-center text-white active:scale-90 transition-all"
              >
                <HiOutlineXMark size={18} />
              </button>
            </div>

            {/* Right Side (Desktop) / Bottom Side (Mobile): Efficient Content Area */}
            <div className="relative w-full md:w-[72%] bg-white flex flex-col h-full overflow-hidden">
                {/* Close Button (Desktop Only) - Subtle */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full bg-slate-50 hidden md:flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                >
                    <HiOutlineXMark size={20} />
                </button>

                <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 custom-scrollbar">
                    <div className="space-y-8">
                        <motion.div variants={itemVariants} className="text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-[family-name:var(--font-heading)] leading-tight">
                                {service.name}
                            </h2>
                            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-brand-primary"><HiOutlineClock /></span>
                                    <span>{service.estimated_duration_hours} JAM ESTIMASI</span>
                                </div>
                                {service.is_express && (
                                    <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md">
                                        <span className="text-amber-500"><HiOutlineBolt /></span>
                                        <span>Express OK</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-3">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                <HiOutlineTag />
                                <span>Overview</span>
                            </div>
                            <p className="text-slate-600 text-center md:text-left leading-relaxed text-sm font-medium">
                            "{service.description || "Layanan profesional Mahira Laundry memastikan pakaian Anda bersih, wangi, dan awet dengan standar kualitas tinggi."}"
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                            <ul className="grid grid-cols-2 gap-4">
                                {(service.features && service.features.length > 0 ? service.features : [
                                    "Detergen Premium",
                                    "Setrika Uap",
                                    "Parfum Signature",
                                    "Kemasan Eksklusif",
                                ]).map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600">
                                        <span className="text-brand-primary shrink-0">
                                            <span className="text-brand-primary"><HiCheckBadge /></span>
                                        </span>
                                        {feat}
                                </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Buttons: WhatsApp Domination */}
                <motion.div variants={itemVariants} className="px-6 py-6 sm:px-10 bg-white border-t border-slate-50 flex flex-col sm:flex-row gap-3">
                    <a
                        href={`https://wa.me/${PRIMARY_OUTLET.whatsapp}?text=Halo Mahira Laundry, saya ingin pesan layanan ${service.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-[1.5] py-4 bg-brand-primary text-white text-center text-xs font-black rounded-xl shadow-xl shadow-brand-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-[0.15em]"
                    >
                        <span>Pesan via WhatsApp</span>
                    </a>
                    <Link
                        href="/register"
                        className="flex-1 py-4 bg-slate-50 text-slate-500 text-center text-xs font-black rounded-xl hover:bg-slate-100 transition-all uppercase tracking-[0.15em]"
                    >
                        Daftar Akun
                    </Link>
                </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
