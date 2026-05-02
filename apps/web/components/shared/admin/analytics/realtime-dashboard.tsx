"use client";

import {
	Clock,
	FileText,
	Loader2,
	MousePointer2,
	ShieldCheck,
	TrendingUp,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OrderTrendChart as TrafficChart } from "@/components/shared/admin/admin-charts";
import { StatCard } from "@/components/shared/common/stat-card";

// ─── Types ──────────────────────────────────────────────────────────────

interface RealtimeData {
	activeUsers: number;
	eventCount: number;
	deviceBreakdown: Array<{
		device: string;
		city: string;
		users: number;
	}>;
	topPages: Array<{
		page: string;
		users: number;
	}>;
	timestamp: string;
}

interface HistoricalData {
	dailyTrend: Array<{
		date: string;
		sessions: number;
		activeUsers: number;
		pageViews: number;
	}>;
	topPages: Array<{
		path: string;
		pageViews: number;
		users: number;
	}>;
	summary: {
		sessions: number;
		activeUsers: number;
		pageViews: number;
		bounceRate: number;
		avgSessionDuration: number;
	};
	period: string;
}

type Mode = "realtime" | "historical";

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	if (mins === 0) return `${secs}s`;
	return `${mins}m ${secs}s`;
}

function formatBounceRate(rate: number): string {
	return `${Math.round(rate)}%`;
}

// ─── Component ──────────────────────────────────────────────────────────

