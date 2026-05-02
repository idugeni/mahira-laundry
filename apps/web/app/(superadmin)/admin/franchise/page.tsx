import {
	ArrowUpRight,
	Briefcase,
	Building2,
	Coins,
	Globe,
	Handshake,
	Plus,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { MitraModal } from "@/components/shared/admin/mitra/mitra-modal";
import { PaginatedGrid } from "@/components/shared/common/paginated-grid";
import { StatCard } from "@/components/shared/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOutletsWithStats } from "@/lib/supabase/server";
import { cn, formatCompact, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Franchise Portal",
	description: "Manajemen franchise dan cabang mitra Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function FranchisePage() {
	const allOutlets = await getOutletsWithStats();
	const franchiseOutlets = allOutlets.filter((o) => o.is_franchise);
	const hqOutlets = allOutlets.filter((o) => !o.is_franchise);

	const totalRoyalty = franchiseOutlets.reduce(
		(sum, o) => sum + o.monthlyRevenue * (o.franchise_fee / 100),
		0,
	);
	const totalLastMonthRoyalty = franchiseOutlets.reduce(
		(sum, o) => sum + (o.lastMonthRevenue || 0) * (o.franchise_fee / 100),
		0,
	);
	const royaltyGrowth =
		totalLastMonthRoyalty > 0
			? (
					((totalRoyalty - totalLastMonthRoyalty) / totalLastMonthRoyalty) *
					100
				).toFixed(1)
			: totalRoyalty > 0
				? "100.0"
				: "0.0";

	return (
		<div className="space-y-8 sm:space-y-10  animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-60" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="space-y-5">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Strategic Partnership
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Globe size={14} /> {franchiseOutlets.length} Mitra Terdaftar
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight text-slate-900">
							Portal <span className="text-indigo-600 italic">Kemitraan</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-lg max-w-2xl leading-relaxed">
							Ekspansi bisnis Mahira Laundry melalui manajemen mitra strategis,
							pengawasan model bisnis franchise, dan standardisasi SOP
							operasional secara digital.
						</p>
					</div>

					<MitraModal
						trigger={
							<Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10 flex items-center gap-2.5">
								<div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
									<Plus size={17} />
								</div>
								Onboarding Mitra Baru
							</Button>
						}
					/>
				</div>
			</div>

			{/* Financial Summary */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Mitra Franchise"
					value={franchiseOutlets.length}
					subtitle="Cabang pihak ketiga"
					icon={<Handshake size={24} />}
					variant="primary"
				/>
				<StatCard
					title="Cabang Pusat (HQ)"
					value={hqOutlets.length}
					subtitle="Milik internal grup"
					icon={<Building2 size={24} />}
					variant="default"
				/>
				<StatCard
					title="Royalti Bulan Ini"
					value={formatCompact(totalRoyalty)}
					subtitle={formatIDR(totalRoyalty)}
					icon={<Coins size={24} />}
					variant="success"
					trend={{
						value: `${Math.abs(parseFloat(royaltyGrowth))}%`,
						positive: parseFloat(royaltyGrowth) >= 0,
						label: "vs bln lalu",
					}}
				/>
				<StatCard
					title="Cabang Aktif"
					value={franchiseOutlets.filter((o) => o.is_active).length}
					subtitle="Franchise operasional"
					icon={<Building2 size={24} />}
					variant="warning"
				/>
			</div>

			{/* Franchise Grid */}
			<div className="space-y-8">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
						<Handshake className="text-indigo-600" /> Jaringan Kemitraan
					</h2>
					<Button
						variant="ghost"
						className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600"
					>
						Lihat Semua <ArrowUpRight size={14} className="ml-2" />
					</Button>
				</div>

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
								Portal kemitraan siap untuk onboarding. Tambahkan mitra pertama
								untuk memperluas jangkauan bisnis Anda.
							</p>
						</div>
					}
					renderItem={(outlet) => {
						const royaltyAmount =
							outlet.monthlyRevenue * (outlet.franchise_fee / 100);
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
									<div className="flex items-center gap-3 text-slate-400">
										<Globe size={14} className="text-indigo-400" />
										<p className="text-[10px] font-black uppercase tracking-widest line-clamp-1">
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
											<p className="text-lg font-black text-slate-900">
												{outlet.ordersThisMonth}
											</p>
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
			</div>
		</div>
	);
}
