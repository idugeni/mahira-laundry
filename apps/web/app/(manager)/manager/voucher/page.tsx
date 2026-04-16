import type { Metadata } from "next";
import { getAllVouchers } from "@/lib/supabase/server";
import { formatDate, formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Kelola Voucher",
	description: "Buat dan kelola voucher diskon untuk pelanggan Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function VoucherPage() {
	const vouchers = await getAllVouchers();

	return (
		<div className="space-y-8 animate-fade-in-up">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
						Voucher & Promo
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Ada {vouchers.length} voucher terdaftar untuk cabang ini.
					</p>
				</div>
				<button
					type="button"
					className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-sm shadow-pink-500/20 hover:scale-[1.02] hover:shadow-md transition-all"
				>
					+ Buat Voucher
				</button>
			</div>

			{vouchers.length === 0 ? (
				<div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
					<div className="text-4xl mb-4">🎟️</div>
					<h3 className="text-lg font-bold text-slate-700">Belum ada promo</h3>
					<p className="text-slate-500 text-sm mt-1">
						Buat voucher diskon pertama untuk menarik lebih banyak pelanggan.
					</p>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{vouchers.map((v) => {
						const isPercentage = v.type === "percentage";
						const isFreeDelivery = v.type === "free_delivery";
						const displayValue = isPercentage
							? `${Number(v.value)}%`
							: isFreeDelivery
								? "Gratis Ongkir"
								: formatIDR(Number(v.value));

						const used = v.used_count || 0;
						const limit = v.usage_limit || "∞";

						// Check if expired
						const isExpired = new Date(v.valid_until).getTime() < Date.now();
						const isActive = v.is_active && !isExpired;

						return (
							<div
								key={v.id}
								className="bg-white rounded-2xl border border-slate-200/80 p-0 overflow-hidden shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col"
							>
								{/* Card Header (Ticket style edge) */}
								<div
									className={`px-5 py-4 flex items-center justify-between border-b-2 border-dashed ${isActive ? "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-100" : "bg-slate-50 border-slate-200"}`}
								>
									<span
										className={`font-mono text-lg font-black tracking-widest ${isActive ? "text-pink-600" : "text-slate-500"}`}
									>
										{v.code}
									</span>
									<span
										className={`text-xs px-2.5 py-1 rounded-full font-bold ${
											isActive
												? "bg-brand-primary/10 text-brand-primary"
												: "bg-slate-200 text-slate-600"
										}`}
									>
										{displayValue}
									</span>
								</div>

								{/* Card Body */}
								<div className="p-5 flex-1 flex flex-col">
									<p className="text-sm font-semibold text-slate-700 mb-1 line-clamp-2">
										{v.description || "Tidak ada deskripsi"}
									</p>

									{Number(v.min_order) > 0 && (
										<p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-4">
											Min. Order {formatIDR(Number(v.min_order))}
										</p>
									)}

									<div className="mt-auto pt-4 flex flex-col gap-2">
										<div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
											<div
												className={`h-1.5 rounded-full ${isActive ? "bg-pink-500" : "bg-slate-300"}`}
												style={{
													width:
														limit !== "∞"
															? `${Math.min((used / Number(limit)) * 100, 100)}%`
															: "0%",
												}}
											/>
										</div>
										<div className="flex items-center justify-between text-xs font-medium">
											<span className="text-slate-500">
												Digunakan:{" "}
												<strong
													className={
														isActive ? "text-slate-900" : "text-slate-700"
													}
												>
													{used}
												</strong>{" "}
												/ {limit}
											</span>
											<span
												className={
													isActive ? "text-emerald-600" : "text-red-500"
												}
											>
												{isActive
													? "Aktif"
													: isExpired
														? "Kedaluwarsa"
														: "Nonaktif"}
											</span>
										</div>
									</div>
								</div>

								{/* Card Footer */}
								<div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
									<span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
										S.d. {formatDate(v.valid_until)}
									</span>
									<button
										type="button"
										className="text-xs font-bold text-brand-primary hover:text-pink-700 transition-colors"
									>
										Edit Kupon
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
