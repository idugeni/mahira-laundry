import type { Metadata } from "next";
import { OutletModal } from "@/components/shared/outlet-modal";
import { getOutletsWithStats } from "@/lib/supabase/server";
import { formatCompact, formatIDR, cn } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { 
	Building2, 
	CheckCircle2, 
	Users2, 
	Package, 
	MapPin, 
	Phone, 
	Clock, 
	MoreVertical,
	Plus,
	ArrowUpRight,
	TrendingUp,
	Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
	title: "Kelola Outlet",
	description: "Manajemen dan monitoring seluruh outlet Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function OutletPage() {
	const outlets = await getOutletsWithStats();

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50 transition-all duration-1000 group-hover:bg-indigo-100" />
				
				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-50 text-indigo-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Ekosistem Bisnis
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Globe size={14} /> Total {outlets.length} Cabang
							</span>
						</div>
						<h1 className="text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
							Manajemen <span className="text-indigo-600 italic">Outlet</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm lg:text-base max-w-2xl leading-relaxed">
							Monitoring performa, pengelolaan aset, dan ekspansi jaringan bisnis Mahira Laundry secara terpusat dalam satu dashboard eksekutif.
						</p>
					</div>
					
					<OutletModal trigger={
						<Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-10 h-16 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center gap-3">
							<div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
								<Plus size={20} />
							</div>
							Registrasi Outlet
						</Button>
					} />
				</div>
			</div>

			{/* Executive Summary Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total Cabang"
					value={outlets.length}
					subtitle="Seluruh jaringan aktif"
					icon={<Building2 size={24} />}
					variant="default"
				/>
				<StatCard
					title="Cabang Aktif"
					value={outlets.filter((o) => o.is_active).length}
					subtitle="Beroperasi normal"
					icon={<CheckCircle2 size={24} />}
					variant="success"
					trend={{ value: "98%", positive: true, label: "uptime" }}
				/>
				<StatCard
					title="Sistem Franchise"
					value={outlets.filter((o) => o.is_franchise).length}
					subtitle="Partner kemitraan"
					icon={<Users2 size={24} />}
					variant="primary"
				/>
				<StatCard
					title="Volume Transaksi"
					value={formatCompact(outlets.reduce((s, o) => s + (Number(o.ordersThisMonth) || 0), 0))}
					subtitle="Order bulan ini"
					icon={<Package size={24} />}
					variant="warning"
					trend={{ value: "14%", positive: true, label: "vs bln lalu" }}
				/>
			</div>

			{/* Outlet Cards Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{outlets.map((outlet) => (
					<div
						key={outlet.id}
						className="group relative bg-white rounded-[3rem] border border-slate-100 p-8 lg:p-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
					>
						{/* Background Decorative Pattern */}
						<div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
							{outlet.is_franchise ? <Users2 size={120} /> : <Building2 size={120} />}
						</div>

						<div className="relative space-y-8">
							{/* Card Header Section */}
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-5">
									<div className="relative">
										<div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-indigo-50 to-indigo-100/50 overflow-hidden flex items-center justify-center text-indigo-600 font-black text-2xl border-2 border-white shadow-xl transition-transform duration-700 group-hover:scale-105">
											{outlet.image_url ? (
												<img
													src={outlet.image_url}
													alt={outlet.name}
													className="w-full h-full object-cover"
												/>
											) : (
												outlet.name.charAt(0)
											)}
										</div>
										<span className={cn(
											"absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
											outlet.is_active ? "bg-emerald-500" : "bg-rose-500"
										)} />
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
										<Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-indigo-600">
											<MoreVertical size={24} />
										</Button>
									}
								/>
							</div>

							{/* Card Body Stats */}
							<div className="grid grid-cols-3 gap-4">
								<div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all duration-500">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
									<p className="text-xl font-black text-slate-900">{Number(outlet.ordersThisMonth) || 0}</p>
								</div>
								<div className="bg-indigo-50/30 rounded-3xl p-5 border border-indigo-50/50 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-500">
									<p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Revenue</p>
									<p className="text-xl font-black text-indigo-600">{formatCompact(Number(outlet.monthlyRevenue) || 0)}</p>
								</div>
								<div className="bg-amber-50/30 rounded-3xl p-5 border border-amber-50/50 group-hover:bg-white group-hover:border-amber-100 transition-all duration-500">
									<p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{outlet.is_franchise ? "Fee" : "Stock"}</p>
									<p className="text-xl font-black text-amber-600">{outlet.is_franchise ? `${outlet.franchise_fee}%` : "100%"}</p>
								</div>
							</div>

							{/* Contact & Address Footer */}
							<div className="space-y-4 pt-10 border-t border-slate-50">
								<div className="flex items-center gap-4 text-slate-500">
									<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
										<MapPin size={18} />
									</div>
									<p className="text-xs font-bold leading-relaxed line-clamp-1">{outlet.address || "Belum ada alamat"}</p>
								</div>
								
								<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div className="flex items-center gap-6">
										<div className="flex items-center gap-2 text-xs font-bold text-slate-400">
											<Phone size={14} className="text-indigo-400" />
											{outlet.phone || "—"}
										</div>
										<div className="flex items-center gap-2 text-xs font-bold text-slate-400">
											<Clock size={14} className="text-indigo-400" />
											{outlet.operating_hours?.weekday || "07:00-21:00"}
										</div>
									</div>
									
									<Button className="rounded-2xl h-12 px-6 bg-slate-50 hover:bg-slate-900 text-slate-600 hover:text-white font-black text-[10px] uppercase tracking-widest border-none shadow-none group/btn transition-all">
										Buka Dashboard <ArrowUpRight size={14} className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{outlets.length === 0 && (
				<div className="bg-white rounded-[4rem] border border-slate-100 p-24 text-center shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
					<div className="relative flex flex-col items-center">
						<div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-100">
							<Building2 size={48} className="text-slate-200" />
						</div>
						<h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Belum Ada Jaringan</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed">
							Sistem siap untuk diintegrasikan dengan outlet-outlet baru. Silakan klik tombol Registrasi Outlet untuk mulai membangun ekosistem bisnis Anda.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
