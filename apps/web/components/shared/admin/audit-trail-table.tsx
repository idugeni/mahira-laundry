"use client";

import { History, Search } from "lucide-react";
import { useState } from "react";
import { PaginationControls } from "@/components/shared/common/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDateTime } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
	create: "bg-emerald-50 text-emerald-600 border-emerald-100",
	update: "bg-indigo-50 text-indigo-600 border-indigo-100",
	delete: "bg-rose-50 text-rose-600 border-rose-100",
	login: "bg-violet-50 text-violet-600 border-violet-100",
	logout: "bg-slate-50 text-slate-400 border-slate-100",
	status_change: "bg-amber-50 text-amber-600 border-amber-100",
};

const TABLE_LABELS: Record<string, string> = {
	orders: "Pesanan",
	profiles: "Profil",
	payments: "Pembayaran",
	services: "Layanan",
	vouchers: "Voucher",
	inventory: "Inventori",
	outlets: "Outlet",
	delivery: "Pengiriman",
};

interface AuditLog {
	id: string;
	created_at: string;
	action: string;
	table_name: string;
	record_id: string;
	profiles?: {
		full_name?: string | null;
		role?: string | null;
	};
}

export function AuditTrailTable({ auditLogs }: { auditLogs: AuditLog[] }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchQuery, setSearchQuery] = useState("");
	const [actionFilter, setActionFilter] = useState<string | null>(null);

	const filtered = auditLogs.filter((log) => {
		const matchesSearch =
			!searchQuery ||
			log.profiles?.full_name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			log.table_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.action.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesAction = !actionFilter || log.action === actionFilter;

		return matchesSearch && matchesAction;
	});

	const totalPages = Math.ceil(filtered.length / pageSize);
	const paginatedLogs = filtered.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1);
	};

	const handleFilterAction = (action: string | null) => {
		setActionFilter((prev) => (prev === action ? null : action));
		setCurrentPage(1);
	};

	return (
		<div className="bg-white rounded-none sm:rounded-2xl lg:rounded-[3rem] border-y sm:border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
			{/* Header + Filter */}
			<div className="p-4 sm:p-6 lg:p-10 border-b border-slate-50 space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
							<History className="text-indigo-600" /> Digital Audit Trail
						</h2>
						<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
							{filtered.length} event terlacak
						</p>
					</div>

					<div className="relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<Input
							className="pl-11 pr-4 py-5 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-xs w-full sm:w-64"
							placeholder="Cari user atau entitas..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>
				</div>

				{/* Action filter chips */}
				<div className="flex items-center gap-1.5 flex-wrap">
					{Object.keys(ACTION_COLORS).map((action) => (
						<Button
							key={action}
							variant="ghost"
							onClick={() => handleFilterAction(action)}
							className={cn(
								"rounded-xl h-8 px-3 font-black text-[9px] uppercase tracking-widest transition-all",
								actionFilter === action
									? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:text-white"
									: "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50",
							)}
						>
							{action.replace("_", " ")}
						</Button>
					))}
					{actionFilter && (
						<Button
							variant="ghost"
							onClick={() => handleFilterAction(null)}
							className="rounded-xl h-8 px-3 font-black text-[9px] uppercase tracking-widest text-rose-500 hover:bg-rose-50"
						>
							✕ Reset
						</Button>
					)}
				</div>
			</div>

			{paginatedLogs.length === 0 ? (
				<div className="py-24 text-center text-slate-300">
					<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
						<History size={40} />
					</div>
					<h3 className="text-xl font-black uppercase tracking-tight text-slate-800">
						{searchQuery || actionFilter
							? "Tidak Ada Hasil"
							: "No Activity Detected"}
					</h3>
					<p className="text-[10px] font-black uppercase tracking-widest mt-2">
						{searchQuery || actionFilter
							? "Coba ubah filter pencarian"
							: "Database is currently idle"}
					</p>
				</div>
			) : (
				<>
					{/* DESKTOP TABLE */}
					<div className="hidden md:block">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-slate-50/50">
									<th className="px-6 lg:px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
										Timestamp
									</th>
									<th className="px-6 lg:px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
										Actor
									</th>
									<th className="px-6 lg:px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
										Action
									</th>
									<th className="px-6 lg:px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
										Entity
									</th>
									<th className="px-6 lg:px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
										Record ID
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{paginatedLogs.map((log) => (
									<tr
										key={log.id}
										className="group hover:bg-slate-50/30 transition-colors"
									>
										<td className="px-6 lg:px-10 py-5 text-xs font-bold text-slate-400 whitespace-nowrap">
											{formatDateTime(log.created_at)}
										</td>
										<td className="px-6 lg:px-10 py-5">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
													{log.profiles?.full_name?.charAt(0) || "S"}
												</div>
												<div>
													<p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
														{log.profiles?.full_name || "SYSTEM"}
													</p>
													<p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
														{log.profiles?.role || "kernel"}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 lg:px-10 py-5">
											<Badge
												className={cn(
													"px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
													ACTION_COLORS[log.action] ||
														"bg-slate-100 text-slate-600 border-slate-200",
												)}
											>
												{log.action.replace("_", " ")}
											</Badge>
										</td>
										<td className="px-6 lg:px-10 py-5">
											<span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
												{TABLE_LABELS[log.table_name] || log.table_name}
											</span>
										</td>
										<td className="px-6 lg:px-10 py-5 font-mono text-[10px] font-black text-slate-300 group-hover:text-indigo-400 transition-colors">
											{log.record_id
												? `${log.record_id.slice(0, 12).toUpperCase()}...`
												: "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* MOBILE CARDS */}
					<div className="md:hidden divide-y divide-slate-100">
						{paginatedLogs.map((log) => (
							<div
								key={log.id}
								className="p-4 hover:bg-slate-50/50 transition-colors"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] shrink-0">
											{log.profiles?.full_name?.charAt(0) || "S"}
										</div>
										<div className="min-w-0">
											<p className="text-sm font-black text-slate-900 truncate">
												{log.profiles?.full_name || "SYSTEM"}
											</p>
											<p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
												{log.profiles?.role || "kernel"}
											</p>
										</div>
									</div>
									<Badge
										className={cn(
											"px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border shrink-0",
											ACTION_COLORS[log.action] ||
												"bg-slate-100 text-slate-600 border-slate-200",
										)}
									>
										{log.action.replace("_", " ")}
									</Badge>
								</div>
								<div className="flex items-center justify-between mt-2 pl-12">
									<span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded text-slate-500 border border-slate-100">
										{TABLE_LABELS[log.table_name] || log.table_name}
									</span>
									<span className="text-[10px] text-slate-400 font-bold">
										{formatDateTime(log.created_at)}
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="px-4 sm:px-6 lg:px-10 pb-6">
						<PaginationControls
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
							totalItems={filtered.length}
							itemsPerPage={pageSize}
							onPageSizeChange={(size) => {
								setPageSize(size);
								setCurrentPage(1);
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
}
