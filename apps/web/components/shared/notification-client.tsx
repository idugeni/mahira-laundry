"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineTruck,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useNotifications } from "@/hooks/use-notifications";
import { AppNotification } from "@/lib/types";

export function NotificationClient() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "order_status":
        return <HiOutlineTruck />;
      case "promo":
        return <HiOutlineCheckCircle />;
      case "alert":
        return <HiOutlineExclamationCircle />;
      default:
        return <HiOutlineInformationCircle />;
    }
  };

  const getIconStyles = (type: string, is_read: boolean) => {
    if (is_read) return "bg-slate-50 text-slate-400";
    switch (type) {
      case "order_status":
        return "bg-blue-50 text-blue-500";
      case "promo":
        return "bg-emerald-50 text-emerald-500";
      case "alert":
        return "bg-amber-50 text-amber-500";
      default:
        return "bg-white text-brand-primary";
    }
  };

  const handleNotificationClick = (n: AppNotification) => {
    setSelectedNotification(n);
    if (!n.is_read) {
      markAsRead(n.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
            Pusat{" "}
            <span className="inline-block text-brand-gradient">Notifikasi</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Informasi terbaru mengenai cucian dan promo Anda.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 animate-pulse">
            {unreadCount} Belum Dibaca
          </div>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleNotificationClick(n)}
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                n.is_read
                  ? "bg-white border-slate-100"
                  : "bg-brand-primary/5 border-brand-primary/20 shadow-lg shadow-brand-primary/5"
              }`}
            >
              {!n.is_read && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
              )}

              <div className="flex gap-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${getIconStyles(n.type, n.is_read)}`}
                >
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`font-black text-lg ${n.is_read ? "text-slate-600" : "text-slate-900"}`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {format(new Date(n.created_at), "d MMM, HH:mm", {
                        locale: idLocale,
                      })}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${n.is_read ? "text-slate-400" : "text-slate-600 font-medium"}`}
                  >
                    {n.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-slate-200">
              <HiOutlineBell />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest">
              Belum ada notifikasi
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <HiOutlineXMark />
                </button>
              </div>

              <div
                className={`h-32 flex items-center justify-center text-5xl ${getIconStyles(selectedNotification.type, false)}`}
              >
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center">
                  {getIcon(selectedNotification.type)}
                </div>
              </div>

              <div className="p-10 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full inline-block mb-6">
                  {format(
                    new Date(selectedNotification.created_at),
                    "eeee, d MMMM yyyy • HH:mm",
                    { locale: idLocale },
                  )}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mb-4">
                  {selectedNotification.title}
                </h2>
                <div className="w-12 h-1.5 bg-brand-primary/20 rounded-full mx-auto mb-8" />
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {selectedNotification.body}
                </p>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-brand-primary transition-all shadow-xl shadow-slate-200"
                  >
                    Selesai Membaca
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
