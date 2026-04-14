"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineTruck,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<{
    id: string;
    title: string;
    body: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  } | null>(null);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const getIconStyles = (type: string, isRead: boolean) => {
    if (isRead) return "bg-slate-50 text-slate-400";
    switch (type) {
      case "order_status":
        return "bg-blue-50 text-blue-500";
      case "promo":
        return "bg-emerald-50 text-emerald-500";
      case "alert":
        return "bg-amber-50 text-amber-500";
      default:
        return "bg-brand-primary/10 text-brand-primary";
    }
  };

  const handleNotificationClick = (n: {
    id: string;
    title: string;
    body: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }) => {
    setSelectedNotification(n);
    if (!n.isRead) {
      markAsRead(n.id);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all ${
          isOpen
            ? "bg-brand-primary/10 text-brand-primary"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center text-xl">
          <HiOutlineBell />
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-[380px] sm:w-[420px] bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-900 tracking-tight">
                Notifikasi
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                {unreadCount} Baru
              </span>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-6 hover:bg-slate-50 transition-colors flex gap-4 group relative ${
                        !n.isRead ? "bg-brand-primary/[0.02]" : ""
                      }`}
                    >
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary" />
                      )}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${getIconStyles(n.type, n.isRead)}`}
                      >
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p
                            className={`font-bold truncate ${n.isRead ? "text-slate-600" : "text-slate-900"}`}
                          >
                            {n.title}
                          </p>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0 mt-1">
                            {format(new Date(n.createdAt), "HH:mm", {
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                        <p
                          className={`text-xs line-clamp-2 leading-relaxed ${n.isRead ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {n.body}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 text-3xl">
                    <HiOutlineBell />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Tidak ada notifikasi
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/notifikasi"
              onClick={() => setIsOpen(false)}
              className="block p-4 text-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary hover:bg-slate-50 transition-all border-t border-slate-50"
            >
              Lihat Semua
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Large Detail Modal */}
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
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                  {getIcon(selectedNotification.type)}
                </div>
              </div>

              <div className="p-10 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full inline-block mb-6">
                  {format(
                    new Date(selectedNotification.createdAt),
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

                <div className="mt-12">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-brand-primary transition-all shadow-xl shadow-slate-200"
                  >
                    Tutup Detail
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
