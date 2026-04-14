import type { Metadata } from "next";
import { Suspense } from "react";
import {
	PaymentPieChart,
	RevenueBarChart,
} from "@/components/shared/admin-charts";
import { ExpenseModal } from "@/components/shared/expense-modal";
import {
	getPaymentMethodStats,
	getRecentOrders,
	getSuperadminDashboardStats,
	getSuperadminRevenueByMonth,
} from "@/lib/supabase/server";
import { formatCompact, formatDateTime, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Laporan Keuangan",
	description:
		"Ringkasan keuangan dan finansial seluruh cabang Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
	const [stats, revenueData, paymentStats, recentPaidOrders] =
		await Promise.all([
			getSuperadminDashboardStats(),
			getSuperadminRevenueByMonth(6),
			getPaymentMethodStats(),
			getRecentOrders(10),
		]);

	const actualExpenses = stats.totalExpenses || 0;
	const netProfit = stats.totalRevenue - actualExpenses;
	const margin =
		stats.totalRevenue > 0
			? ((netProfit / stats.totalRevenue) * 100).toFixed(1)
			: "0";

	const revenueGrowthPositive = parseFloat(stats.revenueGrowth) >= 0;

	return (
		<div className="space-y-8 animate-fade-in-up">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
						Laporan Keuangan
					</h1>
					<p className="text-slate-500 mt-1 text-sm">
						Ringkasan finansial bulan berjalan — semua cabang.
					</p>
				</div>
				<div className="flex gap-3">
					<ExpenseModal outletId="all" />
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid sm:grid-cols-3 gap-4">
				<div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-200/60 rounded-2xl p-6 shadow-sm">
					<p className="text-xs font-semibold text-pink-500 uppercase tracking-widest mb-1">
						Total Pendapatan
					</p>
					<p className="text-3xl font-black text-pink-600">
						{formatCompact(stats.totalRevenue)}
					</p>
					<p className="text-xs text-slate-400 mt-1">
						{formatIDR(stats.totalRevenue)}
					</p>
					<div className="mt-3">
						<span
							className={`text-xs font-bold px-2 py-0.5 rounded-full ${revenueGrowthPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
						>
							{revenueGrowthPositive ? "▲" : "▼"}{" "}
							{Math.abs(parseFloat(stats.revenueGrowth))}% vs bulan lalu
						</span>
					</div>
				</div>
				<div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-200/60 rounded-2xl p-6 shadow-sm">
					<p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
						Total Pengeluaran
					</p>
					<p className="text-3xl font-black text-amber-600">
						{formatCompact(actualExpenses)}
					</p>
					<p className="text-xs text-slate-400 mt-1">
						{formatIDR(actualExpenses)}
					</p>
					<div className="mt-3">
						<span className="text-xs text-slate-400">
							Total biaya operasional tercatat bulan ini
						</span>
					</div>
				</div>
				<div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-200/60 rounded-2xl p-6 shadow-sm">
					<p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">
						Laba Bersih
					</p>
					<p className="text-3xl font-black text-emerald-600">
						{formatCompact(netProfit)}
					</p>
					<p className="text-xs text-slate-400 mt-1">{formatIDR(netProfit)}</p>
					<div className="mt-3">
						<span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
							Margin {margin}%
						</span>
					</div>
				</div>
			</div>

			{/* Charts Row */}
			<div className="grid lg:grid-cols-5 gap-6">
				{/* Revenue Trend */}
				<div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
					<div className="mb-5">
						<h2 className="text-base font-bold text-slate-900">
							Tren Revenue 6 Bulan
						</h2>
						<p className="text-xs text-slate-400 mt-0.5">
							Hanya transaksi yang sudah dibayar
						</p>
					</div>
					<Suspense
						fallback={
							<div className="h-52 bg-slate-50 rounded-xl animate-pulse" />
						}
					>
						<div className="h-52">
							<RevenueBarChart data={revenueData} />
						</div>
					</Suspense>
				</div>

				{/* Payment Methods */}
				<div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
					<div className="mb-5">
						<h2 className="text-base font-bold text-slate-900">
							Metode Pembayaran
						</h2>
						<p className="text-xs text-slate-400 mt-0.5">
							Breakdown berdasarkan nominal
						</p>
					</div>
					{paymentStats.length > 0 ? (
						<Suspense
							fallback={
								<div className="h-52 bg-slate-50 rounded-xl animate-pulse" />
							}
						>
							<div className="h-52">
								<PaymentPieChart data={paymentStats} />
							</div>
						</Suspense>
					) : (
						<div className="h-52 flex flex-col items-center justify-center text-slate-400">
							<span className="text-4xl mb-3">💳</span>
							<p className="text-sm font-medium">Belum ada data pembayaran</p>
						</div>
					)}
				</div>
			</div>

			{/* Transaksi Terbaru */}
			<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
				<div className="px-6 py-4 border-b border-slate-100">
					<h2 className="text-base font-bold text-slate-900">
						Transaksi Terbaru
					</h2>
					<p className="text-xs text-slate-400 mt-0.5">
						10 pembayaran terakhir yang dikonfirmasi
					</p>
				</div>
				{recentPaidOrders.length === 0 ? (
					<div className="py-16 text-center text-slate-400">
						<p className="text-3xl mb-2">💳</p>
						<p className="text-sm">Belum ada transaksi</p>
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
										Status Bayar
									</th>
									<th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
										Total
									</th>
									<th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
										Waktu
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{recentPaidOrders.map((order: any) => (
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
												className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
										<td className="px-6 py-3.5 text-right font-bold text-slate-900">
											{order.total ? formatIDR(order.total) : "—"}
										</td>
										<td className="px-6 py-3.5 text-right text-xs text-slate-400">
											{formatDateTime(order.created_at)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Reconciliation Notice */}
			<div className="border border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-5 flex items-start gap-4">
				<span className="text-2xl">🏦</span>
				<div>
					<p className="text-sm font-semibold text-blue-800">
						Rekonsiliasi Midtrans
					</p>
					<p className="text-xs text-blue-600 mt-1">
						Data rekonsiliasi pembayaran Midtrans akan tersedia setelah
						integrasi payment gateway aktif. Data yang tampil saat ini berasal
						dari pencatatan kasir.
					</p>
				</div>
			</div>
		</div>
	);
}
