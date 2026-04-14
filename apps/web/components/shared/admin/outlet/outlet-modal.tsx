"use client";

import {
	AlertTriangle,
	Image as ImageIcon,
	MapPin,
	Percent,
	Phone,
	Save,
	Store,
	ToggleRight,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineBuildingOffice,
	HiOutlineCamera,
	HiOutlineCurrencyDollar,
	HiOutlineMapPin,
	HiOutlinePhone,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	deleteOutlet,
	uploadOutletImage,
	upsertOutlet,
} from "@/lib/actions/outlets";
import type { Outlet } from "@/lib/types";

interface OutletModalProps {
	outlet?: Outlet;
	trigger?: React.ReactNode;
}

export function OutletModal({ outlet, trigger }: OutletModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState(outlet?.image_url || "");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsLoading(true);
		const formData = new FormData();
		formData.append("image", file);

		const result = await uploadOutletImage(outlet?.id || "temp", formData);
		if (result.success && result.data) {
			setImageUrl(result.data.url);
			toast.success("Identity visual outlet berhasil diamankan!");
		} else {
			toast.error(result.error || "Interupsi: Gagal mengunggah visual.");
		}
		setIsLoading(false);
	}

	async function handleDelete() {
		if (
			!confirm(
				"PERINGATAN: Menghapus outlet akan menghapus seluruh data terkait secara permanen. Lanjutkan?",
			)
		)
			return;

		setIsLoading(true);
		const result = await deleteOutlet(outlet!.id);

		if (result.success) {
			toast.success("Outlet telah dihapus dari ekosistem bisnis.");
			setIsOpen(false);
		} else {
			toast.error(result.error || "Gagal menghapus outlet.");
		}
		setIsLoading(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			id: outlet?.id,
			name: formData.get("name") as string,
			slug: (formData.get("slug") as string).toLowerCase().replace(/\s+/g, "-"),
			address: formData.get("address") as string,
			phone: formData.get("phone") as string,
			image_url: imageUrl,
			is_active: formData.get("is_active") === "on",
			is_franchise: formData.get("is_franchise") === "on",
			franchise_fee: Number(formData.get("franchise_fee")) || 0,
		};

		const result = await upsertOutlet(data);

		if (result.success) {
			toast.success(
				outlet
					? "Data outlet berhasil disinkronisasi"
					: "Unit bisnis baru telah terdaftar",
			);
			setIsOpen(false);
		} else {
			toast.error(result.error || "Interupsi sistem: Gagal menyimpan unit.");
		}
		setIsLoading(false);
	}

	return (
		<>
			<div onClick={() => setIsOpen(true)}>
				{trigger || (
					<Button className="bg-slate-900 text-white rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all">
						+ Tambah Outlet
					</Button>
				)}
			</div>

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<div
							className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300"
							onClick={() => !isLoading && setIsOpen(false)}
						/>

						<div className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
							{/* Premium Header */}
							<div className="px-10 pt-10 pb-8 bg-slate-50 relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-3xl transition-transform duration-1000 group-hover:scale-110" />

								<div className="relative flex items-center justify-between">
									<div className="space-y-2">
										<Badge className="bg-indigo-600 text-white border-none py-0.5 text-[8px] font-black uppercase tracking-[0.2em]">
											Entity Configuration
										</Badge>
										<h2 className="text-3xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
											{outlet ? "Ubah" : "Daftar"}{" "}
											<span className="text-indigo-600 italic">Outlet</span>
										</h2>
										<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
											Otoritas Administrasi Pusat Mahira Laundry
										</p>
									</div>
									<button
										onClick={() => setIsOpen(false)}
										className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-500"
									>
										<X size={20} />
									</button>
								</div>
							</div>

							<div className="flex-1 overflow-y-auto custom-scrollbar">
								<form onSubmit={handleSubmit} className="p-10 space-y-8">
									{/* Luxury Image Upload */}
									<div className="relative group/outlet-img w-full h-48 rounded-[2.5rem] bg-slate-50 border-4 border-dashed border-slate-100 overflow-hidden flex items-center justify-center transition-all hover:border-indigo-200">
										{imageUrl ? (
											<img
												src={imageUrl}
												alt="Preview"
												className="w-full h-full object-cover transition-transform group-hover/outlet-img:scale-110 duration-1000"
											/>
										) : (
											<div className="flex flex-col items-center gap-4 text-slate-300">
												<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform group-hover/outlet-img:scale-110 shadow-slate-100">
													<ImageIcon size={32} />
												</div>
												<p className="text-[10px] font-black uppercase tracking-widest">
													Visual Asset Gerai
												</p>
											</div>
										)}
										<label className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] opacity-0 group-hover/outlet-img:opacity-100 flex items-center justify-center transition-all cursor-pointer z-10">
											<div className="bg-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-widest">
												<HiOutlineCamera size={20} />
												<span>
													{imageUrl ? "Ganti Visual" : "Pilih Visual"}
												</span>
											</div>
											<input
												type="file"
												className="hidden"
												accept="image/*"
												onChange={handleImageUpload}
											/>
										</label>
									</div>

									<div className="grid grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
												Nama Bisnis
											</label>
											<input
												required
												name="name"
												defaultValue={outlet?.name || ""}
												placeholder="Contoh: Salemba Prime"
												className="w-full px-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
												Unik Slug
											</label>
											<input
												required
												name="slug"
												defaultValue={outlet?.slug || ""}
												placeholder="salemba-prime"
												className="w-full px-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
											Lokasi Geo-Tag
										</label>
										<div className="relative group/input">
											<MapPin className="absolute left-5 top-5 text-indigo-400 w-5 h-5" />
											<textarea
												required
												name="address"
												defaultValue={outlet?.address || ""}
												placeholder="Alamat lengkap operasional..."
												className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-[2rem] text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none min-h-[100px] resize-none"
											/>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
												Center Contact
											</label>
											<div className="relative group/input">
												<Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
												<input
													name="phone"
													defaultValue={outlet?.phone || ""}
													placeholder="+62..."
													className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
												Royalty Fee (%)
											</label>
											<div className="relative group/input">
												<Percent className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
												<input
													type="number"
													name="franchise_fee"
													defaultValue={outlet?.franchise_fee || 0}
													className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
												/>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-6 p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-50/50">
										<label className="flex items-center gap-4 cursor-pointer group/check flex-1">
											<div className="relative flex items-center justify-center">
												<input
													type="checkbox"
													name="is_active"
													defaultChecked={outlet ? outlet.is_active : true}
													className="peer h-7 w-7 cursor-pointer appearance-none rounded-xl border-2 border-slate-200 bg-white checked:border-indigo-600 checked:bg-indigo-600 transition-all shadow-sm"
												/>
												<span className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none font-bold">
													✓
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-black text-slate-800 uppercase tracking-tight">
													Status Aktif
												</span>
												<span className="text-[10px] font-bold text-slate-400 uppercase">
													Operational Ready
												</span>
											</div>
										</label>
										<div className="w-px h-10 bg-indigo-100" />
										<label className="flex items-center gap-4 cursor-pointer group/check flex-1">
											<div className="relative flex items-center justify-center">
												<input
													type="checkbox"
													name="is_franchise"
													defaultChecked={outlet?.is_franchise}
													className="peer h-7 w-7 cursor-pointer appearance-none rounded-xl border-2 border-slate-200 bg-white checked:border-indigo-600 checked:bg-indigo-600 transition-all shadow-sm"
												/>
												<span className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none font-bold">
													✓
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-black text-slate-800 uppercase tracking-tight">
													Kemitraan
												</span>
												<span className="text-[10px] font-bold text-slate-400 uppercase">
													Model Franchise
												</span>
											</div>
										</label>
									</div>

									<div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
										{outlet && (
											<Button
												type="button"
												variant="ghost"
												onClick={handleDelete}
												disabled={isLoading}
												className="w-full sm:w-auto px-6 h-16 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2"
											>
												<Trash2 size={18} /> Hapus Unit
											</Button>
										)}
										<div className="flex-1" />
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsOpen(false)}
											disabled={isLoading}
											className="w-full sm:w-auto h-16 px-10 rounded-2xl border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
										>
											Batal
										</Button>
										<Button
											type="submit"
											disabled={isLoading}
											className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.15em] shadow-2xl shadow-slate-900/10 hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3"
										>
											{isLoading ? (
												<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											) : (
												<Save size={18} />
											)}
											{outlet ? "Push Configuration" : "Deploy Unit"}
										</Button>
									</div>
								</form>
							</div>

							{/* Caution Footer */}
							<div className="bg-amber-50 px-10 py-6 border-t border-amber-100 flex items-center gap-4">
								<div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
									<AlertTriangle size={20} />
								</div>
								<p className="text-[10px] font-bold text-amber-700/80 leading-relaxed uppercase tracking-widest">
									Pastikan seluruh data yang diinput telah sesuai dengan dokumen
									legal kemitraan Mahira Laundry Group.
								</p>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
