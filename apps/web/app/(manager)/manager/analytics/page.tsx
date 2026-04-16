import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderTrendChart } from "@/components/shared/admin/admin-charts";
import {
	getManagerDashboardStats,
	getOrdersByDay,
} from "@/lib/supabase/server";
import { formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Analitik Bisnis",
	description:
		"Dashboard analitik dan statistik bisnis Mahira Laundry. Pantau performa dan tren penjualan.",
};

export const dynamic = "force-dynamic";

export default async function ManagerAnalyticsPage() {
	const [stats, orderTrend] = await Promise.all([
		getManagerDashboardStats(),
		getOrdersByDay(14),
	]);

	const kpiStats = [
		{
			label: "Pendapatan Hari Ini",
			value: formatIDR(stats.todayRevenue),
			icon: "💰",
			change: "Hari ini",
			color: "text-emerald-600",
		},
		{
			label: "Order Aktif",
			value: stats.activeOrders.toString(),
			icon: "📦",
			change: "Diproses",
			color: "text-amber-600",
		},
		{
			label: "Staf Aktif",
			value: stats.activeStaff.toString(),
			icon: "👥",
			change: "Terdaftar",
			color: "text-indigo-600",
		},
		{
			label: "Rating Rata-rata",
			value: stats.rating,
			icon: "⭐",
			change: "Cabang ini",
			color: "text-orange-500",
		},
	];

	return (
		<div className="space-y-6 animate-fade-in-up">
			<h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
				Analytics & KPI
			</h1>

			<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{kpiStats.map((stat) => (
					<div
						key={stat.label}
						className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow"
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-2xl">{stat.icon}</span>
							<span className={`text-xs font-semibold ${stat.color}`}>
								{stat.change}
							</span>
						</div>
						<div className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-heading)]">
							{stat.value}
						</div>
						<div className="text-xs text-muted-foreground mt-1">
							{stat.label}
						</div>
					</div>
				))}
			</div>

			{/* Revenue chart */}
			<div className="bg-white rounded-xl border border-border p-6 shadow-sm">
				<h2 className="text-base font-bold text-slate-900 mb-4">
					Tren Volume Order 14 Hari Terakhir
				</h2>
				<Suspense
					fallback={
						<div className="h-64 bg-slate-50 animate-pulse rounded-xl" />
					}
				>
					<div className="h-64">
						<OrderTrendChart data={orderTrend} />
					</div>
				</Suspense>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Top services Placeholder / Soon */}
				<div className="bg-white rounded-xl border border-border p-6 shadow-sm">
					<h2 className="text-base font-bold text-slate-900 mb-4">
						Layanan Terpopuler (Mock)
					</h2>
					{[
						"Cuci Setrika Reguler",
						"Express Cuci Setrika",
						"Cuci Lipat",
						"Paket Kost",
						"Cuci Bedcover",
					].map((name, i) => (
						<div
							key={name}
							className="flex items-center justify-between py-2 border-b border-border last:border-0"
						>
							<div className="flex items-center gap-3">
								<span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-bold">
									{i + 1}
								</span>
								<span className="text-sm font-medium">{name}</span>
							</div>
							<span className="text-xs text-muted-foreground font-mono">
								{Math.floor(Math.random() * 100 + 20)} order
							</span>
						</div>
					))}
					<p className="text-[10px] text-center text-slate-400 mt-4">
						Data layanan terpopuler akan otomatis sinkron pada rilis Analytics
						v2
					</p>
				</div>

				{/* Heatmap Placeholder */}
				<div className="bg-white rounded-xl border border-border p-6 shadow-sm">
					<div className="flex flex-col h-full bg-slate-50 items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
						<div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl mb-3">
							🔥
						</div>
						<h3 className="font-bold text-slate-700">Heatmap Demand</h3>
						<p className="text-xs text-slate-500 mt-1 max-w-[200px]">
							Fitur peta kesibukan order regional akan tersedia segera.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