export function RealtimeDashboard() {
	const [mode, setMode] = useState<Mode>("realtime");
	const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
	const [historicalData, setHistoricalData] = useState<HistoricalData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// ── Fetch realtime ──
	const fetchRealtimeData = useCallback(async () => {
		try {
			const res = await fetch("/api/analytics/realtime");
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to fetch");
			}
			const json = (await res.json()) as RealtimeData;
			setRealtimeData(json);
			setError(null);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	// ── Fetch historical ──
	const fetchHistoricalData = useCallback(async () => {
		try {
			const res = await fetch("/api/analytics/historical");
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to fetch");
			}
			const json = (await res.json()) as HistoricalData;
			setHistoricalData(json);
			setError(null);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	// ── Polling: realtime 60s, historical not polled ──
	useEffect(() => {
		if (mode === "historical") {
			fetchHistoricalData();
			return;
		}

		fetchRealtimeData();

		let interval: ReturnType<typeof setInterval>;

		function startPolling() {
			fetchRealtimeData();
			interval = setInterval(fetchRealtimeData, 60_000);
		}

		function stopPolling() {
			clearInterval(interval);
		}

		function handleVisibility() {
			if (document.visibilityState === "visible") {
				startPolling();
			} else {
				stopPolling();
			}
		}

		startPolling();
		document.addEventListener("visibilitychange", handleVisibility);

		return () => {
			stopPolling();
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [mode, fetchRealtimeData, fetchHistoricalData]);

	if (error && mode === "realtime") {
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
		<div className="space-y-4 sm:space-y-6 lg:space-y-8">
			{/* Mode Toggle + Summary Cards */}
			{mode === "realtime" ? (
				<RealtimeCards data={realtimeData} loading={loading} />
			) : (
				<HistoricalCards data={historicalData} loading={loading} />
			)}

			<div className="grid md:grid-cols-3 gap-4 sm:gap-6">
				{/* Traffic Chart */}
				<div className="md:col-span-2 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-xs">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto">
						<div>
							<h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
								Tren Pengunjung
							</h2>
							<p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 truncate max-w-md">
								{mode === "realtime"
									? "Distribusi pengunjung aktif per kota"
									: "Tren harian 7 hari terakhir"}
							</p>
						</div>
						<div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-slate-100 shrink-0">
							<button
								type="button"
								onClick={() => setMode("realtime")}
								className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 sm:gap-2 transition-colors ${
									mode === "realtime"
										? "bg-white text-pink-600 shadow-xs"
										: "text-slate-400 hover:text-slate-600"
								}`}
							>
								{mode === "realtime" && (
									<span className="w-1.5 h-1.5 bg-pink-600 rounded-full animate-ping" />
								)}
								Realtime
							</button>
							<button
								type="button"
								onClick={() => setMode("historical")}
								className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${
									mode === "historical"
										? "bg-white text-indigo-600 shadow-xs"
										: "text-slate-400 hover:text-slate-600"
								}`}
							>
								Historical
							</button>
						</div>
					</div>
					<div className="h-56 sm:h-64 md:h-80 w-full">
						{mode === "realtime" ? (
							realtimeData?.deviceBreakdown ? (
								<TrafficChart
									data={realtimeData.deviceBreakdown
										.slice(0, 7)
										.map((item, i) => ({
											day: item.city || `Kota ${i + 1}`,
											count: item.users,
										}))}
								/>
							) : (
								<EmptyChart loading={loading} />
							)
						) : historicalData?.dailyTrend ? (
							<TrafficChart
								data={historicalData.dailyTrend.map((d) => ({
									day: d.date,
									count: d.sessions,
								}))}
							/>
						) : (
							<EmptyChart loading={loading} />
						)}
					</div>
				</div>

				{/* Right Panel: Location or Top Pages */}
				{mode === "realtime" ? (
					<RealtimeLocationPanel data={realtimeData} loading={loading} />
				) : (
					<HistoricalTopPagesPanel data={historicalData} loading={loading} />
				)}
			</div>

			{/* Bottom: Top Pages (realtime) or Bounce/Duration (historical) */}
			{mode === "realtime" &&
				realtimeData?.topPages &&
				realtimeData.topPages.length > 0 && (
					<div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-xs">
						<h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-4 sm:mb-6">
							Halaman Aktif (Realtime)
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
							{realtimeData.topPages.slice(0, 8).map((item) => (
								<div
									key={item.page}
									className="p-2 sm:p-3 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100/50 hover:bg-slate-50 hover:border-slate-200 transition-colors overflow-hidden"
								>
									<p className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
										{item.page}
									</p>
									<p className="text-[9px] sm:text-[10px] font-black text-emerald-500 mt-0.5 sm:mt-1">
										{item.users} active
									</p>
								</div>
							))}
						</div>
					</div>
				)}
		</div>
	);
}

// ─── Sub-components ──────────────────────────────────────────────────────

function EmptyChart({ loading }: { loading: boolean }) {
	return (
		<div className="flex items-center justify-center h-full text-slate-400 text-sm">
			{loading ? "Memuat data..." : "Belum ada data traffic"}
		</div>
	);
}

function RealtimeCards({
	data,
	loading,
}: {
	data: RealtimeData | null;
	loading: boolean;
}) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
			<StatCard
				title="Users Aktif"
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
				title="Events"
				value={loading ? "..." : (data?.eventCount ?? 0).toLocaleString()}
				subtitle="30 menit terakhir"
				icon={<MousePointer2 className="w-6 h-6" />}
				variant="success"
				trend={{ value: "Live", positive: true }}
			/>
			<StatCard
				title="Perangkat Aktif"
				value={
					loading
						? "..."
						: data?.deviceBreakdown
							? new Set(data.deviceBreakdown.map((d) => d.device)).size
							: 0
				}
				subtitle="Tipe perangkat"
				icon={<ShieldCheck className="w-6 h-6" />}
				variant="warning"
				trend={{ value: "Live", positive: true }}
			/>
			<StatCard
				title="Kota Aktif"
				value={
					loading
						? "..."
						: data?.deviceBreakdown
							? new Set(data.deviceBreakdown.map((d) => d.city).filter(Boolean))
									.size
							: 0
				}
				subtitle="Lokasi pengunjung"
				icon={<TrendingUp className="w-6 h-6" />}
				variant="danger"
				trend={{ value: "Live", positive: true }}
			/>
		</div>
	);
}

function HistoricalCards({
	data,
	loading,
}: {
	data: HistoricalData | null;
	loading: boolean;
}) {
	const s = data?.summary;
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
			<StatCard
				title="Sessions"
				value={loading ? "..." : (s?.sessions ?? 0).toLocaleString()}
				subtitle="7 hari terakhir"
				icon={<Users className="w-6 h-6" />}
				variant="primary"
			/>
			<StatCard
				title="Page Views"
				value={loading ? "..." : (s?.pageViews ?? 0).toLocaleString()}
				subtitle="7 hari terakhir"
				icon={<MousePointer2 className="w-6 h-6" />}
				variant="success"
			/>
			<StatCard
				title="Bounce Rate"
				value={loading ? "..." : s ? formatBounceRate(s.bounceRate) : "0%"}
				subtitle="7 hari terakhir"
				icon={<TrendingUp className="w-6 h-6" />}
				variant="danger"
			/>
			<StatCard
				title="Avg. Duration"
				value={
					loading ? "..." : s ? formatDuration(s.avgSessionDuration) : "0s"
				}
				subtitle="7 hari terakhir"
				icon={<Clock className="w-6 h-6" />}
				variant="warning"
			/>
		</div>
	);
}

function RealtimeLocationPanel({
	data,
	loading,
}: {
	data: RealtimeData | null;
	loading: boolean;
}) {
	return (
		<div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-xs">
			<h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-4 sm:mb-6">
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
							key={`${item.device}-${item.city || "unknown"}-${item.users}`}
							className="flex items-center justify-between p-2.5 sm:p-3.5 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100/50 group hover:bg-slate-50 hover:border-slate-200 transition-colors"
						>
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<span className="text-[9px] sm:text-[10px] font-black text-slate-400 group-hover:text-pink-500 transition-colors uppercase shrink-0">
									{item.device}
								</span>
								<span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
									{item.city || "Unknown City"}
								</span>
							</div>
							<div className="text-right shrink-0">
								<p className="text-[10px] sm:text-xs font-black text-slate-900">
									{item.users}
								</p>
								<p className="text-[9px] sm:text-[10px] font-bold text-emerald-500">
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
			<div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl sm:rounded-2xl">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600">
						<ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest">
							Live Updates
						</p>
						<p className="text-[10px] sm:text-xs font-bold text-indigo-900 mt-0.5 leading-tight">
							Data diperbarui secara otomatis setiap 60 detik.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function HistoricalTopPagesPanel({
	data,
	loading,
}: {
	data: HistoricalData | null;
	loading: boolean;
}) {
	return (
		<div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-xs">
			<h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-4 sm:mb-6">
				Halaman Terpopuler
			</h2>
			<div className="space-y-4">
				{loading ? (
					[1, 2, 3, 4, 5].map((skeletonId) => (
						<div
							key={`skeleton-h-${skeletonId}`}
							className="h-14 bg-slate-50 animate-pulse rounded-2xl"
						/>
					))
				) : data?.topPages && data.topPages.length > 0 ? (
					data.topPages.slice(0, 7).map((item, i) => (
						<div
							key={item.path}
							className="flex items-center justify-between p-2.5 sm:p-3.5 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100/50 group hover:bg-slate-50 hover:border-slate-200 transition-colors"
						>
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<span className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-50 text-indigo-600 rounded-md sm:rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
									{i + 1}
								</span>
								<span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">
									{item.path}
								</span>
							</div>
							<div className="text-right shrink-0">
								<p className="text-[10px] sm:text-xs font-black text-slate-900">
									{item.pageViews.toLocaleString()}
								</p>
								<p className="text-[9px] sm:text-[10px] font-bold text-indigo-500">
									views
								</p>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-10">
						<p className="text-slate-400 text-xs">Belum ada data halaman.</p>
					</div>
				)}
			</div>
			<div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
				<div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl sm:rounded-2xl">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600">
						<FileText className="w-4 h-4 sm:w-6 sm:h-6" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest">
							7-Day Summary
						</p>
						<p className="text-[10px] sm:text-xs font-bold text-indigo-900 mt-0.5 leading-tight">
							Data historis diperbarui setiap 15 menit.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
