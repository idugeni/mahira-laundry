import { Info } from "lucide-react";
import type { Metadata } from "next";
import { RealtimeDashboard } from "@/components/shared/admin/analytics/realtime-dashboard";

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
		<div className="space-y-8 pb-20 animate-fade-in-up">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
						Traffic Analytics
					</h1>
					<p className="text-slate-500 mt-1 text-sm">
						Analisis perilaku pengunjung via Google Analytics 4.
					</p>
				</div>
				<div
					className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold transition-all ${
						isConfigured
							? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100"
							: "bg-amber-50 border-amber-100 text-amber-600 shadow-sm shadow-amber-100"
					}`}
				>
					<span
						className={`w-2 h-2 rounded-full ${isConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
					/>
					{isConfigured ? `GA4 Active: ${gaId}` : "GA4 Not Configured"}
				</div>
			</div>

			{!isConfigured ? (
				<div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-8 lg:p-16 text-center">
					{/* ... (keep existing setup instructions) */}
					<div className="max-w-md mx-auto">
						<div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
							⚙️
						</div>
						<h2 className="text-2xl font-black text-slate-900 mb-3">
							Konfigurasi API Dibutuhkan
						</h2>
						<p className="text-slate-500 text-sm leading-relaxed mb-8">
							Dashboard Realtime memerlukan Google Analytics Data API. Silakan
							lengkapi variabel berikut di{" "}
							<code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
								.env
							</code>
							:
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
										<span className="flex-shrink-0 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-400">
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
