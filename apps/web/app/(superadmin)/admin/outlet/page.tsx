import {
	Building2,
	Clock,
	CreditCard,
	Edit3,
	Globe,
	MapPin,
	Package,
	Phone,
	Plus,
	Users2,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { OutletModal } from "@/components/shared/admin/outlet/outlet-modal";
import { PaginatedGrid } from "@/components/shared/common/paginated-grid";
import { StatCard } from "@/components/shared/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOutletsWithStats } from "@/lib/supabase/server";
import { cn, formatCompact, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Kelola Outlet",
	description: "Manajemen dan monitoring seluruh outlet Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function OutletPage() {
	const outlets = await getOutletsWithStats();

	const totalRevenue = outlets.reduce(
		(s, o) => s + (Number(o.monthlyRevenue) || 0),
		0,
	);
	const totalOrders = outlets.reduce(
		(s, o) => s + (Number(o.ordersThisMonth) || 0),
		0,
	);
	const totalLastMonthRevenue = outlets.reduce(
		(s, o) => s + (Number(o.lastMonthRevenue) || 0),
		0,
	);
	const revenueGrowth =
		totalLastMonthRevenue > 0
			? (
					((totalRevenue - totalLastMonthRevenue) / totalLastMonthRevenue) *
					100
				).toFixed(1)
			: totalRevenue > 0
				? "100.0"
				: "0.0";

	return (
		<div className="space-y-8 sm:space-y-10  animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge
								variant="outline"
								className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
							>
								Ekosistem Bisnis
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Globe size={14} /> Total {outlets.length} Cabang
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight text-slate-900">
							Manajemen <span className="text-indigo-600 italic">Outlet</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Monitoring performa, pengelolaan aset, dan ekspansi jaringan
							bisnis Mahira Laundry secara terpusat dalam satu dashboard
							eksekutif.
						</p>
					</div>

					<OutletModal
						trigger={
							<Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 flex items-center gap-2.5">
								<div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
									<Plus size={17} />
								</div>
								Registrasi Outlet
							</Button>
						}
					/>
				</div>
			</div>

			{/* Executive Summary Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Omset Jaringan"
					value={formatCompact(totalRevenue)}
					subtitle={formatIDR(totalRevenue)}
					icon={<CreditCard size={24} />}
					variant="success"
					trend={{
						value: `${Math.abs(parseFloat(revenueGrowth))}%`,
						positive: parseFloat(revenueGrowth) >= 0,
						label: "vs bln lalu",
					}}
				/>
				<StatCard
					title="Total Pesanan"
					value={totalOrders}
					subtitle="Seluruh cabang bln ini"
					icon={<Package size={24} />}
					variant="warning"
				/>
				<StatCard
					title="Cabang Aktif"
					value={outlets.filter((o) => o.is_active).length}
					subtitle={`${outlets.length} terdaftar`}
					icon={<Building2 size={24} />}
					variant="primary"
				/>
				<StatCard
					title="Cabang Franchise"
					value={outlets.filter((o) => o.is_franchise).length}
					subtitle={`${outlets.filter((o) => o.is_franchise && o.is_active).length} aktif`}
					icon={<Users2 size={24} />}
					variant="default"
				/>
			</div>

			{/* Outlet Cards Grid */}
			<PaginatedGrid
				items={outlets}
				defaultPageSize={8}
				pageSizeOptions={[8, 16, 32]}
				gridClassName="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
				renderItem={(outlet) => (
					<div className="group relative bg-white rounded-none sm:rounded-2xl border-y sm:border border-slate-100 p-6 shadow-lg shadow-slate-200/35 hover:shadow-xl hover:shadow-indigo-500/10 transition-[box-shadow,border-color] duration-300 overflow-hidden">
						{/* Background Decorative Pattern */}
						<div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
							{outlet.is_franchise ? (
								<Users2 size={120} />
							) : (
								<Building2 size={120} />
							)}
						</div>

						<div className="relative space-y-6">
							{/* Card Header Section */}
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-4">
									<div className="relative">
										<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 overflow-hidden flex items-center justify-center text-indigo-600 font-black text-xl border-2 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-0.5">
											{outlet.image_url ? (
												<Image
													src={outlet.image_url}
													alt={outlet.name}
													width={80}
													height={80}
													className="w-full h-full object-cover"
												/>
											) : (
												outlet.name.charAt(0)
											)}
										</div>
										<span
											className={cn(
												"absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-xs flex items-center justify-center",
												outlet.is_active ? "bg-emerald-500" : "bg-rose-500",
											)}
										/>
									</div>
									<div className="min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight truncate">
												{outlet.name}
											</h3>
											{outlet.is_franchise && (
												<Badge className="bg-amber-50 text-amber-600 border-none text-[8px] font-black uppercase tracking-widest px-2">
													Franchise
												</Badge>
											)}
										</div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
											<MapPin size={12} className="text-indigo-400" />
											{outlet.slug}
										</p>
									</div>
								</div>

								<OutletModal
									outlet={outlet}
									trigger={
										<Button
											variant="outline"
											className="rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-widest border-slate-100 hover:bg-slate-50 flex items-center gap-2"
										>
											<Edit3 size={16} /> Ubah Info
										</Button>
									}
								/>
							</div>

							{/* Card Body Stats */}
							<div className="grid grid-cols-3 gap-4">
								<div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-colors duration-300">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
										Orders
									</p>
									<p className="text-xl font-black text-slate-900">
										{Number(outlet.ordersThisMonth) || 0}
									</p>
								</div>
								<div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50/50 group-hover:bg-white group-hover:border-indigo-100 transition-colors duration-300">
									<p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
										Revenue
									</p>
									<p className="text-xl font-black text-indigo-600">
										{formatCompact(Number(outlet.monthlyRevenue) || 0)}
									</p>
								</div>
								<div className="bg-amber-50/30 rounded-2xl p-4 border border-amber-50/50 group-hover:bg-white group-hover:border-amber-100 transition-colors duration-300">
									<p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
										{outlet.is_franchise ? "Fee" : "Stock"}
									</p>
									<p className="text-xl font-black text-amber-600">
										{outlet.is_franchise ? `${outlet.franchise_fee}%` : "N/A"}
									</p>
								</div>
							</div>

							{/* Contact & Address Footer */}
							<div className="space-y-4 pt-6 border-t border-slate-50">
								<div className="flex items-center gap-4 text-slate-500">
									<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
										<MapPin size={18} />
									</div>
									<p className="text-xs font-bold leading-relaxed line-clamp-1">
										{outlet.address || "Belum ada alamat"}
									</p>
								</div>

								<div className="flex items-center gap-6">
									<div className="flex items-center gap-2 text-xs font-bold text-slate-400">
										<Phone size={14} className="text-indigo-400" />
										{outlet.phone || "—"}
									</div>
									<div className="flex items-center gap-2 text-xs font-bold text-slate-400">
										<Clock size={14} className="text-indigo-400" />
										{outlet.operating_hours?.weekday || "Belum diatur"}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				emptyState={
					<div className="bg-white rounded-2xl border border-slate-100 p-10 sm:p-14 text-center shadow-lg shadow-slate-200/40 relative overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
						<div className="relative flex flex-col items-center">
							<div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-100">
								<Building2 size={48} className="text-slate-200" />
							</div>
							<h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
								Belum Ada Jaringan
							</h3>
							<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed">
								Sistem siap untuk diintegrasikan dengan outlet-outlet baru.
								Silakan klik tombol Registrasi Outlet untuk mulai membangun
								ekosistem bisnis Anda.
							</p>
						</div>
					</div>
				}
			/>
		</div>
	);
}
