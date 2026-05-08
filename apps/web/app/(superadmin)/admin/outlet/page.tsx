import { Building2, CreditCard, Globe, Package, Plus, Users2 } from "lucide-react";
import type { Metadata } from "next";
import { OutletGridClient } from "@/components/shared/admin/outlet/outlet-grid-client";
import { OutletModal } from "@/components/shared/admin/outlet/outlet-modal";
import { StatCard } from "@/components/shared/common/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOutletsWithStats } from "@/lib/supabase/server";
import { formatCompact, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Kelola Outlet",
	description: "Manajemen dan monitoring seluruh outlet Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function OutletPage() {
	const outlets = await getOutletsWithStats();

	const totalRevenue = outlets.reduce((s, o) => s + (Number(o.monthlyRevenue) || 0), 0);
	const totalOrders = outlets.reduce((s, o) => s + (Number(o.ordersThisMonth) || 0), 0);
	const totalLastMonthRevenue = outlets.reduce((s, o) => s + (Number(o.lastMonthRevenue) || 0), 0);
	const revenueGrowth =
		totalLastMonthRevenue > 0
			? (((totalRevenue - totalLastMonthRevenue) / totalLastMonthRevenue) * 100).toFixed(1)
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
							Monitoring performa, pengelolaan aset, dan ekspansi jaringan bisnis Mahira Laundry
							secara terpusat dalam satu dashboard eksekutif.
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
			<OutletGridClient outlets={outlets} />
		</div>
	);
}
