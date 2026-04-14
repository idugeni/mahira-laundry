import type { Metadata } from "next";
import { getOutletsWithStats } from "@/lib/supabase/server";
import { formatCompact, formatIDR } from "@/lib/utils";
import { OutletModal } from "@/components/shared/outlet-modal";

export const metadata: Metadata = {
  title: "Kelola Outlet",
  description: "Manajemen dan monitoring seluruh outlet Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function OutletPage() {
  const outlets = await getOutletsWithStats();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Outlet Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {outlets.length} cabang terdaftar. Kelola dan pantau performa setiap
            outlet.
          </p>
        </div>
        <OutletModal />
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cabang",
            value: outlets.length,
            icon: "🏪",
            color: "text-slate-900",
            bg: "bg-slate-50",
          },
          {
            label: "Cabang Aktif",
            value: outlets.filter((o) => o.is_active).length,
            icon: "✅",
            color: "text-emerald-700",
            bg: "bg-emerald-50",
          },
          {
            label: "Franchise",
            value: outlets.filter((o) => o.is_franchise).length,
            icon: "🤝",
            color: "text-indigo-700",
            bg: "bg-indigo-50",
          },
          {
            label: "Total Order Bln Ini",
            value: outlets.reduce((s, o) => s + (Number(o.ordersThisMonth) || 0), 0),
            icon: "📦",
            color: "text-pink-700",
            bg: "bg-pink-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-4 border border-slate-200/60`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{s.icon}</span>
              <span className="text-xs font-semibold text-slate-500">
                {s.label}
              </span>
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Outlet Cards */}
      {outlets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 py-20 flex flex-col items-center text-center text-slate-400">
          <span className="text-5xl mb-4">🏪</span>
          <p className="font-semibold text-slate-600">Belum ada outlet</p>
          <p className="text-sm mt-1">
            Tambahkan outlet pertama untuk memulai.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 overflow-hidden flex items-center justify-center text-white font-black text-lg shadow-sm border border-slate-200">
                    {outlet.image_url ? (
                      <img src={outlet.image_url} alt={outlet.name} className="w-full h-full object-cover" />
                    ) : (
                      outlet.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {outlet.name}
                    </h3>
                    <p className="text-xs text-slate-400">{outlet.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {outlet.is_franchise && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      🤝 Franchise
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      outlet.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {outlet.is_active ? "● Aktif" : "○ Nonaktif"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4">
                {/* Address */}
                <p className="text-xs text-slate-500 mb-4 flex items-start gap-1.5 min-h-[32px]">
                  <span className="mt-0.5">📍</span>
                  <span>{outlet.address || "—"}</span>
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-lg font-black text-slate-900">
                      {Number(outlet.ordersThisMonth) || 0}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Order Bln Ini
                    </p>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-xl">
                    <p className="text-base font-black text-pink-600">
                      {formatCompact(Number(outlet.monthlyRevenue) || 0)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Revenue</p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-xl">
                    <p className="text-lg font-black text-amber-600">
                      {outlet.is_franchise ? `${outlet.franchise_fee}%` : "—"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {outlet.is_franchise ? "Fee" : "HQ"}
                    </p>
                  </div>
                </div>

                {/* Contact + Operating Hours */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>📞</span>
                    <span>{outlet.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🕐</span>
                    <span className="truncate">
                      {outlet.operating_hours?.weekday || "07:00-21:00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Bulan ini:{" "}
                  <span className="font-semibold text-slate-700">
                    {formatIDR(Number(outlet.monthlyRevenue) || 0)}
                  </span>
                </span>
                
                <OutletModal 
                  outlet={outlet} 
                  trigger={
                    <button className="text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                      Edit →
                    </button>
                  } 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
