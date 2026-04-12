"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineInbox, HiOutlineChevronRight } from "react-icons/hi2";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatIDR } from "@/lib/utils";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  order_items: any[];
}

interface OrderListClientProps {
  orders: Order[];
}

const filters = ["Semua", "Aktif", "Selesai", "Batal"];

const statusColors: any = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  confirmed: "bg-blue-50 text-blue-600 border-blue-100",
  washing: "bg-indigo-50 text-indigo-600 border-indigo-100",
  ironing: "bg-purple-50 text-purple-600 border-purple-100",
  ready: "bg-emerald-50 text-emerald-600 border-emerald-100",
  completed: "bg-slate-50 text-slate-400 border-slate-100",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

export function OrderListClient({ orders }: OrderListClientProps) {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
            Daftar <span className="inline-block text-brand-gradient">Pesanan</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Pantau status cucian Anda secara real-time.
          </p>
        </div>
        <Link
          href="/order/baru"
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group"
        >
          <span className="w-5 h-5 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <HiOutlinePlus />
          </span>
          Buat Order Baru
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
            <span className="w-5 h-5 flex items-center justify-center"><HiOutlineMagnifyingGlass /></span>
          </span>
          <input 
            type="text" 
            placeholder="Cari ID pesanan..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-sm text-slate-900"
          />
        </div>
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                i === 0 ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length > 0 ? (
          <div className="grid gap-6">
              {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[2rem] border border-slate-50 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group"
                  >
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                          <div className="flex gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-slate-100">
                                  <span className="text-xs font-black uppercase tracking-tighter">
                                      {format(new Date(order.created_at), "MMM")}
                                  </span>
                                  <span className="text-xl font-black text-slate-900 leading-none">
                                      {format(new Date(order.created_at), "dd")}
                                  </span>
                              </div>
                              <div>
                                  <div className="flex items-center gap-3">
                                      <span className="font-black text-slate-900 text-lg">{order.order_number}</span>
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status] || "bg-slate-50 text-slate-400"}`}>
                                          {order.status}
                                      </span>
                                  </div>
                                  <p className="text-sm text-slate-400 font-medium mt-1">
                                      {order.order_items.length} Layanan • {formatIDR(order.total)}
                                  </p>
                              </div>
                          </div>
                          
                          <Link 
                            href={`/order/${order.id}`}
                            className="flex items-center justify-between sm:justify-end gap-4 px-6 py-4 bg-slate-50 rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-all overflow-hidden relative"
                          >
                              <span className="text-xs font-black uppercase tracking-widest relative z-10">Detail Pesanan</span>
                              <span className="text-xl relative z-10"><HiOutlineChevronRight /></span>
                          </Link>
                      </div>
                  </motion.div>
              ))}
          </div>
      ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-20 shadow-sm text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-brand-primary/5 rounded-full animate-ping" />
              <span className="text-4xl text-slate-200 relative z-10 flex items-center justify-center">
                <HiOutlineInbox />
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Belum ada pesanan</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">
              Pesanan Anda akan muncul di sini setelah Anda mulai membuat order baru.
            </p>
            <Link
              href="/order/baru"
              className="inline-flex px-10 py-4 bg-brand-primary text-white rounded-full font-black shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Mulai Order Sekarang
            </Link>
          </motion.div>
      )}
    </div>
  );
}
