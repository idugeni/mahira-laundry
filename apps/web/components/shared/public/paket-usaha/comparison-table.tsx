"use client";

import { motion } from "motion/react";
import { HiOutlineSparkles } from "react-icons/hi2";
import type { BusinessPackage } from "@/lib/types";

interface ComparisonTableProps {
	packages: BusinessPackage[];
}

const tierColors: Record<
	string,
	{
		bg: string;
		headerBg: string;
		headerText: string;
		mobileBg: string;
		border: string;
	}
> = {
	Starter: {
		bg: "bg-blue-50",
		headerBg: "bg-blue-600",
		headerText: "text-white",
		mobileBg: "bg-blue-50",
		border: "border-blue-100",
	},
	Standard: {
		bg: "bg-emerald-50",
		headerBg: "bg-emerald-600",
		headerText: "text-white",
		mobileBg: "bg-emerald-50",
		border: "border-emerald-100",
	},
	Premium: {
		bg: "bg-purple-50",
		headerBg: "bg-purple-600",
		headerText: "text-white",
		mobileBg: "bg-purple-50",
		border: "border-purple-100",
	},
	Custom: {
		bg: "bg-orange-50",
		headerBg: "bg-orange-600",
		headerText: "text-white",
		mobileBg: "bg-orange-50",
		border: "border-orange-100",
	},
};

const defaultTierColor = {
	bg: "bg-slate-50",
	headerBg: "bg-slate-700",
	headerText: "text-white",
	mobileBg: "bg-slate-50",
	border: "border-slate-100",
};

const formatIDR = (amount: number) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(amount);

function isPromoActive(pkg: BusinessPackage): boolean {
	return (
		pkg.promo_price != null &&
		pkg.promo_expires_at != null &&
		new Date(pkg.promo_expires_at) > new Date()
	);
}

function getEffectivePrice(pkg: BusinessPackage): number {
	return isPromoActive(pkg) ? (pkg.promo_price as number) : pkg.price;
}

const rows: {
	label: string;
	getValue: (pkg: BusinessPackage) => React.ReactNode;
}[] = [
	{
		label: "Tier Level",
		getValue: (pkg) => (
			<span className="inline-flex items-center gap-2">
				{pkg.tier === "Premium" && (
					<span className="text-brand-accent text-[10px]">👑</span>
				)}
				{pkg.tier}
			</span>
		),
	},
	{
		label: "Investasi",
		getValue: (pkg) => (
			<div className="flex flex-col items-center">
				<span
					className={`font-black ${isPromoActive(pkg) ? "text-brand-primary" : "text-slate-900"}`}
				>
					{formatIDR(getEffectivePrice(pkg))}
				</span>
				{isPromoActive(pkg) && (
					<span className="text-[8px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-1 mt-1">
						<HiOutlineSparkles size={8} /> Promo Aktif
					</span>
				)}
			</div>
		),
	},
	{
		label: "Fasilitas Item",
		getValue: (pkg) => `${pkg.items.length} Peralatan Lengkap`,
	},
	{
		label: "Masa Training",
		getValue: (pkg) =>
			pkg.training_duration_days
				? `${pkg.training_duration_days} Hari Intensif`
				: "-",
	},
	{
		label: "Dukungan Support",
		getValue: (pkg) => pkg.support_coverage ?? "-",
	},
	{
		label: "Proyeksi ROI",
		getValue: (pkg) => pkg.estimated_roi ?? "-",
	},
];

export default function ComparisonTable({ packages }: ComparisonTableProps) {
	if (packages.length === 0) return null;

	return (
		<div className="w-full">
			{/* Desktop View: Ultra Premium Table */}
			<div className="hidden md:block overflow-hidden bg-white">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="bg-slate-900">
							<th className="px-10 py-8 text-left font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">
								Analisis Komparasi
							</th>
							{packages.map((pkg) => {
								const color = tierColors[pkg.tier] ?? defaultTierColor;
								return (
									<th
										key={pkg.id}
										className={`px-10 py-8 text-center font-black uppercase tracking-[0.2em] text-xs ${color.headerBg} ${color.headerText}`}
									>
										{pkg.name}
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50">
						{rows.map((row, i) => (
							<motion.tr
								key={row.label}
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.05 }}
								viewport={{ once: true }}
								className="group hover:bg-slate-50 transition-colors"
							>
								<td className="px-10 py-6 font-bold text-slate-400 group-hover:text-slate-900 transition-colors bg-slate-50/30 group-hover:bg-white border-r border-slate-50 text-[11px] uppercase tracking-widest">
									{row.label}
								</td>
								{packages.map((pkg) => {
									const color = tierColors[pkg.tier] ?? defaultTierColor;
									return (
										<td
											key={pkg.id}
											className={`px-10 py-6 text-center font-black text-slate-900 text-sm ${color.bg} border-l ${color.border}`}
										>
											{row.getValue(pkg)}
										</td>
									);
								})}
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile View: Seamless Cohesive List */}
			<div className="md:hidden">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden"
				>
					{rows.map((row, i) => (
						<div
							key={row.label}
							className={`p-8 ${i !== rows.length - 1 ? "border-b border-slate-50" : ""}`}
						>
							<p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 text-center italic opacity-60">
								{row.label}
							</p>
							<div className="grid grid-cols-3 gap-3">
								{packages.map((pkg, idx) => {
									const color = tierColors[pkg.tier] ?? defaultTierColor;
									return (
										<div
											key={pkg.id}
											className={`flex flex-col items-center text-center px-3 py-2 rounded-xl ${color.mobileBg} ${idx !== packages.length - 1 ? "" : ""}`}
										>
											<span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 truncate w-full">
												{pkg.name.split(" ")[0]}
											</span>
											<div className="text-[10px] font-black text-slate-900 leading-tight">
												{row.getValue(pkg)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</motion.div>
			</div>
		</div>
	);
}
