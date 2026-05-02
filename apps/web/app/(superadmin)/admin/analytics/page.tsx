import { Info } from "lucide-react";
import type { Metadata } from "next";
import { RealtimeDashboard } from "@/components/shared/admin/analytics/realtime-dashboard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Traffic Analytics",
	description:
		"Pantau statistik pengunjung dan perilaku pengguna secara realtime melalui integrasi Google Analytics 4.",
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;
	const isConfigured = !!gaId && gaId.startsWith("G-");

	return (
		<div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in-up">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
						Traffic Analytics
					</h1>
					<p className="text-slate-500 mt-0.5 sm:mt-1 text-xs sm:text-sm">
						Analisis perilaku pengunjung via Google Analytics 4.
					</p>
				</div>
				<div
					className={cn(
						"flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-bold transition-colors shadow-xs shrink-0",
						isConfigured
							? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100"
							: "bg-amber-50 border-amber-100 text-amber-600 shadow-amber-100",
					)}
				>
					<span
						className={cn(
							"w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
							isConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500",
						)}
					/>
					{isConfigured ? `GA4 Active: ${gaId}` : "GA4 Not Configured"}
				</div>
			</div>

			{!isConfigured ? (
				<div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-8 lg:p-10 text-center">
					{/* ... (keep existing setup instructions) */}
					<div className="max-w-md mx-auto">
						<div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl">
							⚙️
						</div>
						<h2 className="text-2xl font-black text-slate-900 mb-3">Konfigurasi API Dibutuhkan</h2>
						<p className="text-slate-500 text-sm leading-relaxed mb-8">
							Dashboard Realtime memerlukan Google Analytics Data API. Silakan lengkapi variabel
							berikut di{" "}
							<code className="bg-slate-100 px-1.5 py-0.5 rounded-sm text-slate-700">.env</code>:
						</p>
						<div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100">
							<h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
								<Info className="w-4 h-4" /> Kredensial Required:
							</h3>
							<ul className="space-y-3">
								{[
									"GOOGLE_CLIENT_EMAIL (Dari Service Account)",
									"GOOGLE_PRIVATE_KEY (Dari JSON Key)",
									"GA_PROPERTY_ID (ID Property GA4)",
									"NEXT_PUBLIC_GA_ID (ID Pengukuran G-XXX)",
								].map((step, i) => (
									<li
										key={step}
										className="flex items-start gap-3 text-xs font-bold text-slate-600"
									>
										<span className="shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-400">
											{i + 1}
										</span>
										{step}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			) : (
				<RealtimeDashboard />
			)}
		</div>
	);
}
