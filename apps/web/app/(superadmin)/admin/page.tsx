import type { Metadata } from "next";
import { Suspense } from "react";
import { RevenueBarChart } from "@/components/shared/admin-charts";
import { StatCard } from "@/components/shared/stat-card";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants";
import {
	getAuditLogs,
	getRecentOrders,
	getSuperadminDashboardStats,
	getSuperadminRevenueByMonth,
} from "@/lib/supabase/server";
import {
	formatCompact,
	formatDate,
	formatDateTime,
	formatIDR,
} from "@/lib/utils";

export const metadata: Metadata = {
	title: "Dashboard Superadmin",
	description: "Pusat kendali manajemen Mahira Laundry Group",
};

export const dynamic = "force-dynamic";

export default async function SuperadminDashboardPage() {
	const [stats, revenueData, recentOrders, recentLogs] = await Promise.all([
		getSuperadminDashboardStats(),
		getSuperadminRevenueByMonth(6),
		getRecentOrders(8),
		getAuditLogs(5),
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
						Live — Live — {formatDate(new Date())}
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
							<div className="h-64 bg-slate-50 rounded-xl animate-pulse" />
						}
					>
						<div className="h-64 w-full">
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

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Recent Orders Table */}
				<div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
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
							<table className="w-full">
								<thead>
									<tr className="bg-slate-50/50 border-b border-slate-100">
										<th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
											No. Order
										</th>
										<th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
											Total
										</th>
										<th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
											Aksi
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{recentOrders.map((order) => (
										<tr
											key={order.id}
											className="hover:bg-slate-50/50 transition-colors"
										>
											<td className="px-6 py-3.5">
												<p className="font-mono text-[10px] font-bold text-slate-500 uppercase">
													{order.order_number}
												</p>
												<p className="text-xs font-bold text-slate-800">
													{Array.isArray(order.profiles)
														? order.profiles[0]?.full_name || "Guest"
														: (order.profiles as any)?.full_name || "Guest"}
												</p>
											</td>
											<td className="px-6 py-3.5">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ORDER_STATUS_COLORS[order.status]}`}
												>
													{ORDER_STATUS_LABELS[order.status]}
												</span>
											</td>
											<td className="px-6 py-3.5 text-right font-black text-slate-900 text-xs">
												{formatIDR(order.total || 0)}
											</td>
											<td className="px-6 py-3.5 text-right">
												<a
													href="/admin/antrian"
													className="inline-flex items-center px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest"
												>
													Proses
												</a>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* Audit Logs */}
				<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
					<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
						<h2 className="text-base font-bold text-slate-900">Aktivitas</h2>
						<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
					</div>
					<div className="p-4 space-y-4 flex-1">
						{recentLogs.map((log) => (
							<div key={log.id} className="flex gap-3">
								<div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0" />
								<div>
									<p className="text-xs text-slate-700 leading-relaxed">
										<span className="font-bold text-slate-900">
											{Array.isArray(log.profiles)
												? log.profiles[0]?.full_name
												: (log.profiles as any)?.full_name || "System"}
										</span>{" "}
										{log.action.toLowerCase().replace("_", " ")}
										{" pada "}
										<span className="font-semibold text-slate-600">
											{log.table_name}
										</span>
									</p>
									<p className="text-[10px] text-slate-400 font-medium mt-1">
										{formatDateTime(log.created_at)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
