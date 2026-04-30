"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineArchiveBoxArrowDown,
	HiOutlineCube,
	HiOutlinePencilSquare,
	HiOutlineQrCode,
	HiOutlineSquares2X2,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import type { InventoryInput } from "@/lib/actions/inventory";
import { restockInventory, upsertInventory } from "@/lib/actions/inventory";
import type { ActionResponse } from "@/lib/types";

interface InventoryModalProps {
	item?: InventoryInput & { id: string };
	outletId: string;
	mode?: "edit" | "restock" | "create";
	trigger?: React.ReactNode;
}

export function InventoryModal({
	item,
	outletId,
	mode = "create",
	trigger,
}: InventoryModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);

		let result: ActionResponse;
		if (mode === "restock") {
			const amount = Number(formData.get("restock_amount"));
			result = await restockInventory(item?.id ?? "", amount);
		} else {
			const data = {
				id: item?.id,
				outlet_id: outletId,
				name: formData.get("name") as string,
				sku: formData.get("sku") as string,
				category: formData.get("category") as string,
				quantity: Number(formData.get("quantity")),
				min_stock: Number(formData.get("min_stock")),
				unit: formData.get("unit") as string,
				notes: formData.get("notes") as string,
			};
			result = await upsertInventory(data);
		}

		if (result.success) {
			toast.success(
				mode === "restock"
					? "Stok berhasil ditambahkan"
					: mode === "edit"
						? "Item diperbarui"
						: "Item ditambahkan",
			);
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal menyimpan data");
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
					<span className="inline-flex h-10 cursor-pointer items-center rounded-xl bg-brand-primary px-4 text-sm font-black text-white shadow-md shadow-brand-primary/20 transition-colors hover:bg-brand-primary/90">
						+ Tambah Item
					</span>
				)}
			</button>

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in cursor-default"
							onClick={() => !isLoading && setIsOpen(false)}
							aria-label="Close modal"
						/>

						<div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl animate-fade-in">
							{/* Header with Pattern */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
											{mode === "restock"
												? `Restock: ${item?.name}`
												: mode === "edit"
													? "Edit"
													: "Tambah"}{" "}
											<span className="text-brand-primary">Item</span>
										</h2>
										<p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
											Manajemen Stok Bahan Baku & Perlengkapan
										</p>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-9 h-9 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
									>
										<HiOutlineXMark size={20} />
									</button>
								</div>
							</div>

							{/* Scrollable Form Content */}
							<div className="flex-1 overflow-y-auto custom-scrollbar">
								<form onSubmit={handleSubmit} className="p-8 space-y-5">
									{mode === "restock" ? (
										<div className="space-y-6">
											<div className="grid grid-cols-2 gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
												<div>
													<p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
														Stok Saat Ini
													</p>
													<p className="text-2xl font-black text-blue-900">
														{item?.quantity}{" "}
														<span className="text-xs text-blue-400 uppercase tracking-tighter ml-1">
															{item?.unit}
														</span>
													</p>
												</div>
												<div className="text-right border-l border-blue-100 pl-4">
													<p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
														Minimal Stok
													</p>
													<p className="text-2xl font-black text-blue-900">
														{item?.min_stock}{" "}
														<span className="text-xs text-blue-400 uppercase tracking-tighter ml-1">
															{item?.unit}
														</span>
													</p>
												</div>
											</div>
											<div className="space-y-2">
												<label
													htmlFor="restock_amount"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Jumlah Restock ({item?.unit})
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
														<HiOutlineArchiveBoxArrowDown />
													</span>
													<input
														required
														id="restock_amount"
														type="number"
														name="restock_amount"
														placeholder="Masukkan jumlah tambahan..."
														className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-black text-brand-primary placeholder:text-slate-300 placeholder:font-medium outline-hidden"
													/>
												</div>
											</div>
										</div>
									) : (
										<>
											<div className="grid grid-cols-2 gap-5">
												<div className="space-y-2">
													<label
														htmlFor="name"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														Nama Item
													</label>
													<div className="relative group/input">
														<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
															<HiOutlineCube />
														</span>
														<input
															required
															id="name"
															name="name"
															defaultValue={item?.name}
															placeholder="Contoh: Deterjen Liquid"
															className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-hidden"
														/>
													</div>
												</div>
												<div className="space-y-2">
													<label
														htmlFor="sku"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														SKU / Kode Stok
													</label>
													<div className="relative group/input">
														<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
															<HiOutlineQrCode />
														</span>
														<input
															id="sku"
															name="sku"
															defaultValue={item?.sku}
															placeholder="DET-001"
															className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-hidden"
														/>
													</div>
												</div>
											</div>

											<div className="grid grid-cols-3 gap-4">
												<div className="space-y-2">
													<label
														htmlFor="category"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														Kategori
													</label>
													<div className="relative group/input">
														<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
															<HiOutlineSquares2X2 />
														</span>
														<input
															id="category"
															name="category"
															defaultValue={item?.category}
															placeholder="Kategori"
															className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-hidden"
														/>
													</div>
												</div>
												<div className="space-y-2">
													<label
														htmlFor="quantity"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														Stok Awal
													</label>
													<input
														required
														id="quantity"
														type="number"
														name="quantity"
														defaultValue={item?.quantity || 0}
														className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden text-center"
													/>
												</div>
												<div className="space-y-2">
													<label
														htmlFor="unit"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														Satuan
													</label>
													<input
														required
														id="unit"
														name="unit"
														defaultValue={item?.unit || "pcs"}
														placeholder="kg/ltr/pcs"
														className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden text-center"
													/>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-5">
												<div className="space-y-2">
													<label
														htmlFor="min_stock"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														Batas Minimal Stok
													</label>
													<input
														id="min_stock"
														type="number"
														name="min_stock"
														defaultValue={item?.min_stock || 0}
														className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden"
													/>
												</div>
												<div className="space-y-2">
													<label
														htmlFor="notes"
														className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
													>
														Catatan Tambahan
													</label>
													<div className="relative group/input">
														<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
															<HiOutlinePencilSquare />
														</span>
														<input
															id="notes"
															name="notes"
															defaultValue={item?.notes}
															placeholder="..."
															className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden"
														/>
													</div>
												</div>
											</div>
										</>
									)}

									<div className="pt-6 flex items-center gap-4">
										<button
											type="button"
											onClick={() => setIsOpen(false)}
											disabled={isLoading}
											className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-500 transition-colors hover:bg-slate-50"
										>
											Batal
										</button>
										<button
											type="submit"
											disabled={isLoading}
											className="flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-primary text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition-colors hover:bg-brand-primary/90 disabled:opacity-50"
										>
											{isLoading && (
												<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											)}
											{mode === "restock"
												? "Konfirmasi Restock"
												: mode === "edit"
													? "Update Item"
													: "Simpan Item"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
