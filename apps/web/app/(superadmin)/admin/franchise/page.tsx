import {
	ArrowUpRight,
	Briefcase,
	Building2,
	Coins,
	FileText,
	Globe,
	Handshake,
	Plus,
	ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { MitraModal } from "@/components/shared/admin/mitra/mitra-modal";
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

const sopItems = [
	{ title: "Standar Kebersihan", icon: "🧼", status: "Aktif", version: "v2.1" },
	{ title: "Prosedur Order", icon: "📋", status: "Aktif", version: "v3.0" },
	{ title: "Quality Control", icon: "✅", status: "Aktif", version: "v1.8" },
	{ title: "Handling Complaint", icon: "🗣️", status: "Aktif", version: "v2.3" },
	{
		title: "Prosedur Pembayaran",
		icon: "💳",
		status: "Aktif",
		version: "v1.5",
	},
	{ title: "Onboarding Staf", icon: "👥", status: "Draft", version: "v0.9" },
];

export default async function FranchisePage() {
	const allOutlets = await getOutletsWithStats();
	const franchiseOutlets = allOutlets.filter((o) => o.is_franchise);
	const hqOutlets = allOutlets.filter((o) => !o.is_franchise);

	const totalRoyalty = franchiseOutlets.reduce(
		(sum, o) => sum + o.monthlyRevenue * (o.franchise_fee / 100),
		0,
	);

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-60" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
					<div className="space-y-6">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Strategic Partnership
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Globe size={14} /> Jaringan Franchise Global
							</span>
						</div>
						<h1 className="text-4xl lg:text-7xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
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
							<Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-12 h-20 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/10 flex items-center gap-4">
								<div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
									<Plus size={24} />
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
					trend={{ value: "18%", positive: true, label: "vs bln lalu" }}
				/>
				<StatCard
					title="Standardisasi SOP"
					value={sopItems.filter((s) => s.status === "Aktif").length}
					subtitle="Dokumen aktif"
					icon={<ShieldCheck size={24} />}
					variant="warning"
				/>
			</div>

			{/* Franchise Grid */}
			<div className="space-y-8">
				<div className="flex items-center justify-between">
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

				{franchiseOutlets.length === 0 ? (
					<div className="bg-white rounded-[4rem] border border-slate-100 p-24 text-center shadow-xl shadow-slate-200/40">
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
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{franchiseOutlets.map((outlet) => {
							const royaltyAmount =
								outlet.monthlyRevenue * (outlet.franchise_fee / 100);
							return (
								<div
									key={outlet.id}
									className="group bg-white rounded-[3rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden flex flex-col"
								>
									<div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors pointer-events-none">
										<Briefcase size={80} strokeWidth={4} />
									</div>

									<div className="relative flex items-center justify-between mb-8">
										<div className="flex items-center gap-4">
											<div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl border-2 border-white shadow-lg transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
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
												"w-3 h-3 rounded-full border-2 border-white shadow-sm",
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
										<Button className="rounded-xl h-10 px-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10">
											Audit Mitra
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Digital Assets Section */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
					<div className="relative flex flex-col h-full">
						<div className="flex items-center justify-between mb-10">
							<h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
								<FileText className="text-indigo-400" /> SOP Digital &
								Compliance
							</h2>
							<Button className="bg-indigo-400 hover:bg-white hover:text-slate-900 text-slate-900 rounded-xl px-6 h-12 font-black text-[10px] uppercase tracking-widest transition-all">
								+ Upload SOP
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
							{sopItems.map((sop) => (
								<div
									key={sop.title}
									className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
								>
									<div className="flex items-center gap-4">
										<span className="text-2xl">{sop.icon}</span>
										<div>
											<p className="text-sm font-black uppercase tracking-tight">
												{sop.title}
											</p>
											<p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
												{sop.version}
											</p>
										</div>
									</div>
									<Badge
										className={cn(
											"px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border-none shadow-none",
											sop.status === "Aktif"
												? "bg-emerald-500/20 text-emerald-400"
												: "bg-amber-500/20 text-amber-400",
										)}
									>
										{sop.status}
									</Badge>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="bg-indigo-600 rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden flex flex-col justify-center gap-6">
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
					<div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-2xl rotate-3">
						🏢
					</div>
					<div>
						<h3 className="text-2xl font-black uppercase tracking-tight mb-2">
							Pusat Bantuan Mitra
						</h3>
						<p className="text-indigo-100/70 font-bold text-sm leading-relaxed">
							Semua mitra memiliki akses eksklusif ke tim pendukung operasional
							pusat. Pastikan standardisasi tetap terjaga demi brand identity
							Mahira.
						</p>
					</div>
					<Button className="bg-white text-indigo-600 hover:bg-slate-900 hover:text-white rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-indigo-900/20">
						Hubungi Ops Team
					</Button>
				</div>
			</div>
		</div>
	);
}
