"use client";

import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineUser } from "react-icons/hi2";
import { formatDateTime } from "@/lib/utils";

interface Log {
  id: string;
  status: string;
  created_at: string;
  notes?: string;
  profiles?: {
    full_name: string;
  };
}

export function OrderTimeline({ logs }: { logs: Log[] }) {
  if (!logs || logs.length === 0) return (
    <div className="py-8 text-center text-slate-400 text-xs italic">
      Belum ada riwayat aktivitas untuk pesanan ini.
    </div>
  );

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-200 before:to-slate-100">
      {logs.map((log, index) => (
        <div key={log.id} className="relative flex items-center group">
          <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10 group-first:scale-110 shadow-sm group-first:shadow-indigo-200 transition-transform">
            {index === 0 ? (
              <span className="text-indigo-600 w-5 h-5 flex items-center justify-center">
                <HiOutlineCheckCircle />
              </span>
            ) : (
              <span className="text-slate-400 w-4 h-4 flex items-center justify-center">
                <HiOutlineClock />
              </span>
            )}
          </div>
          
          <div className="ml-12 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex-1 hover:bg-white hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                {log.status.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {formatDateTime(log.created_at)}
              </span>
            </div>
            
            {log.notes && (
              <p className="text-xs text-slate-500 mb-2 leading-relaxed italic">
                "{log.notes}"
              </p>
            )}

            {log.profiles?.full_name && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/50">
                <span className="text-slate-400 w-3 h-3 flex items-center justify-center">
                  <HiOutlineUser />
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Oleh: {log.profiles.full_name}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
