import {
	AlertTriangle,
	ArrowRight,
	Bell,
	CalendarDays,
	Clock,
	MapPin,
	Package,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderTrendChart } from "@/components/shared/superadmin/admin-charts";
import { StatCard } from "@/components/shared/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatCompact, formatDate, formatIDR, cn } from "@/lib/utils";
import type { Order, InventoryItem } from "@/lib/types";

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
		<div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl shadow-slate-900/20 group">
				{/* Vector Pattern */}
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full -ml-20 -mb-20 blur-3xl" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
								Sistem Aktif
							</Badge>
							<span className="text-slate-500 font-bold text-sm">/</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
								{PRIMARY_OUTLET.name}
							</span>
						</div>
						<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-white">
							Dashboard <span className="text-indigo-400 italic">Manager</span>
						</h1>
						<div className="flex flex-wrap items-center gap-6 pt-2">
							<div className="flex items-center gap-2 text-slate-400">
								<MapPin size={16} />
								<span className="text-sm font-bold uppercase tracking-wider">
									{PRIMARY_OUTLET.address}
								</span>
							</div>
							<div className="flex items-center gap-2 text-slate-400">
								<CalendarDays size={16} />
								<span className="text-sm font-bold uppercase tracking-wider">
									{formatDate(new Date())}
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
							Laporan Detail
						</Button>
						<Button
							variant="outline"
							className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl w-12 h-12 p-0 flex items-center justify-center transition-all relative"
						>
							<Bell size={20} />
							<span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900" />
						</Button>
					</div>
				</div>
			</div>

			{/* Premium Bento Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Order Aktif"
					value={stats.activeOrders}
					subtitle="Sedang diproses saat ini"
					icon={<Package size={24} />}
					variant="warning"
					trend={{ value: "12%", positive: true, label: "vs kemarin" }}
				/>
				<StatCard
					title="Omset Hari Ini"
					value={formatCompact(stats.todayRevenue)}
					subtitle={formatIDR(stats.todayRevenue)}
					icon={<TrendingUp size={24} />}
					variant="success"
					trend={{ value: "8%", positive: true, label: "vs rata-rata" }}
				/>
				<StatCard
					title="Tim Terdaftar"
					value={stats.activeStaff}
					subtitle="Kasir, Kurir & QC"
					icon={<Users size={24} />}
					variant="primary"
				/>
				<StatCard
					title="Rating Kepuasan"
					value={stats.rating}
					subtitle="Berdasarkan 128 review"
					icon={<Star size={24} className="fill-amber-400 text-amber-400" />}
					variant="default"
				/>
			</div>

			{/* Middle Content: Charts & Shifts */}
			<div className="grid lg:grid-cols-3 gap-8">
				{/* Chart Card */}
				<div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-10 shadow-xl shadow-slate-200/40 relative group overflow-hidden">
					<div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
						<TrendingUp size={120} />
					</div>

					<div className="flex items-start justify-between mb-10 relative">
						<div className="space-y-1">
							<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
								Analisis Volume Order
							</h2>
							<p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
								Frekuensi pesanan 14 hari terakhir
							</p>
						</div>
						<div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
							<span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">
								Total: {orderTrend.reduce((s, d) => s + d.count, 0)} Order
							</span>
						</div>
					</div>

					<div className="relative">
						<Suspense
							fallback={
								<div className="h-72 bg-slate-50 rounded-3xl animate-pulse" />
							}
						>
							<div className="h-72">
								<OrderTrendChart data={orderTrend} />
							</div>
						</Suspense>
					</div>
				</div>

				{/* Shift Monitoring Card */}
				<div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-10 shadow-xl shadow-slate-200/40 relative group flex flex-col">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
							Shift Monitoring
						</h2>
						<Clock className="text-slate-200" size={24} />
					</div>

					<div className="space-y-5 flex-1">
						{[
							{
								icon: "☀️",
								label: "Pagi",
								time: "07:00 - 15:00",
								status: "Selesai",
								color: "emerald",
							},
							{
								icon: "🌤️",
								label: "Siang",
								time: "11:00 - 19:00",
								status: "Aktif",
								color: "indigo",
								active: true,
							},
							{
								icon: "🌙",
								label: "Malam",
								time: "15:00 - 21:00",
								status: "Mulai",
								color: "slate",
							},
						].map((shift) => (
							<div
								key={shift.label}
								className={cn(
									"group/item p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between",
									shift.active
										? "bg-indigo-50/50 border-indigo-100 shadow-sm"
										: "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md",
								)}
							>
								<div className="flex items-center gap-4">
									<div
										className={cn(
											"w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm border border-white",
											shift.active ? "bg-indigo-600 text-white" : "bg-white",
										)}
									>
										{shift.icon}
									</div>
									<div>
										<p className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-slate-500 transition-colors">
											{shift.label}
										</p>
										<p className="text-xs font-bold text-slate-700">
											{shift.time}
										</p>
									</div>
								</div>

								<Badge
									className={cn(
										"px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none",
										shift.active
											? "bg-indigo-600 text-white"
											: "bg-slate-200 text-slate-500",
									)}
								>
									{shift.status}
								</Badge>
							</div>
						))}
					</div>

					<Button
						variant="ghost"
						className="mt-8 group w-full justify-between h-auto py-4 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-500"
					>
						Selengkapnya{" "}
						<ArrowRight
							size={14}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</Button>
				</div>
			</div>

			{/* Lower Sections: Lists */}
			<div className="grid lg:grid-cols-2 gap-8">
				{/* Modern List: Recent Orders */}
				<div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
					<div className="p-8 border-b border-slate-50 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
								<Package size={20} />
							</div>
							<h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
								Order Masuk
							</h2>
						</div>
						<Button
							variant="ghost"
							className="h-auto py-2 rounded-xl font-bold text-xs text-indigo-600 hover:bg-indigo-50"
							asChild
						>
							<a href="/kasir/antrian">Semua →</a>
						</Button>
					</div>

					<div className="flex-1">
						{recentOrders.length === 0 ? (
							<div className="py-20 text-center opacity-40">
								<Package size={48} className="mx-auto mb-4 text-slate-200" />
								<p className="text-xs font-black uppercase tracking-widest">
									Belum ada order hari ini
								</p>
							</div>
						) : (
							<div className="p-4 space-y-2">
								{recentOrders.map((order: any) => (
									<div
										key={order.id}
										className="p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 group/row transition-all duration-300 border border-transparent hover:border-slate-100"
									>
										<div className="flex items-center gap-4 min-w-0">
											<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-black text-slate-500 border border-white shadow-sm transition-transform group-hover/row:scale-105">
												{(Array.isArray(order.profiles)
													? order.profiles[0]?.full_name?.charAt(0)
													: order.profiles?.full_name?.charAt(0)) || "?"}
											</div>
											<div className="min-w-0">
												<p className="text-sm font-black text-slate-800 uppercase tracking-wide truncate">
													{(Array.isArray(order.profiles)
														? order.profiles[0]?.full_name
														: order.profiles?.full_name) || "Guest User"}
												</p>
												<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
													<span className="text-indigo-400">
														#{order.order_number}
													</span>
													<span>•</span>
													<span>
														{new Intl.DateTimeFormat("id-ID", {
															hour: "2-digit",
															minute: "2-digit",
														}).format(new Date(order.created_at))}{" "}
														WIB
													</span>
												</p>
											</div>
										</div>
										<div className="flex items-center gap-4 shrink-0">
											<Badge
												className={cn(
													"text-[9px] font-black px-2.5 py-1 rounded-lg border-none shadow-none uppercase tracking-widest",
													ORDER_STATUS_COLORS[order.status] ||
														"bg-slate-100 text-slate-500",
												)}
											>
												{ORDER_STATUS_LABELS[order.status] || order.status}
											</Badge>
											<span className="text-sm font-black text-slate-900">
												{order.final_total ? formatIDR(order.final_total) : "—"}
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Modern List: Stock Alerts */}
				<div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
					<div className="p-8 border-b border-slate-50 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
								<AlertTriangle size={20} />
							</div>
							<h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
								Inventori Kritis
							</h2>
						</div>
						<Button
							variant="ghost"
							className="h-auto py-2 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50"
							asChild
						>
							<a href="/manager/inventori">Kelola →</a>
						</Button>
					</div>

					<div className="flex-1">
						{lowStock.length === 0 ? (
							<div className="py-20 text-center">
								<div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
									<Badge className="bg-emerald-500 text-white rounded-full p-1 border-4 border-emerald-50">
										✓
									</Badge>
								</div>
								<p className="text-xs font-black uppercase tracking-widest text-emerald-600">
									Semua Stok Terpenuhi
								</p>
							</div>
						) : (
							<div className="p-4 space-y-2">
								{lowStock.map((item) => (
									<div
										key={item.id}
										className="p-5 rounded-2xl flex items-center justify-between bg-rose-50/30 hover:bg-rose-50/60 transition-all border border-rose-100/50"
									>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
												<AlertTriangle size={20} />
											</div>
											<div>
												<p className="text-sm font-black text-slate-900 uppercase tracking-wide">
													{item.name}
												</p>
												<p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
													Stok: {item.quantity} {item.unit} · Limit:{" "}
													{item.min_stock}
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden mb-1">
												<div
													className="h-full bg-rose-500"
													style={{
														width: `${Math.min(100, (item.quantity / item.min_stock) * 100)}%`,
													}}
												/>
											</div>
											<span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
												Re-order Segera
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
