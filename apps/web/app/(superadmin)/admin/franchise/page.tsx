import type { Metadata } from "next";
import { MitraModal } from "@/components/shared/mitra-modal";
import { getOutletsWithStats } from "@/lib/supabase/server";
import { formatCompact, formatIDR } from "@/lib/utils";

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
		<div className="space-y-8 animate-fade-in-up">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
						Franchise Portal
					</h1>
					<p className="text-slate-500 mt-1 text-sm">
						Kelola mitra franchise, pantau royalti, dan distribusikan SOP
						digital.
					</p>
				</div>
				<MitraModal />
			</div>

			{/* Summary Row */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				{[
					{
						label: "Mitra Franchise",
						value: franchiseOutlets.length,
						icon: "🤝",
						color: "text-indigo-700",
						bg: "bg-indigo-50",
					},
					{
						label: "Cabang HQ",
						value: hqOutlets.length,
						icon: "🏢",
						color: "text-slate-900",
						bg: "bg-slate-50",
					},
					{
						label: "Royalti Bln Ini",
						value: formatCompact(totalRoyalty),
						icon: "💰",
						color: "text-emerald-700",
						bg: "bg-emerald-50",
					},
					{
						label: "SOP Aktif",
						value: sopItems.filter((s) => s.status === "Aktif").length,
						icon: "📄",
						color: "text-violet-700",
						bg: "bg-violet-50",
					},
				].map((s) => (
					<div
						key={s.label}
						className={`${s.bg} rounded-2xl p-4 border border-slate-200/60`}
					>
						<div className="flex items-center gap-2 mb-1">
							<span className="text-lg">{s.icon}</span>
							<span className="text-xs font-semibold text-slate-500">
								{s.label}
							</span>
						</div>
						<p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
					</div>
				))}
			</div>

			{/* Franchise Cards */}
			<div>
				<h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
					🤝 Cabang Franchise
				</h2>
				{franchiseOutlets.length === 0 ? (
					<div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 flex flex-col items-center text-center text-slate-400">
						<span className="text-5xl mb-4">🤝</span>
						<p className="font-semibold text-slate-600">
							Belum ada mitra franchise
						</p>
						<p className="text-sm mt-1">
							Hubungi tim sales untuk onboarding mitra pertama.
						</p>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
						{franchiseOutlets.map((outlet) => {
							const royaltyAmount =
								outlet.monthlyRevenue * (outlet.franchise_fee / 100);
							return (
								<div
									key={outlet.id}
									className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
								>
									<div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-sm">
													{outlet.name.charAt(0)}
												</div>
												<div>
													<h3 className="font-bold text-slate-900 text-sm">
														{outlet.name}
													</h3>
													<p className="text-xs text-indigo-500">
														Fee {outlet.franchise_fee}%
													</p>
												</div>
											</div>
											<span
												className={`text-xs font-semibold px-2 py-0.5 rounded-full ${outlet.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
											>
												{outlet.is_active ? "Aktif" : "Nonaktif"}
											</span>
										</div>
									</div>
									<div className="px-5 py-4 space-y-3">
										<p className="text-xs text-slate-500 flex items-start gap-1.5">
											<span>📍</span> {outlet.address || "—"}
										</p>
										<div className="grid grid-cols-2 gap-3">
											<div className="text-center p-2.5 bg-slate-50 rounded-xl">
												<p className="text-sm font-black text-slate-900">
													{outlet.ordersThisMonth}
												</p>
												<p className="text-[10px] text-slate-400">
													Order Bln Ini
												</p>
											</div>
											<div className="text-center p-2.5 bg-indigo-50 rounded-xl">
												<p className="text-sm font-black text-indigo-600">
													{formatCompact(royaltyAmount)}
												</p>
												<p className="text-[10px] text-slate-400">Royalti</p>
											</div>
										</div>
										<div className="text-xs text-slate-500 flex items-center justify-between">
											<span>
												Revenue:{" "}
												<span className="font-semibold text-slate-700">
													{formatIDR(outlet.monthlyRevenue)}
												</span>
											</span>
											<button
												type="button"
												className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs"
											>
												Detail →
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* SOP Digital */}
			<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
				<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
					<div>
						<h2 className="text-base font-bold text-slate-900">SOP Digital</h2>
						<p className="text-xs text-slate-400 mt-0.5">
							Standar operasional yang berlaku di semua cabang
						</p>
					</div>
					<button
						type="button"
						className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
					>
						+ Upload SOP
					</button>
				</div>
				<div className="divide-y divide-slate-100">
					{sopItems.map((sop) => (
						<div
							key={sop.title}
							className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
						>
							<div className="flex items-center gap-3">
								<span className="text-xl">{sop.icon}</span>
								<div>
									<p className="text-sm font-semibold text-slate-800">
										{sop.title}
									</p>
									<p className="text-xs text-slate-400">{sop.version}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<span
									className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${sop.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
								>
									{sop.status}
								</span>
								<button
									type="button"
									className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
								>
									Lihat
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
