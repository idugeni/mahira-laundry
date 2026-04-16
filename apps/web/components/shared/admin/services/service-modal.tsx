"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineListBullet,
	HiOutlineSparkles,
	HiOutlineTag,
	HiOutlineTrash,
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
import { deleteService, upsertService } from "@/lib/actions/services";
import type { Service } from "@/lib/types";

interface ServiceModalProps {
	service?: Service;
	outletId: string;
	trigger?: React.ReactNode;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function ServiceModal({
	service,
	outletId,
	trigger,
	isOpen: controlledOpen,
	onOpenChange,
}: ServiceModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

	const setIsOpen = (open: boolean) => {
		if (onOpenChange) {
			onOpenChange(open);
		} else {
			setInternalOpen(open);
		}
	};

	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);

	const [isExpress, setIsExpress] = useState(service?.is_express || false);
	const [isFeatured, setIsFeatured] = useState(service?.is_featured || false);
	const [isActive, setIsActive] = useState(service ? service.is_active : true);
	const [category, setCategory] = useState(service?.category || "kiloan");
	const [unit, setUnit] = useState(service?.unit || "kg");

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleDelete = async () => {
		if (!service || !confirm("Yakin ingin menghapus layanan ini?")) return;
		setIsLoading(true);
		const result = await deleteService(service.id);
		if (result.success) {
			toast.success("Layanan dihapus");
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal menghapus");
			setIsLoading(false);
		}
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);

		// Convert comma separated features to array
		const featuresStr = formData.get("features_raw") as string;
		const featuresArr = featuresStr
			.split(",")
			.map((f) => f.trim())
			.filter((f) => f.length > 0);

		const data = {
			id: service?.id,
			outlet_id: outletId,
			name: formData.get("name") as string,
			slug: (formData.get("slug") as string).toLowerCase().replace(/\s+/g, "-"),
			description: formData.get("description") as string,
			category: formData.get("category") as string,
			unit: formData.get("unit") as string,
			price: Number(formData.get("price")),
			estimated_duration_hours: Number(
				formData.get("estimated_duration_hours"),
			),
			icon: formData.get("icon") as string,
			features: featuresArr,
			is_active: formData.get("is_active") === "on",
			is_express: formData.get("is_express") === "on",
			is_featured: formData.get("is_featured") === "on",
		};

		const result = await upsertService(data);

