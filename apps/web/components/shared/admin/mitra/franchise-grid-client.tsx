"use client";

import { Briefcase, Building2, Handshake } from "lucide-react";
import Image from "next/image";
import { PaginatedGrid } from "@/components/shared/common/paginated-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCompact } from "@/lib/utils";

interface FranchiseGridClientProps {
	franchiseOutlets: any[];
}

export function FranchiseGridClient({ franchiseOutlets }: FranchiseGridClientProps) {
	return (
		<PaginatedGrid
			items={franchiseOutlets}
			defaultPageSize={9}
			pageSizeOptions={[9, 18, 36]}
			gridClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
			emptyState={
				<div className="bg-white rounded-2xl border border-slate-100 p-10 sm:p-14 text-center shadow-lg shadow-slate-200/40">
					<div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-100">
						<Handshake size={48} className="text-slate-200" />
					</div>
					<h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
						Belum Ada Mitra
					</h3>
					<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed mx-auto text-center">
						Portal kemitraan siap untuk onboarding. Tambahkan mitra pertama untuk memperluas
						jangkauan bisnis Anda.
					</p>
				</div>
			}
			renderItem={(outlet) => {
				const royaltyAmount = outlet.monthlyRevenue * (outlet.franchise_fee / 100);
				return (
					<div className="group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/35 hover:shadow-xl hover:shadow-indigo-500/10 transition-[box-shadow,border-color] duration-300 overflow-hidden flex flex-col">
						<div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors pointer-events-none">
							<Briefcase size={80} strokeWidth={4} />
						</div>

						<div className="relative flex items-center justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl border-2 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-0.5 overflow-hidden">
									{outlet.image_url ? (
										<Image
											src={outlet.image_url}
											alt={outlet.name}
											width={64}
											height={64}
											className="w-full h-full object-cover"
										/>
									) : (
										outlet.name.charAt(0)
									)}
								</div>
								<div>
									<h3 className="font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">
										{outlet.name}
									</h3>
									<Badge className="mt-1 bg-indigo-50 text-indigo-600 border-none text-[8px] font-black tracking-widest px-2 shadow-none">
										FEE {outlet.franchise_fee}%
									</Badge>
								</div>
							</div>
							<span
								className={cn(
									"w-3 h-3 rounded-full border-2 border-white shadow-xs",
									outlet.is_active ? "bg-emerald-500" : "bg-rose-500",
								)}
							/>
						</div>

						<div className="space-y-4 mb-8">
							<div className="flex items-center gap-3 text-slate-400 text-xs">
								<Building2 size={14} className="text-indigo-400" />
								<p className="font-bold uppercase tracking-widest line-clamp-1">
									{outlet.address || "Belum ada alamat"}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="bg-slate-50 rounded-2xl p-4 transition-all group-hover:bg-white group-hover:border group-hover:border-slate-100">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
										Royalti
									</p>
									<p className="text-lg font-black text-indigo-600">
										{formatCompact(royaltyAmount)}
									</p>
								</div>
								<div className="bg-slate-50 rounded-2xl p-4 transition-all group-hover:bg-white group-hover:border group-hover:border-slate-100">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
										Volume
									</p>
									<p className="text-lg font-black text-slate-900">{outlet.ordersThisMonth}</p>
								</div>
							</div>
						</div>

						<div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
							<div className="flex flex-col">
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
									Revenue
								</p>
								<p className="text-sm font-black text-slate-700">
									{formatCompact(outlet.monthlyRevenue)}
								</p>
							</div>
							<Button className="rounded-xl h-9 px-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 shadow-md shadow-slate-900/10">
								Audit Mitra
							</Button>
						</div>
					</div>
				);
			}}
		/>
	);
}
