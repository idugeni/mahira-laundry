"use client";

import {
	CheckCircle2,
	Download,
	Filter,
	Sparkles,
	TrendingUp,
	Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { LeadDetailModal } from "@/components/shared/admin/paket-usaha/leads/lead-detail-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportInquiriesCSV } from "@/lib/actions/business-inquiries";
import type {
	BusinessPackageInquiry,
	InquiryStats,
	InquiryStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminLeadsClientProps {
	leads: BusinessPackageInquiry[];
	stats: InquiryStats;
}

const STATUS_LABELS: Record<InquiryStatus, string> = {
	new: "Baru",
	contacted: "Dihubungi",
	negotiating: "Negosiasi",
	converted: "Konversi",
	rejected: "Ditolak",
};

const STATUS_COLORS: Record<InquiryStatus, string> = {
	new: "bg-blue-50 text-blue-600",
	contacted: "bg-yellow-50 text-yellow-600",
	negotiating: "bg-orange-50 text-orange-600",
	converted: "bg-emerald-50 text-emerald-600",
	rejected: "bg-rose-50 text-rose-500",
};

const ALL_STATUSES: InquiryStatus[] = [
	"new",
	"contacted",
	"negotiating",
	"converted",
	"rejected",
];

export function AdminLeadsClient({ leads, stats }: AdminLeadsClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedLead, setSelectedLead] =
		useState<BusinessPackageInquiry | null>(null);
	const [exportLoading, setExportLoading] = useState(false);

	// Read current filter values from URL
	const currentStatus = searchParams.get("status") ?? "";
	const currentPackageName = searchParams.get("package_name") ?? "";
	const currentDateFrom = searchParams.get("date_from") ?? "";
	const currentDateTo = searchParams.get("date_to") ?? "";

	const updateParam = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
			router.push(`?${params.toString()}`);
		},
		[router, searchParams],
	);

	async function handleExportCSV() {
		setExportLoading(true);
		try {
			const filters = {
				status: currentStatus ? (currentStatus as InquiryStatus) : undefined,
				package_name: currentPackageName || undefined,
				date_from: currentDateFrom || undefined,
				date_to: currentDateTo || undefined,
			};
			const res = await exportInquiriesCSV(filters);
			if (!res.success || !res.data) {
				toast.error(res.error ?? "Gagal mengekspor CSV.");
				return;
			}
			const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `leads-paket-usaha-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("CSV berhasil diunduh.");
		} catch {
			toast.error("Terjadi kesalahan, coba lagi.");
		} finally {
			setExportLoading(false);
		}
	}

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Stats Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					label="Total Leads"
					value={stats.total}
					icon={<Users size={20} />}
					color="bg-slate-50 text-slate-600"
				/>
				<StatCard
					label="Baru"
					value={stats.new}
					icon={<Sparkles size={20} />}
					color="bg-blue-50 text-blue-600"
				/>
				<StatCard
					label="Negosiasi"
					value={stats.negotiating}
					icon={<TrendingUp size={20} />}
					color="bg-orange-50 text-orange-600"
				/>
				<StatCard
					label="Konversi"
					value={stats.converted}
					icon={<CheckCircle2 size={20} />}
					color="bg-emerald-50 text-emerald-600"
				/>
			</div>

			{/* Filter Bar */}
			<div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6">
				<div className="flex items-center gap-3 mb-5">
					<div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
						<Filter size={16} />
					</div>
					<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
						Filter Leads
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Status */}
					<div className="space-y-1.5">
						<label
							htmlFor="filter-status"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							Status
						</label>
						<select
							id="filter-status"
							value={currentStatus}
							onChange={(e) => updateParam("status", e.target.value)}
							className="w-full h-11 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
						>
							<option value="">Semua Status</option>
							{ALL_STATUSES.map((s) => (
								<option key={s} value={s}>
									{STATUS_LABELS[s]}
								</option>
							))}
						</select>
					</div>

					{/* Package name */}
					<div className="space-y-1.5">
						<label
							htmlFor="filter-package-name"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							Nama Paket
						</label>
						<input
							id="filter-package-name"
							type="text"
							placeholder="Cari nama paket..."
							value={currentPackageName}
							onChange={(e) => updateParam("package_name", e.target.value)}
							className="w-full h-11 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
						/>
					</div>

					{/* Date from */}
					<div className="space-y-1.5">
						<label
							htmlFor="filter-date-from"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							Dari Tanggal
						</label>
						<input
							id="filter-date-from"
							type="date"
							value={currentDateFrom}
							onChange={(e) => updateParam("date_from", e.target.value)}
							className="w-full h-11 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
						/>
					</div>

					{/* Date to */}
					<div className="space-y-1.5">
						<label
							htmlFor="filter-date-to"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							Sampai Tanggal
						</label>
						<input
							id="filter-date-to"
							type="date"
							value={currentDateTo}
							onChange={(e) => updateParam("date_to", e.target.value)}
							className="w-full h-11 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
						/>
					</div>
				</div>
			</div>

			{/* Table + Export */}
			<div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
				{/* Table toolbar */}
				<div className="flex items-center justify-between px-8 py-5 border-b border-slate-50">
					<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
						{leads.length} leads ditemukan
					</p>
					<Button
						onClick={handleExportCSV}
						disabled={exportLoading}
						className="bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl px-5 h-10 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 flex items-center gap-2 disabled:opacity-50"
					>
						{exportLoading ? (
							<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							<Download size={14} />
						)}
						Export CSV
					</Button>
				</div>

				{leads.length === 0 ? (
					<div className="p-24 text-center">
						<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-slate-100">
							<Users size={40} className="text-slate-200" />
						</div>
						<h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
							Belum Ada Leads
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-3 max-w-sm mx-auto leading-relaxed">
							Belum ada inquiry yang masuk atau tidak ada yang cocok dengan
							filter aktif.
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-slate-50">
									{[
										"Nama",
										"Telepon",
										"Paket",
										"Kota",
										"Tanggal",
										"Status",
									].map((col) => (
										<th
											key={col}
											className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest first:pl-8 last:pr-8"
										>
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{leads.map((lead) => (
									<tr
										key={lead.id}
										onClick={() => setSelectedLead(lead)}
										className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
									>
										<td className="pl-8 pr-6 py-5">
											<p className="font-black text-slate-900 text-sm uppercase tracking-tight">
												{lead.full_name}
											</p>
											{lead.email && (
												<p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate max-w-[180px]">
													{lead.email}
												</p>
											)}
										</td>
										<td className="px-6 py-5">
											<p className="text-sm font-bold text-slate-700">
												{lead.phone}
											</p>
										</td>
										<td className="px-6 py-5">
											<p className="text-sm font-bold text-slate-700 truncate max-w-[160px]">
												{lead.package_name}
											</p>
										</td>
										<td className="px-6 py-5">
											<p className="text-sm font-bold text-slate-700">
												{lead.city}
											</p>
										</td>
										<td className="px-6 py-5">
											<p className="text-sm font-bold text-slate-700">
												{new Date(lead.created_at).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})}
											</p>
										</td>
										<td className="px-6 pr-8 py-5">
											<Badge
												className={cn(
													"px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border-none shadow-none",
													STATUS_COLORS[lead.status],
												)}
											>
												{STATUS_LABELS[lead.status]}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Lead Detail Modal */}
			{selectedLead && (
				<LeadDetailModal
					lead={selectedLead}
					onClose={() => setSelectedLead(null)}
				/>
			)}
		</div>
	);
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
	label: string;
	value: number;
	icon: React.ReactNode;
	color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
	return (
		<div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 flex items-center gap-4">
			<div
				className={cn(
					"w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
					color,
				)}
			>
				{icon}
			</div>
			<div>
				<p className="text-2xl font-black text-slate-900">{value}</p>
				<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
					{label}
				</p>
			</div>
		</div>
	);
}