		if (result.success) {
			toast.success(service ? "Layanan diperbarui" : "Layanan ditambahkan");
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal menyimpan layanan");
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
					<span className="px-6 py-3 bg-brand-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-block cursor-pointer">
						+ Tambah Layanan
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

						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in border border-white/20">
							{/* Header with Pattern */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
											{service ? "Edit" : "Tambah"}{" "}
											<span className="text-brand-primary">Layanan</span>
										</h2>
										<p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
											Konfigurasi Produk & Tarif Laundry
										</p>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300"
									>
										<span className="shrink-0">
											<HiOutlineXMark size={20} />
										</span>
									</button>
								</div>
							</div>

							{/* Scrollable Form Content */}
							<div className="flex-1 overflow-y-auto custom-scrollbar">
								<form onSubmit={handleSubmit} className="p-8 space-y-5">
									<div className="grid grid-cols-2 gap-5">
										<div className="space-y-2">
											<label
												htmlFor="service-name"
												className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
											>
												Nama Layanan
											</label>
											<div className="relative group/input">
												<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
													<HiOutlineTag />
												</span>
												<input
													required
													id="service-name"
													name="name"
													defaultValue={service?.name || ""}
													placeholder="Contoh: Cuci Lipat"
													className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none placeholder:font-medium placeholder:text-slate-300"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
												Kategori
											</p>
											<input type="hidden" name="category" value={category} />
											<Select value={category} onValueChange={setCategory}>
												<SelectTrigger
													aria-label="Kategori"
													className="w-full h-[54px] px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-brand-primary/20 transition-all"
												>
													<SelectValue placeholder="Pilih Kategori" />
												</SelectTrigger>
												<SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
													<SelectItem value="kiloan" className="font-bold py-3">
														Kiloan
													</SelectItem>
													<SelectItem value="satuan" className="font-bold py-3">
														Satuan
													</SelectItem>
													<SelectItem
														value="specialist"
														className="font-bold py-3"
													>
														Spesial (Sepatu/Tas)
													</SelectItem>
													<SelectItem
														value="bedding"
														className="font-bold py-3"
													>
														Bedding & Karpet
													</SelectItem>
													<SelectItem
														value="express"
														className="font-bold py-3"
													>
														Layanan Kilat
													</SelectItem>
													<SelectItem value="luxury" className="font-bold py-3">
														Luxury Care
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="service-description"
											className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
										>
											Deskripsi Singkat
										</label>
										<textarea
											id="service-description"
											name="description"
											defaultValue={service?.description || ""}
											placeholder="Jelaskan detail cakupan layanan ini..."
											className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none min-h-[80px] resize-none placeholder:font-medium placeholder:text-slate-300"
										/>
									</div>

									<div className="space-y-2">
										<label
											htmlFor="service-features"
											className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
										>
											Fitur & Benefit (Pisahkan dengan koma)
										</label>
										<div className="relative group/input">
											<span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
												<HiOutlineListBullet />
											</span>
											<textarea
												id="service-features"
												name="features_raw"
												defaultValue={
													service?.features?.join(", ") ||
													"Detergen Premium, Setrika Uap, Parfum Signature, Kemasan Eksklusif"
												}
												placeholder="Contoh: Setrika Uap, Parfum Signature, Anti Bakteri"
												className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none min-h-[100px] resize-none placeholder:font-medium placeholder:text-slate-300"
											/>
										</div>
									</div>

									<div className="grid grid-cols-3 gap-4">
										<div className="space-y-2">
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
												Satuan
											</p>
											<input type="hidden" name="unit" value={unit} />
											<Select value={unit} onValueChange={setUnit}>
												<SelectTrigger
													aria-label="Satuan"
													className="w-full h-[54px] px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-brand-primary/20 transition-all"
												>
													<SelectValue placeholder="Satuan" />
												</SelectTrigger>
												<SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
													<SelectItem value="kg" className="font-bold py-3">
														kg
													</SelectItem>
													<SelectItem value="pcs" className="font-bold py-3">
														pcs
													</SelectItem>
													<SelectItem value="m2" className="font-bold py-3">
														m2
													</SelectItem>
													<SelectItem value="pasang" className="font-bold py-3">
														pasang
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="service-price"
												className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
											>
												Harga
											</label>
											<div className="relative group/input">
												<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors text-xs font-black">
													Rp
												</span>
												<input
													required
													id="service-price"
													type="number"
													name="price"
													defaultValue={service?.price}
													className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<label
												htmlFor="service-duration"
												className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
											>
												Waktu
											</label>
											<div className="relative group/input">
												<span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black">
													Jam
												</span>
												<input
													required
													id="service-duration"
													type="number"
													name="estimated_duration_hours"
													defaultValue={service?.estimated_duration_hours || 24}
													className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
												/>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label
												htmlFor="service-icon"
												className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
											>
												Icon / Visual
											</label>
											<div className="relative group/input">
												<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
													<HiOutlineSparkles />
												</span>
												<input
													required
													id="service-icon"
													name="icon"
													defaultValue={service?.icon || "🧺"}
													placeholder="Contoh: 🧺"
													className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none placeholder:font-medium placeholder:text-slate-300"
												/>
											</div>
											<p className="text-[10px] text-slate-400 font-medium px-2">
												Gunakan Icon/Emoji.{" "}
												<a
													href="https://emojipedia.org"
													target="_blank"
													rel="noreferrer"
													className="text-brand-primary font-bold hover:underline"
												>
													Cari Emoticon
												</a>{" "}
												atau{" "}
												<a
													href="https://lucide.dev/icons"
													target="_blank"
													rel="noreferrer"
													className="text-brand-primary font-bold hover:underline"
												>
													Icon Publik
												</a>
												.
											</p>
										</div>

										<div className="space-y-2">
											<label
												htmlFor="service-slug"
												className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
											>
												URL Slug
											</label>
											<input
												required
												id="service-slug"
												name="slug"
												defaultValue={service?.slug || ""}
												placeholder="cuci-lipat"
												className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none placeholder:font-medium placeholder:text-slate-300"
											/>
										</div>
									</div>

									<div className="space-y-3">
										<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
											Pengaturan Tambahan
										</p>
										<div className="flex flex-wrap items-center gap-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
											<label className="flex items-center gap-3 cursor-pointer group/check shrink-0">
												<input
													type="checkbox"
													name="is_express"
													checked={isExpress}
													onChange={(e) => setIsExpress(e.target.checked)}
													className="hidden"
												/>
												<div
													className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all ${isExpress ? "border-amber-500 bg-amber-500" : "border-slate-200 bg-white group-hover/check:border-amber-200"}`}
												>
													{isExpress && (
														<span className="absolute text-white pointer-events-none text-[10px] animate-zoom-in">
															⚡
														</span>
													)}
												</div>
												<span className="text-xs font-black text-slate-600 group-hover/check:text-slate-900 transition-colors uppercase tracking-widest">
													Express
												</span>
											</label>

											<label className="flex items-center gap-3 cursor-pointer group/check shrink-0">
												<input
													type="checkbox"
													name="is_featured"
													checked={isFeatured}
													onChange={(e) => setIsFeatured(e.target.checked)}
													className="hidden"
												/>
												<div
													className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all ${isFeatured ? "border-brand-primary bg-brand-primary" : "border-slate-200 bg-white group-hover/check:border-brand-primary/40"}`}
												>
													{isFeatured && (
														<span className="absolute text-white pointer-events-none text-[10px] animate-zoom-in">
															⭐
														</span>
													)}
												</div>
												<span className="text-xs font-black text-slate-600 group-hover/check:text-slate-900 transition-colors uppercase tracking-widest">
													Featured
												</span>
											</label>

											<label className="flex items-center gap-3 cursor-pointer group/check shrink-0">
												<input
													type="checkbox"
													name="is_active"
													checked={isActive}
													onChange={(e) => setIsActive(e.target.checked)}
													className="hidden"
												/>
												<div
													className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all ${isActive ? "border-emerald-500 bg-emerald-500" : "border-slate-200 bg-white group-hover/check:border-emerald-200"}`}
												>
													{isActive && (
														<span className="absolute text-white pointer-events-none text-xs animate-zoom-in">
															✓
														</span>
													)}
												</div>
												<span className="text-xs font-black text-slate-600 group-hover/check:text-slate-900 transition-colors uppercase tracking-widest">
													Aktif
												</span>
											</label>
										</div>
									</div>

									<div className="pt-6 flex items-center gap-4">
										{service && (
											<button
												type="button"
												onClick={handleDelete}
												disabled={isLoading}
												className="px-4 py-4 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all active:scale-[0.98]"
												title="Hapus Layanan"
											>
												<HiOutlineTrash size={20} />
											</button>
										)}
										<button
											type="button"
											onClick={() => setIsOpen(false)}
											disabled={isLoading}
											className="flex-1 py-4 text-sm font-black text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
										>
											Batal
										</button>
										<button
											type="submit"
											disabled={isLoading}
											className="flex-[2] py-4 text-sm font-black text-white bg-brand-primary rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
										>
											{isLoading && (
												<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											)}
											{service ? "Update Layanan" : "Simpan Layanan"}
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
