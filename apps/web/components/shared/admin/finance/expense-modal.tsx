"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineBanknotes,
	HiOutlineChatBubbleBottomCenterText,
	HiOutlineTag,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { addExpense } from "@/lib/actions/expenses";

const CATEGORIES = [
	{ id: "ops", label: "Operasional (Sabun, Plastik)" },
	{ id: "utility", label: "Utilitas (Listrik, Air, Gas)" },
	{ id: "rent", label: "Sewa Tempat" },
	{ id: "salary", label: "Gaji Tambahan / Bonus" },
	{ id: "marketing", label: "Marketing / Iklan" },
	{ id: "other", label: "Lain-lain" },
];

export function ExpenseModal({
	outletId,
	trigger,
}: {
	outletId: string;
	trigger?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [category, setCategory] = useState(CATEGORIES[0].id);

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			outlet_id: outletId,
			category: formData.get("category") as string,
			amount: Number(formData.get("amount")),
			notes: formData.get("notes") as string,
		};

		const result = await addExpense(data);

		if (result.success) {
			toast.success("Pengeluaran berhasil dicatat!");
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal mencatat pengeluaran");
		}
		setIsLoading(false);
	}

	return (
		<>
			<div onClick={() => setIsOpen(true)}>
				{trigger || (
					<button
						type="button"
						className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-100 hover:shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
					>
						<HiOutlineBanknotes size={18} />
						<span>Input Pengeluaran</span>
					</button>
				)}
			</div>

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<div
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
							onClick={() => !isLoading && setIsOpen(false)}
						/>

						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in border border-white/20 text-left">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
								<div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-500">
											<HiOutlineBanknotes size={24} />
										</div>
										<div>
											<h2 className="text-xl font-black text-slate-900 tracking-tight">
												Catat <span className="text-rose-600">Pengeluaran</span>
											</h2>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
												Operasional & Biaya Lainnya
											</p>
										</div>
									</div>
									<button
										onClick={() => setIsOpen(false)}
										className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
									>
										<HiOutlineXMark size={16} />
									</button>
								</div>
							</div>

							{/* Content Area */}
							<form onSubmit={handleSubmit} className="p-8 space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
											Kategori Biaya
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-rose-600 transition-colors z-10">
												<HiOutlineTag />
											</span>
											<input type="hidden" name="category" value={category} />
											<Select value={category} onValueChange={setCategory}>
												<SelectTrigger className="w-full pl-12 pr-6 h-[54px] bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-rose-500/20 transition-all">
													<SelectValue placeholder="Pilih Kategori" />
												</SelectTrigger>
												<SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
													{CATEGORIES.map((cat) => (
														<SelectItem
															key={cat.id}
															value={cat.id}
															className="font-bold py-3"
														>
															{cat.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
											Nominal (Rp)
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 group-focus-within/input:text-rose-600 transition-colors">
												Rp
											</span>
											<input
												required
												type="number"
												name="amount"
												placeholder="0"
												className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-black outline-none ring-0 focus:border-rose-500 focus:bg-white transition-all"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
											Keterangan / Deskripsi
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-rose-600 transition-colors">
												<HiOutlineChatBubbleBottomCenterText />
											</span>
											<textarea
												required
												name="notes"
												placeholder="Contoh: Pembelian deterjen 10 liter"
												className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none min-h-[100px] ring-0 focus:border-rose-500 focus:bg-white transition-all resize-none"
											/>
										</div>
									</div>
								</div>

								{/* Action */}
								<button
									type="submit"
									disabled={isLoading}
									className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
								>
									{isLoading ? (
										<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										<>
											<HiOutlineBanknotes size={20} />
											<span>Simpan Pengeluaran</span>
										</>
									)}
								</button>
							</form>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
