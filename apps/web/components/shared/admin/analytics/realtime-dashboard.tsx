"use client";

import {
	Clock,
	Loader2,
	MousePointer2,
	ShieldCheck,
	TrendingUp,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OrderTrendChart as TrafficChart } from "@/components/shared/admin/admin-charts";
import { StatCard } from "@/components/shared/common/stat-card";

interface RealtimeData {
	activeUsers: number;
	deviceBreakdown: Array<{
		device: string;
		city: string;
		users: number;
	}>;
	timestamp: string;
}

const mockTrafficData = [
	{ day: "Senin", count: 120 },
	{ day: "Selasa", count: 150 },
	{ day: "Rabu", count: 180 },
	{ day: "Kamis", count: 140 },
	{ day: "Jumat", count: 210 },
	{ day: "Sabtu", count: 320 },
	{ day: "Minggu", count: 280 },
];

export function RealtimeDashboard() {
	const [data, setData] = useState<RealtimeData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRealtimeData = useCallback(async () => {
		try {
			const res = await fetch("/api/analytics/realtime");
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to fetch");
			}
			const json = await res.json();
			setData(json);
			setError(null);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch";
			console.error("Fetch error:", err);
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRealtimeData();
		// Polling setiap 30 detik
		const interval = setInterval(fetchRealtimeData, 30000);
		return () => clearInterval(interval);
	}, [fetchRealtimeData]);

	if (error) {
		return (
			<div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-rose-600">
				<p className="font-bold">Error fetching realtime data:</p>
				<p className="text-sm opacity-80">{error}</p>
				<button
					type="button"
					onClick={() => {
						setLoading(true);
						fetchRealtimeData();
					}}
					className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Traffic Summary Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Users Aktif (Realtime)"
					value={loading ? "..." : data?.activeUsers || 0}
					subtitle="30 menit terakhir"
					icon={
						loading ? (
							<Loader2 className="w-6 h-6 animate-spin" />
						) : (
							<Users className="w-6 h-6" />
						)
					}
					variant="primary"
					trend={{ value: "Live", positive: true }}
				/>
				<StatCard
					title="Page Views"
					value="8,492"
					subtitle="Sesi aktif"
					icon={<MousePointer2 className="w-6 h-6" />}
					variant="success"
					trend={{ value: "8%", positive: true }}
				/>
				<StatCard
					title="Avg. Duration"
					value="2m 45s"
					subtitle="Waktu kunjungan"
					icon={<Clock className="w-6 h-6" />}
					variant="warning"
				/>
				<StatCard
					title="Bounce Rate"
					value="32%"
					subtitle="Engaged sessions"
					icon={<TrendingUp className="w-6 h-6" />}
					variant="danger"
					trend={{ value: "2%", positive: false }}
				/>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Traffic Chart */}
				<div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200/80 p-6 lg:p-8 shadow-sm">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-lg font-black text-slate-900 tracking-tight">
								Tren Pengunjung
							</h2>
							<p className="text-xs text-slate-400 mt-1">
								Estimasi traffic harian 7 hari terakhir
							</p>
						</div>
						<div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
							<button
								type="button"
								className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white text-pink-600 rounded-lg shadow-sm flex items-center gap-2"
							>
								<span className="w-1.5 h-1.5 bg-pink-600 rounded-full animate-ping" />
								Realtime
							</button>
							<button
								type="button"
								className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
							>
								Historical
							</button>
						</div>
					</div>
					<div className="h-80 w-full">
						<TrafficChart data={mockTrafficData} />
					</div>
				</div>

				{/* Realtime Cities/Devices */}
				<div className="bg-white rounded-[2rem] border border-slate-200/80 p-6 lg:p-8 shadow-sm">
					<h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">
						Lokasi Pengunjung (Realtime)
					</h2>
					<div className="space-y-4">
						{loading ? (
							[1, 2, 3, 4, 5].map((skeletonId) => (
								<div
									key={`skeleton-${skeletonId}`}
									className="h-14 bg-slate-50 animate-pulse rounded-2xl"
								/>
							))
						) : data?.deviceBreakdown && data.deviceBreakdown.length > 0 ? (
							data.deviceBreakdown.slice(0, 7).map((item) => (
								<div
									key={`${item.device}-${item.city}-${item.users}`}
									className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-slate-50 hover:border-slate-200 transition-all"
								>
									<div className="flex items-center gap-3">
										<span className="text-[10px] font-black text-slate-400 group-hover:text-pink-500 transition-colors uppercase">
											{item.device}
										</span>
										<span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
											{item.city || "Unknown City"}
										</span>
									</div>
									<div className="text-right">
										<p className="text-xs font-black text-slate-900">
											{item.users}
										</p>
										<p className="text-[10px] font-bold text-emerald-500">
											Active
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-10">
								<p className="text-slate-400 text-xs">
									Belum ada pengunjung aktif saat ini.
								</p>
							</div>
						)}
					</div>
					<div className="mt-8 pt-6 border-t border-slate-100">
						<div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
							<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
								<ShieldCheck className="w-6 h-6" />
							</div>
							<div className="flex-1">
								<p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
									Live Updates
								</p>
								<p className="text-xs font-bold text-indigo-900 mt-0.5 leading-tight">
									Data diperbarui secara otomatis setiap 30 detik.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
