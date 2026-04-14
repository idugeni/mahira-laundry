import {
	AlertTriangle,
	ArrowUpRight,
	CheckCircle2,
	Filter,
	History,
	MoreVertical,
	Package,
	Search,
} from "lucide-react";
import type { Metadata } from "next";
import { InventoryModal } from "@/components/shared/admin/inventory/inventory-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllInventory, getUserProfile } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Inventori",
	description: "Kelola inventori dan stok barang operasional Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function InventoriPage() {
	const [profile, items] = await Promise.all([
		getUserProfile(),
		getAllInventory(),
	]);

	const outletId = profile?.outlet_id || "";

	return (
		<div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* Premium Header Container */}
			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100 font-bold">
							<Package size={20} />
						</div>
						<h1 className="text-4xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight uppercase">
							Stok <span className="text-amber-600">Gudang</span>
						</h1>
					</div>
					<p className="text-slate-400 font-bold text-sm tracking-wide uppercase">
						Mengelola <span className="text-slate-900">{items.length}</span>{" "}
						kategori persediaan operasional outlet
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<div className="relative group">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
						<Input
							className="pl-11 pr-4 py-6 w-[300px] bg-white rounded-2xl border-slate-100 shadow-sm focus:ring-4 focus:ring-amber-500/5 transition-all font-bold text-sm"
							placeholder="Cari item inventori..."
						/>
					</div>
					<InventoryModal outletId={outletId} />
				</div>
			</div>

			{items.length === 0 ? (
				<div className="bg-white rounded-[3rem] border border-slate-100 p-24 text-center shadow-xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
					<div className="relative">
						<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-100 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
							<Package size={40} className="text-slate-200" />
						</div>
						<h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
							Gudang Kosong
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-3 max-w-md mx-auto leading-relaxed">
							Mulai tambahkan barang persediaan Anda untuk melacak penggunaan
							operasional laundry.
						</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{items.map((item) => {
						const qty = Number(item.quantity) || 0;
						const min = Number(item.min_stock) || 0;
						const isLow = qty <= min;

						return (
							<div
								key={item.id}
								className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col gap-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 relative overflow-hidden h-full"
							>
								{/* Visual Highlight */}
								<div
									className={cn(
										"absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700",
										isLow ? "bg-rose-500" : "bg-emerald-500",
									)}
								/>

								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div
											className={cn(
												"w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg transition-transform duration-500 group-hover:scale-110",
												isLow
													? "bg-rose-50 text-rose-500"
													: "bg-emerald-50 text-emerald-500",
											)}
										>
											{isLow ? (
												<AlertTriangle size={24} />
											) : (
												<CheckCircle2 size={24} />
											)}
										</div>
										<div className="min-w-0">
											<h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate pr-4">
												{item.name}
											</h3>
											<span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
												{item.sku || "Tanpa SKU"}
											</span>
										</div>
									</div>
									<button
										type="button"
										className="w-10 h-10 p-0 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-slate-600 transition-colors"
									>
										<MoreVertical size={20} />
									</button>
								</div>

								<div className="flex-1 space-y-6">
									<div className="flex items-end justify-between px-2">
										<div className="space-y-1">
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
												Sisa Stok
											</p>
											<div className="flex items-baseline gap-2">
												<span
													className={cn(
														"text-4xl font-black tracking-tighter",
														isLow ? "text-rose-500" : "text-slate-900",
													)}
												>
													{qty}
												</span>
												<span className="text-xs font-bold text-slate-400 uppercase">
													{item.unit}
												</span>
											</div>
										</div>
										<div className="text-right">
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
												Status
											</p>
											<Badge
												className={cn(
													"px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none transition-transform duration-300",
													isLow
														? "bg-rose-50 text-rose-600 animate-pulse"
														: "bg-emerald-50 text-emerald-600",
												)}
											>
												{isLow ? "Stok Kritis" : "Tersedia"}
											</Badge>
										</div>
									</div>

									{/* Progress Bar Visual */}
									<div className="space-y-2 px-1">
										<div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
											<span>Level Persediaan</span>
											<span>
												Min: {min} {item.unit}
											</span>
										</div>
										<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-1000",
													isLow ? "bg-rose-500" : "bg-emerald-500",
												)}
												style={{
													width: `${Math.min(100, Math.max(10, (qty / (min * 1.5)) * 100))}%`,
												}}
											/>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 mt-2 relative">
									<InventoryModal
										item={item}
										outletId={outletId}
										mode="restock"
										trigger={
											<Button
												type="button"
												className="w-full rounded-2xl h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 group/btn"
											>
												Restock Item{" "}
												<ArrowUpRight
													size={14}
													className="ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
												/>
											</Button>
										}
									/>
									<InventoryModal
										item={item}
										outletId={outletId}
										mode="edit"
										trigger={
											<Button
												type="button"
												variant="outline"
												className="w-full rounded-2xl h-14 bg-white border-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all"
											>
												Lihat Sejarah
											</Button>
										}
									/>
								</div>

								{item.notes && (
									<div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-slate-100 transition-colors">
										<p className="text-[11px] font-medium text-slate-500 leading-relaxed italic line-clamp-2">
											"{item.notes}"
										</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
