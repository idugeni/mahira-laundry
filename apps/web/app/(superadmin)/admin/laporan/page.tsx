import {
	Activity,
	ArrowRight,
	BarChart3,
	Calendar,
	FileText,
	Layers,
	PieChart,
	ShieldAlert,
	TrendingUp,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import { AuditTrailTable } from "@/components/shared/admin/audit-trail-table";
import { ReportModal } from "@/components/shared/admin/finance/report-modal";
import { Badge } from "@/components/ui/badge";
import { getAuditLogs } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Laporan & Audit",
	description:
		"Log audit trail dan laporan operasional lengkap seluruh cabang Mahira Laundry.",
};

export const dynamic = "force-dynamic";

const _ACTION_COLORS: Record<string, string> = {
	create: "bg-emerald-50 text-emerald-600 border-emerald-100",
	update: "bg-indigo-50 text-indigo-600 border-indigo-100",
	delete: "bg-rose-50 text-rose-600 border-rose-100",
	login: "bg-violet-50 text-violet-600 border-violet-100",
	logout: "bg-slate-50 text-slate-400 border-slate-100",
	status_change: "bg-amber-50 text-amber-600 border-amber-100",
};

const _TABLE_LABELS: Record<string, string> = {
	orders: "Pesanan",
	profiles: "Profil",
	payments: "Pembayaran",
	services: "Layanan",
	vouchers: "Voucher",
	inventory: "Inventori",
	outlets: "Outlet",
	delivery: "Pengiriman",
};

const reportCards = [
	{
		title: "Laporan Harian",
		desc: "Ringkasan order dan pendapatan hari ini",
		icon: <Calendar size={24} />,
		badge: "Tersedia",
		variant: "indigo",
	},
	{
		title: "Laporan Mingguan",
		desc: "Performa minggu ini vs minggu lalu",
		icon: <Activity size={24} />,
		badge: "Tersedia",
		variant: "emerald",
	},
	{
		title: "Laporan Bulanan",
		desc: "Laporan lengkap bulan berjalan",
		icon: <BarChart3 size={24} />,
		badge: "Tersedia",
		variant: "amber",
	},
	{
		title: "Performa Karyawan",
		desc: "Produktivitas dan kehadiran staf",
		icon: <Users size={24} />,
		badge: "Beta",
		variant: "violet",
	},
	{
		title: "Financial Summary",
		desc: "P&L dan cashflow ringkas",
		icon: <PieChart size={24} />,
		badge: "Tersedia",
		variant: "rose",
	},
	{
		title: "Business Insights",
		desc: "Analisis perilaku & tren pasar",
		icon: <TrendingUp size={24} />,
		badge: "Elite",
		variant: "slate",
	},
];

export default async function LaporanPage() {
	const auditLogs = await getAuditLogs(200);

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-none sm:rounded-2xl lg:rounded-[3rem] p-6 sm:p-8 lg:p-14 text-white shadow-2xl shadow-slate-900/40 group">
				<div className="absolute top-0 right-0 w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-indigo-500/10 rounded-full -mr-24 lg:-mr-40 -mt-24 lg:-mt-40 blur-3xl opacity-50" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="space-y-3 lg:space-y-4">
						<div className="flex items-center gap-2 lg:gap-3 flex-wrap">
							<Badge className="bg-indigo-500 text-white border-none px-2.5 py-0.5 lg:px-3 lg:py-1 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]">
								Business Intelligence
							</Badge>
							<span className="text-slate-500 hidden sm:inline">•</span>
							<span className="text-slate-400 text-xs lg:text-sm font-bold uppercase tracking-widest items-center gap-2 hidden sm:flex">
								<Layers size={14} /> Comprehensive Auditing
							</span>
						</div>
						<h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-white">
							Pusat <span className="text-indigo-400 italic">Laporan</span>
						</h1>
						<p className="text-slate-400 font-bold text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed">
							Analisis mendalam operasional bisnis Mahira Laundry. Pantau jejak
							audit digital dan hasilkan laporan performa eksekutif dalam satu
							klik.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<div className="text-right">
							<p className="text-2xl lg:text-3xl font-black text-white">
								{auditLogs?.length || 0}
							</p>
							<p className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">
								Recent Events
							</p>
						</div>
						<div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-2xl">
							<ShieldAlert size={24} className="lg:hidden" />
							<ShieldAlert size={32} className="hidden lg:block" />
						</div>
					</div>
				</div>
			</div>

			{/* Report Catalog */}
			<div className="space-y-5">
				<h2 className="text-base lg:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2.5 px-1">
					<FileText size={20} className="text-indigo-600" /> Katalog Laporan
				</h2>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-0 sm:gap-4 lg:gap-5">
					{reportCards.map((report) => (
						<ReportModal
							key={report.title}
							initialType={
								report.title.toLowerCase().includes("harian")
									? "harian"
									: report.title.toLowerCase().includes("bulanan")
										? "bulanan"
										: "keuangan"
							}
							trigger={
								<button
									type="button"
									className="group relative w-full bg-white rounded-none sm:rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 border-b sm:border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 text-left overflow-hidden flex flex-col gap-3 sm:gap-4 h-full"
								>
									<div className="flex items-center justify-between gap-2">
										<div
											className={cn(
												"w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6",
												report.variant === "indigo"
													? "bg-indigo-50 text-indigo-600"
													: report.variant === "emerald"
														? "bg-emerald-50 text-emerald-600"
														: report.variant === "amber"
															? "bg-amber-50 text-amber-600"
															: report.variant === "rose"
																? "bg-rose-50 text-rose-600"
																: report.variant === "violet"
																	? "bg-violet-50 text-violet-600"
																	: "bg-slate-50 text-slate-600",
											)}
										>
											<span className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
												{report.icon}
											</span>
										</div>
										<Badge
											className={cn(
												"px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border-none shrink-0",
												report.badge === "Tersedia"
													? "bg-emerald-50 text-emerald-600"
													: report.badge === "Beta"
														? "bg-amber-50 text-amber-600"
														: "bg-slate-100 text-slate-400",
											)}
										>
											{report.badge}
										</Badge>
									</div>

									<div className="flex-1 min-w-0">
										<h3 className="font-black text-slate-900 uppercase tracking-tight text-xs sm:text-sm lg:text-base leading-tight mb-1 group-hover:text-indigo-600 transition-colors truncate">
											{report.title}
										</h3>
										<p className="text-[10px] sm:text-[11px] font-bold text-slate-400 leading-relaxed line-clamp-2 group-hover:text-slate-500 transition-colors">
											{report.desc}
										</p>
									</div>

									<div className="mt-auto flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-500 group-hover:text-indigo-600 group-hover:gap-2.5 transition-all">
										Generate <ArrowRight size={12} />
									</div>
								</button>
							}
						/>
					))}
				</div>
			</div>

			{/* Paginated Audit Log Table */}
			<AuditTrailTable auditLogs={auditLogs} />
		</div>
	);
}
