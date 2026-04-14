import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderTrendChart } from "@/components/shared/admin-charts";
import { StatCard } from "@/components/shared/stat-card";
import {
	ORDER_STATUS_COLORS,
	ORDER_STATUS_LABELS,
	PRIMARY_OUTLET,
} from "@/lib/constants";
import {
	getLowStockItems,
	getManagerDashboardStats,
	getOrdersByDay,
	getRecentOrders,
} from "@/lib/supabase/server";
import { formatCompact, formatDate, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Dashboard Manager",
	description: "Ikhtisar operasional harian cabang Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function ManagerDashboardPage() {
	const [stats, orderTrend, recentOrders, lowStock] = await Promise.all([
		getManagerDashboardStats(),
		getOrdersByDay(14),
		getRecentOrders(6),
		getLowStockItems(5),
	]);

	return (
		<div className="space-y-8 animate-fade-in-up">
			{/* Header */}
			<div>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div>
						<h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
							Dashboard Manager
						</h1>
						<p className="text-slate-500 mt-1 text-sm">
							Ikhtisar operasional harian{" "}
							<span className="font-semibold text-indigo-600">
								{PRIMARY_OUTLET.name}
							</span>
						</p>
					</div>
					<div className="flex items-center gap-2 text-xs text-slate-400 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
						<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
						{formatDate(new Date())}
					</div>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Order Aktif"
					value={stats.activeOrders}
					subtitle="Sedang diproses"
					icon="📦"
					variant="warning"
				/>
				<StatCard
					title="Omset Hari Ini"
					value={formatCompact(stats.todayRevenue)}
					subtitle={formatIDR(stats.todayRevenue)}
					icon="💰"
					variant="success"
				/>
				<StatCard
					title="Staf Terdaftar"
					value={stats.activeStaff}
					subtitle="Kasir & Kurir"
					icon="👥"
					variant="default"
				/>
				<StatCard
					title="Rating Cabang"
					value={`⭐ ${stats.rating}`}
					subtitle="Rata-rata review"
					icon="🏆"
					variant="primary"
				/>
			</div>

			{/* Charts & Quick Info */}
			<div className="grid lg:grid-cols-3 gap-6">
				{/* Order Trend Chart */}
				<div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
					<div className="flex items-center justify-between mb-5">
						<div>
							<h2 className="text-base font-bold text-slate-900">
								Tren Order 14 Hari
							</h2>
							<p className="text-xs text-slate-400 mt-0.5">
								Volume harian semua status
							</p>
						</div>
						<span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-lg font-semibold">
							Total: {orderTrend.reduce((s, d) => s + d.count, 0)} order
						</span>
					</div>
					<Suspense
						fallback={
							<div className="h-52 bg-slate-50 rounded-xl animate-pulse" />
						}
					>
						<div className="h-52">
							<OrderTrendChart data={orderTrend} />
						</div>
					</Suspense>
				</div>

				{/* Today's Quick Stats */}
				<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
					<h2 className="text-base font-bold text-slate-900 mb-4">
						Operasional Hari Ini
					</h2>
					<div className="space-y-4">
						{[
							{
								icon: "☀️",
								label: "Pagi (07-15)",
								value: "08:00",
								sub: "Shift aktif",
							},
							{
								icon: "🌤️",
								label: "Siang (11-19)",
								value: "08:00",
								sub: "Shift aktif",
							},
							{
								icon: "🌙",
								label: "Malam (15-21)",
								value: "08:00",
								sub: "Shift aktif",
							},
						].map((shift) => (
							<div
								key={shift.label}
								className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
							>
								<div className="flex items-center gap-3">
									<span className="text-lg">{shift.icon}</span>
									<div>
										<p className="text-xs font-semibold text-slate-700">
											{shift.label}
										</p>
										<p className="text-xs text-slate-400">{shift.sub}</p>
									</div>
								</div>
								<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
									● Aktif
								</span>
							</div>
						))}

						{/* Outlet Contact */}
						<div className="pt-2 border-t border-slate-100">
							<p className="text-xs text-slate-400 mb-2">Kontak Outlet</p>
							<div className="flex items-center gap-2 text-xs text-slate-600">
								<span>📞</span>
								<span className="font-semibold">{PRIMARY_OUTLET.phone}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Row */}
			<div className="grid lg:grid-cols-2 gap-6">
				{/* Recent Orders */}
				<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
					<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
						<h2 className="text-base font-bold text-slate-900">
							Order Terbaru
						</h2>
						<a
							href="/kasir"
							className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
						>
							Kasir →
						</a>
					</div>
					{recentOrders.length === 0 ? (
						<div className="py-12 text-center text-slate-400">
							<p className="text-3xl mb-2">📋</p>
							<p className="text-sm">Belum ada order hari ini</p>
						</div>
					) : (
						<div className="divide-y divide-slate-100">
							{recentOrders.map(
								(order: {
									id: string;
									order_number: string;
									profiles?:
										| { full_name?: string | null }
										| { full_name?: string | null }[];
									status: string;
									final_total?: number;
									total_amount?: number;
									created_at: string;
								}) => (
									<div
										key={order.id}
										className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 shrink-0">
												{(Array.isArray(order.profiles)
													? order.profiles[0]?.full_name?.charAt(0)
													: order.profiles?.full_name?.charAt(0)) || "?"}
											</div>
											<div className="min-w-0">
												<p className="text-xs font-semibold text-slate-800 truncate">
													{(Array.isArray(order.profiles)
														? order.profiles[0]?.full_name
														: order.profiles?.full_name) || "—"}
												</p>
												<p className="text-[10px] text-slate-400 font-mono">
													{order.order_number}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 shrink-0">
											<span
												className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}
											>
												{ORDER_STATUS_LABELS[order.status] || order.status}
											</span>
											<span className="text-xs font-bold text-slate-900">
												{order.final_total ? formatIDR(order.final_total) : "—"}
											</span>
										</div>
									</div>
								),
							)}
						</div>
					)}
				</div>

				{/* Low Stock Alert */}
				<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
					<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
						<div>
							<h2 className="text-base font-bold text-slate-900">
								Stok Kritis
							</h2>
							<p className="text-xs text-slate-400 mt-0.5">
								Di bawah minimum stok
							</p>
						</div>
						<a
							href="/inventori"
							className="text-xs font-semibold text-amber-600 hover:text-amber-700"
						>
							Inventori →
						</a>
					</div>
					{lowStock.length === 0 ? (
						<div className="py-12 text-center text-slate-400">
							<p className="text-3xl mb-2">✅</p>
							<p className="text-sm font-medium text-emerald-600">Stok aman</p>
							<p className="text-xs text-slate-400 mt-1">
								Tidak ada stok di bawah minimum
							</p>
						</div>
					) : (
						<div className="divide-y divide-slate-100">
							{lowStock.map(
								(item: {
									id: string;
									name: string;
									current_stock: number;
									min_stock: number;
									unit?: string;
									category?: string;
									sku?: string;
									quantity?: number;
								}) => (
									<div
										key={item.id}
										className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 text-sm">
												⚠️
											</div>
											<div>
												<p className="text-xs font-semibold text-slate-800">
													{item.name}
												</p>
												<p className="text-[10px] text-slate-400">
													{item.category || "—"} · {item.sku || "—"}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm font-black text-red-600">
												{item.quantity} {item.unit}
											</p>
											<p className="text-[10px] text-slate-400">
												Min: {item.min_stock} {item.unit}
											</p>
										</div>
									</div>
								),
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
