import {
	Banknote,
	ClipboardList,
	CreditCard,
	Package,
	Receipt,
	ShoppingCart,
	Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/utils";
import type { CartItem } from "@/components/kasir/pos-types";

interface PosCartSidebarProps {
	cart: CartItem[];
	total: number;
	loading: boolean;
	onRemoveFromCart: (id: string) => void;
	onCheckout: (paymentMethod: string) => void;
	onPrintReceipt: () => void;
}

export function PosCartSidebar({
	cart,
	total,
	loading,
	onRemoveFromCart,
	onCheckout,
	onPrintReceipt,
}: PosCartSidebarProps) {
	return (
		<div className="md:col-span-4 md:sticky md:top-8 p-4 md:p-0 h-fit">
			<div className="bg-white rounded-2xl md:rounded-[2.5rem] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
				<div className="p-4 md:p-8 border-b border-slate-100 bg-slate-50/30">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
							<ShoppingCart className="w-6 h-6 text-brand-primary" /> Rincian Order
						</h3>
						<div className="px-4 py-1.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">
							{cart.length} Layanan
						</div>
					</div>

					<div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
						<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
							<Receipt className="w-5 h-5" />
						</div>
						<div className="flex flex-col">
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
								Lokasi Transaksi
							</p>
							<p className="text-sm font-black text-slate-900">POS Terminal</p>
						</div>
					</div>
				</div>

				<div className="md:max-h-[40vh] overflow-y-auto px-4 py-4 md:px-8 md:py-6 space-y-3 md:space-y-4 custom-scrollbar">
					{cart.length === 0 ? (
						<div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 opacity-30">
							<Package className="w-20 h-20 mb-6 text-slate-300" />
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
								Keranjang masih kosong
							</p>
						</div>
					) : (
						cart.map((item) => (
							<div
								key={item.id}
								className="group relative bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100 hover:border-brand-primary/30 hover:bg-white hover:shadow-xl transition-all animate-in slide-in-from-right-4"
							>
								<div className="flex justify-between items-start gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<p className="text-sm font-black text-slate-900 truncate">{item.name}</p>
											{item.isManual && (
												<Badge
													variant="secondary"
													className="bg-amber-100 text-amber-600 border-amber-200 uppercase font-black text-[8px] px-2 py-0.5"
												>
													Custom
												</Badge>
											)}
										</div>
										<p className="text-xs font-bold text-slate-400">
											{item.qty} {item.unit} <span className="mx-1 opacity-30">|</span>{" "}
											{formatIDR(item.price)}
										</p>
										{item.notes && (
											<div className="mt-4 bg-white/80 p-3 rounded-xl border border-slate-200/50">
												<p className="text-[9px] text-brand-primary font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
													<ClipboardList className="w-3 h-3" /> Catatan Item
												</p>
												<p className="text-[10px] text-slate-500 italic leading-relaxed line-clamp-2">
													{item.notes}
												</p>
											</div>
										)}
									</div>
									<div className="text-right shrink-0">
										<p className="text-sm font-black text-brand-primary">
											{formatIDR(item.qty * item.price)}
										</p>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => onRemoveFromCart(item.id)}
											className="mt-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xs h-auto w-auto"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				<div className="p-4 md:p-8 bg-slate-50 border-t border-slate-200/50 space-y-4 md:space-y-8">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
								Total Pembayaran
							</span>
							<span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full uppercase italic">
								Nett Amount
							</span>
						</div>
						<div className="flex justify-between items-center bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-inner">
							<span className="text-sm font-black text-slate-900 uppercase tracking-widest opacity-20">
								Rupiah
							</span>
							<span className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
								{formatIDR(total)}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3 md:gap-4">
						<Button
							type="button"
							onClick={() => onCheckout("tunai")}
							disabled={loading || cart.length === 0}
							className="h-auto py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl shadow-emerald-200 flex flex-col items-center gap-3 group border-b-4 border-emerald-800"
						>
							<div className="bg-white/20 p-2.5 rounded-2xl transition-transform">
								<Banknote className="w-8 h-8 text-white" />
							</div>
							BAYAR TUNAI
						</Button>
						<Button
							type="button"
							onClick={() => onCheckout("qris")}
							disabled={loading || cart.length === 0}
							className="h-auto py-6 rounded-[2rem] bg-brand-primary text-white font-black text-sm hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-brand-primary/20 flex flex-col items-center gap-3 group border-b-4 border-brand-primary-dark"
						>
							<div className="bg-white/20 p-2.5 rounded-2xl transition-transform">
								<CreditCard className="w-8 h-8 text-white" />
							</div>
							QRIS / TRANSFER
						</Button>
					</div>

					<Button
						type="button"
						variant="outline"
						onClick={onPrintReceipt}
						disabled={cart.length === 0}
						className="w-full h-12 rounded-xl border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-bold text-xs tracking-wide"
					>
						<Receipt className="w-4 h-4 mr-2" />
						Preview Struk
					</Button>
				</div>
			</div>
		</div>
	);
}
