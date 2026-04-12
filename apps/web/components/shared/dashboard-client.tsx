"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { 
  HiOutlineShoppingBag, 
  HiOutlineStar, 
  HiOutlineArchiveBox, 
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineMapPin,
  HiOutlineGift,
  HiOutlinePencilSquare,
  HiOutlineInbox,
  HiOutlineArrowRight
} from "react-icons/hi2";

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  loyaltyPoints: number;
  loyaltyTier: string;
}

interface DashboardClientProps {
  stats: DashboardStats;
}

export function DashboardClient({ stats: realStats }: DashboardClientProps) {
  const statsDisplay = [
    {
      label: "Order Aktif",
      value: realStats.activeOrders.toString(),
      icon: HiOutlineShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      label: "Poin Loyalty",
      value: realStats.loyaltyPoints.toString(),
      icon: HiOutlineStar,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      label: "Total Order",
      value: realStats.totalOrders.toString(),
      icon: HiOutlineArchiveBox,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      label: "Tier",
      value: realStats.loyaltyTier.charAt(0).toUpperCase() + realStats.loyaltyTier.slice(1),
      icon: HiOutlineBanknotes,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
  ];

  const actions = [
    {
      href: "/order/baru",
      label: "Order Baru",
      icon: HiOutlinePlus,
      desc: "Buat pesanan",
      color: "bg-brand-primary text-white"
    },
    {
      href: "/order",
      label: "Lacak Order",
      icon: HiOutlineMapPin,
      desc: "Cek status",
      color: "bg-slate-100 text-slate-600"
    },
    {
      href: "/loyalty",
      label: "Tukar Poin",
      icon: HiOutlineGift,
      desc: "Redeem hadiah",
      color: "bg-slate-100 text-slate-600"
    },
    {
      href: "/profil",
      label: "Profil",
      icon: HiOutlinePencilSquare,
      desc: "Ubah data",
      color: "bg-slate-100 text-slate-600"
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
          Ringkasan <span className="text-brand-gradient">Akun</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Selamat datang kembali! Berikut status terbaru layanan Anda.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsDisplay.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-3xl border ${stat.border} p-5 sm:p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group`}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl sm:text-2xl mb-4 group-hover:scale-110 transition-transform`}
            >
              <span className="flex items-center justify-center"><stat.icon /></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
              {stat.value}
            </div>
            <div className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 text-[180px] text-slate-50 pointer-events-none -mr-20 -mt-20">
            <HiOutlinePlus />
        </div>
        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-8 text-slate-900 relative z-10">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 relative z-10">
          {actions.map((action, i) => (
            <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
            >
                <Link
                href={action.href}
                className="group flex flex-col items-center text-center p-6 sm:p-8 rounded-[2rem] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-brand-primary/20 hover:shadow-xl hover:shadow-slate-100 transition-all"
                >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${action.color} group-hover:shadow-xl shadow-brand-primary/20 group-hover:scale-110`}>
                    <span className="text-2xl sm:text-3xl flex items-center justify-center"><action.icon /></span>
                </div>
                <span className="font-black text-slate-900 text-sm sm:text-base">{action.label}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
                    {action.desc}
                </span>
                </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-sm group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
            Order Terbaru
          </h2>
          <Link
            href="/order"
            className="text-xs font-black uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 flex items-center gap-2 px-4 py-2 bg-brand-primary/5 rounded-full w-fit group-hover:bg-brand-primary group-hover:text-white transition-all"
          >
            Lihat semua
            <span className="flex items-center justify-center ml-1"><HiOutlineArrowRight /></span>
          </Link>
        </div>
        <div className="text-center py-16 sm:py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-8"
          >
            <span className="text-4xl text-slate-100 flex items-center justify-center"><HiOutlineInbox /></span>
          </motion.div>
          <p className="font-black text-slate-400 text-lg sm:text-xl">Belum ada order.</p>
          <p className="text-sm font-medium text-slate-400 mt-2 mb-10 max-w-[240px] mx-auto leading-relaxed">Mulai nikmati layanan laundry premium pertama Anda hari ini!</p>
          <Link
            href="/order/baru"
            className="inline-flex px-10 py-5 bg-slate-900 text-white rounded-full font-black shadow-2xl shadow-slate-200 hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all active:scale-95"
          >
            Buat Order Pertama
          </Link>
        </div>
      </div>
    </div>
  );
}
