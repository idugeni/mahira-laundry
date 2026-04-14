import type { Metadata } from "next";
import { getAuditLogs } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { ReportModal } from "@/components/shared/report-modal";

export const metadata: Metadata = {
  title: "Laporan & Audit",
  description:
    "Log audit trail dan laporan operasional lengkap seluruh cabang Mahira Laundry.",
};

export const dynamic = "force-dynamic";

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-violet-100 text-violet-700",
  logout: "bg-slate-100 text-slate-600",
  status_change: "bg-amber-100 text-amber-700",
};

const ACTION_ICONS: Record<string, string> = {
  create: "✚",
  update: "✎",
  delete: "✕",
  login: "→",
  logout: "←",
  status_change: "⇄",
};

const TABLE_LABELS: Record<string, string> = {
  orders: "Pesanan",
  profiles: "Profil",
  payments: "Pembayaran",
  services: "Layanan",
  vouchers: "Voucher",
  inventory: "Inventori",
  outlets: "Outlet",
  delivery: "Pengiriman",
};

const reportCards = [
  {
    title: "Laporan Harian",
    desc: "Ringkasan order dan pendapatan hari ini",
    icon: "📅",
    badge: "Tersedia",
  },
  {
    title: "Laporan Mingguan",
    desc: "Performa minggu ini vs minggu lalu",
    icon: "📆",
    badge: "Tersedia",
  },
  {
    title: "Laporan Bulanan",
    desc: "Laporan lengkap bulan berjalan",
    icon: "📊",
    badge: "Tersedia",
  },
  {
    title: "Performa Karyawan",
    desc: "Produktivitas dan kehadiran staf",
    icon: "👥",
    badge: "Beta",
  },
  {
    title: "Customer Insights",
    desc: "Analisis perilaku pelanggan",
    icon: "🧠",
    badge: "Segera",
  },
  {
    title: "Financial Summary",
    desc: "P&L dan cashflow ringkas",
    icon: "💹",
    badge: "Tersedia",
  },
];

export default async function LaporanPage() {
  const auditLogs = await getAuditLogs(30);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Laporan & Audit Trail
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Log seluruh aktivitas platform dan laporan operasional Mahira Laundry.
        </p>
      </div>

      {/* Report Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          📋 Jenis Laporan
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((report) => (
            <ReportModal 
              key={report.title} 
              initialType={report.title.toLowerCase().includes("harian") ? "harian" : report.title.toLowerCase().includes("bulanan") ? "bulanan" : "keuangan"}
              trigger={
                <button
                  type="button"
                  className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{report.icon}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.badge === "Tersedia"
                          ? "bg-emerald-100 text-emerald-700"
                          : report.badge === "Beta"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {report.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-pink-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{report.desc}</p>
                </button>
              }
            />
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Audit Trail</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {auditLogs.length} aktivitas terbaru dari seluruh tabel
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-semibold">
              🔍 30 terakhir
            </span>
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-medium">Belum ada log aktivitas</p>
            <p className="text-xs mt-1">
              Log akan muncul setelah ada interaksi di database
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tabel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Record ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(
                  (
                    log: Record<string, unknown> & {
                      id: string;
                      created_at: string;
                      action: string;
                      table_name: string;
                      record_id: string;
                      profiles?: {
                        full_name?: string | null;
                        role?: string | null;
                      };
                    },
                  ) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </td>
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {log.profiles?.full_name || "System"}
                          </p>
                          {log.profiles?.role && (
                            <p className="text-[10px] text-slate-400 capitalize">
                              {log.profiles.role}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"}`}
                        >
                          <span>{ACTION_ICONS[log.action] || "•"}</span>
                          <span className="capitalize">{log.action}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {TABLE_LABELS[log.table_name] || log.table_name}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-slate-400 truncate max-w-[140px]">
                        {log.record_id ? `${log.record_id.slice(0, 8)}…` : "—"}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
