"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineBanknotes,
	HiOutlineBuildingOffice2,
	HiOutlineCalendar,
	HiOutlineChatBubbleBottomCenterText,
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
import { recordIncome } from "@/lib/actions/finance";

interface Outlet {
	id: string;
	name: string;
}

export function IncomeModal({
	outlets,
	trigger,
}: {
	outlets: Outlet[];
	trigger?: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [outletId, setOutletId] = useState(outlets[0]?.id ?? "");

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			amount: Number(formData.get("amount")),
			description: formData.get("description") as string,
			outletId,
			date: formData.get("date") as string,
		};

		const result = await recordIncome(data);

		if (result.success) {
			toast.success("Pemasukan berhasil dicatat!");
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal mencatat pemasukan");
		}
		setIsLoading(false);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="contents"
			>
				{trigger || (
					<span className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
						<HiOutlineBanknotes size={18} />
						<span>Input Pemasukan</span>
					</span>
				)}
			</button>

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							aria-label="Tutup modal"
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in cursor-default"
							onClick={() => !isLoading && setIsOpen(false)}
						/>

						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in border border-white/20 text-left">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
								<div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500">
											<HiOutlineBanknotes size={24} />
										</div>
										<div>
											<h2 className="text-xl font-black text-slate-900 tracking-tight">
												Tambah{" "}
												<span className="text-emerald-600">Pemasukan</span>
											</h2>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
												Catat Pendapatan & Pemasukan
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
									>
										<HiOutlineXMark size={16} />
									</button>
								</div>
							</div>

							{/* Form */}
							<form onSubmit={handleSubmit} className="p-8 space-y-6">
								<div className="space-y-4">
									{/* Amount */}
									<div className="space-y-2">
										<label
											htmlFor="income-amount"
											className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
										>
											Nominal (Rp)
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">
												Rp
											</span>
											<input
												required
												id="income-amount"
												type="number"
												name="amount"
												min="1"
												placeholder="0"
												className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-black outline-none ring-0 focus:border-emerald-500 focus:bg-white transition-all"
											/>
										</div>
									</div>

									{/* Description */}
									<div className="space-y-2">
										<label
											htmlFor="income-description"
											className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
										>
											Deskripsi
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">
												<HiOutlineChatBubbleBottomCenterText />
											</span>
											<textarea
												required
												id="income-description"
												name="description"
												placeholder="Contoh: Pembayaran royalti cabang Sudirman"
												className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none min-h-[90px] ring-0 focus:border-emerald-500 focus:bg-white transition-all resize-none"
											/>
										</div>
									</div>

									{/* Outlet */}
									<div className="space-y-2">
										<label
											htmlFor="income-outlet"
											className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
										>
											Outlet / Cabang
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-600 transition-colors z-10">
												<HiOutlineBuildingOffice2 />
											</span>
											<Select value={outletId} onValueChange={setOutletId}>
												<SelectTrigger
													id="income-outlet"
													className="w-full pl-12 pr-6 h-[54px] bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-emerald-500/20 transition-all"
												>
													<SelectValue placeholder="Pilih Outlet" />
												</SelectTrigger>
												<SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
													{outlets.map((outlet) => (
														<SelectItem
															key={outlet.id}
															value={outlet.id}
															className="font-bold py-3"
														>
															{outlet.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Date */}
									<div className="space-y-2">
										<label
											htmlFor="income-date"
											className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
										>
											Tanggal
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-600 transition-colors">
												<HiOutlineCalendar />
											</span>
											<input
												required
												id="income-date"
												type="date"
												name="date"
												defaultValue={new Date().toISOString().split("T")[0]}
												className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-emerald-500 focus:bg-white transition-all"
											/>
										</div>
									</div>
								</div>

								{/* Submit */}
								<button
									type="submit"
									disabled={isLoading}
									className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
								>
									{isLoading ? (
										<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										<>
											<HiOutlineBanknotes size={20} />
											<span>Simpan Pemasukan</span>
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
