"use client";

import { Building2, Clock, Edit, Eye, Phone, Trash2, Users } from "lucide-react";
import { PaginatedGrid } from "@/components/shared/common/paginated-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

interface StaffGridClientProps {
	staff: any[];
}

function getOutletName(staff: any) {
	return (Array.isArray(staff.outlets) ? staff.outlets[0]?.name : null) || "";
}

export function StaffGridClient({ staff }: StaffGridClientProps) {
	return (
		<PaginatedGrid
			items={staff}
			defaultPageSize={9}
			pageSizeOptions={[9, 18, 36]}
			gridClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
			renderItem={(s) => (
				<div className="group relative bg-white rounded-none sm:rounded-2xl border-b sm:border border-slate-100 p-6 flex flex-col gap-6 shadow-lg shadow-slate-200/35 hover:shadow-xl hover:shadow-emerald-500/10 transition-[box-shadow,border-color,background-color] duration-300 overflow-hidden h-full">
					{/* Background Decoration */}
					<div
						className={cn(
							"absolute -right-4 -top-4 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700",
							s.role === "manager"
								? "bg-indigo-500"
								: s.role === "kasir"
									? "bg-amber-500"
									: "bg-emerald-500",
						)}
					/>

					<div className="relative flex items-center justify-between">
						<div className="flex items-center gap-5">
							<div className="relative">
								<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center text-2xl font-black text-slate-400 border-2 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-0.5">
									{s.full_name?.charAt(0) || <Users size={32} />}
								</div>
								<span
									className={cn(
										"absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-xs",
										s.is_active ? "bg-emerald-500" : "bg-slate-300",
									)}
								/>
							</div>
							<div className="min-w-0">
								<h3 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate pr-4">
									{s.full_name}
								</h3>
								<Badge
									className={cn(
										"mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-none",
										s.role === "manager"
											? "bg-indigo-50 text-indigo-600"
											: s.role === "kasir"
												? "bg-amber-50 text-amber-600"
												: "bg-emerald-50 text-emerald-600",
									)}
								>
									{s.role}
								</Badge>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Button
								variant="ghost"
								className="w-10 h-10 p-0 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-emerald-400"
							>
								<Edit size={18} />
							</Button>
							<Button
								variant="ghost"
								className="w-10 h-10 p-0 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500"
							>
								<Trash2 size={18} />
							</Button>
						</div>
					</div>

					<div className="space-y-4 pt-8 border-t border-slate-50 relative flex-1">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 text-slate-400">
								<Building2 size={14} className="text-emerald-400" />
								<span className="text-[10px] font-black uppercase tracking-widest">
									Penempatan
								</span>
							</div>
							<span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
								{getOutletName(s) || "Unassigned"}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 text-slate-400">
								<Phone size={14} className="text-emerald-400" />
								<span className="text-[10px] font-black uppercase tracking-widest">Kontak</span>
							</div>
							<span className="text-xs font-bold text-slate-700">{s.phone || "—"}</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 text-slate-400">
								<Clock size={14} className="text-emerald-400" />
								<span className="text-[10px] font-black uppercase tracking-widest">
									Registrasi
								</span>
							</div>
							<span className="text-xs font-bold text-slate-700">
								{formatDate(s.created_at)}
							</span>
						</div>
					</div>

					<div className="relative mt-auto">
						<Button className="w-full bg-slate-50 hover:bg-emerald-500 hover:text-white text-slate-600 rounded-[1.25rem] h-14 font-black text-[10px] uppercase tracking-widest border-none shadow-none group/btn transition-all duration-300">
							<Eye size={16} className="mr-2" /> Detail Profil & Log
						</Button>
					</div>
				</div>
			)}
		/>
	);
}
