import type { Metadata } from "next";
import { Suspense } from "react";
import { RevenueBarChart } from "@/components/shared/admin-charts";
import { StatCard } from "@/components/shared/stat-card";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants";
import {
  getRecentOrders,
  getSuperadminDashboardStats,
  getSuperadminRevenueByMonth,
} from "@/lib/supabase/server";
import { formatCompact, formatDateTime, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard Superadmin",
  description: "Pusat kendali manajemen Mahira Laundry Group",
};

export const dynamic = "force-dynamic";

export default async function SuperadminDashboardPage() {
  const [stats, revenueData, recentOrders] = await Promise.all([
    getSuperadminDashboardStats(),
    getSuperadminRevenueByMonth(6),
    getRecentOrders(8),
  ]);

  const revenueGrowthPositive = parseFloat(stats.revenueGrowth) >= 0;
  const ordersGrowthPositive = parseFloat(stats.ordersGrowth) >= 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Utama
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Platform manajemen pusat Mahira Laundry Group.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live —{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cabang Aktif"
          value={stats.totalOutlets}
          subtitle="Operasional"
          icon="🏪"
          variant="default"
          className="delay-100"
        />
        <StatCard
          title="Order Bulan Ini"
          value={stats.ordersThisMonth}
          subtitle={`${stats.ordersLastMonth} bulan lalu`}
          icon="📦"
          variant="warning"
          trend={{
            value: `${Math.abs(parseFloat(stats.ordersGrowth))}%`,
            positive: ordersGrowthPositive,
            label: "vs bln lalu",
          }}
          className="delay-200"
        />
        <StatCard
          title="Revenue Bulan Ini"
          value={formatCompact(stats.totalRevenue)}
          subtitle={formatIDR(stats.totalRevenue)}
          icon="💰"
          variant="primary"
          trend={{
            value: `${Math.abs(parseFloat(stats.revenueGrowth))}%`,
            positive: revenueGrowthPositive,
            label: "vs bln lalu",
          }}
          className="delay-200"
        />
        <StatCard
          title="Total Pelanggan"
          value={stats.totalCustomers}
          subtitle={`${stats.activeOrders} order aktif`}
          icon="👥"
          variant="success"
          className="delay-300"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Revenue 6 Bulan Terakhir
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pembayaran yang sudah dikonfirmasi
              </p>
            </div>
            <span className="text-xs bg-pink-50 text-pink-600 border border-pink-100 px-2.5 py-1 rounded-lg font-semibold">
              💰 Bulan ini: {formatCompact(stats.totalRevenue)}
            </span>
          </div>
          <Suspense
            fallback={
              <div className="h-56 bg-slate-50 rounded-xl animate-pulse" />
            }
          >
            <div className="h-56">
              <RevenueBarChart data={revenueData} />
            </div>
          </Suspense>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Ringkasan Cepat
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">📦</span>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Order Aktif
                  </p>
                  <p className="text-xs text-slate-400">Sedang diproses</p>
                </div>
              </div>
              <span className="text-lg font-black text-amber-600">
                {stats.activeOrders}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">🏪</span>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Cabang</p>
                  <p className="text-xs text-slate-400">Semua aktif</p>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900">
                {stats.totalOutlets}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">👥</span>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Pelanggan
                  </p>
                  <p className="text-xs text-slate-400">Terdaftar</p>
                </div>
              </div>
              <span className="text-lg font-black text-slate-900">
                {stats.totalCustomers}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Growth Revenue
                  </p>
                  <p className="text-xs text-slate-400">vs bulan lalu</p>
                </div>
              </div>
              <span
                className={`text-lg font-black ${revenueGrowthPositive ? "text-emerald-600" : "text-red-500"}`}
              >
                {revenueGrowthPositive ? "+" : ""}
                {stats.revenueGrowth}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Order Terbaru
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              8 transaksi terakhir dari semua cabang
            </p>
          </div>
          <a
            href="/admin/laporan"
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors"
          >
            Lihat semua →
          </a>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm font-medium">Belum ada order</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    No. Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map(
                  (order: {
                    id: string;
                    order_number: string;
                    profiles?:
                      | { full_name?: string | null }
                      | { full_name?: string | null }[];
                    status: string;
                    payment_status: string;
                    final_total?: number;
                    total_amount?: number;
                    created_at: string;
                    outlet_id?: string;
                  }) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs text-slate-600 font-semibold">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium text-slate-800">
                        {Array.isArray(order.profiles)
                          ? order.profiles[0]?.full_name || "—"
                          : order.profiles?.full_name || "—"}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.payment_status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {order.payment_status === "paid"
                            ? "✓ Lunas"
                            : order.payment_status === "pending"
                              ? "⏳ Pending"
                              : order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-900 text-sm">
                        {order.final_total ? formatIDR(order.final_total) : "—"}
                      </td>
                      <td className="px-6 py-3.5 text-right text-xs text-slate-400">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <a
                          href="/admin/antrian"
                          className="inline-flex items-center px-3 py-1 bg-brand-primary text-white text-[10px] font-bold rounded-lg hover:bg-brand-secondary transition-colors uppercase tracking-widest shadow-sm shadow-brand-primary/20"
                        >
                          Proses
                        </a>
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
