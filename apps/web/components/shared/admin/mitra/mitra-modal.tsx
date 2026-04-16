"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineBuildingOffice,
	HiOutlineCurrencyDollar,
	HiOutlineEnvelope,
	HiOutlineLink,
	HiOutlineLockClosed,
	HiOutlineMapPin,
	HiOutlinePhone,
	HiOutlineUser,
	HiOutlineUserGroup,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import { registerMitra } from "@/lib/actions/mitra";

export function MitraModal({ trigger }: { trigger?: React.ReactNode } = {}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const data = {
			fullName: formData.get("fullName") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			password: (formData.get("password") as string) || undefined,
			outletName: formData.get("outletName") as string,
			outletSlug: formData.get("outletSlug") as string,
			outletAddress: formData.get("outletAddress") as string,
			franchiseFee: Number(formData.get("franchiseFee")),
		};

		const result = await registerMitra(data);

		if (result.success) {
			toast.success("Mitra & Outlet berhasil didaftarkan!");
			setIsOpen(false);
		} else {
			setError(result.error || "Terjadi kesalahan.");
			toast.error(result.error || "Gagal mendaftarkan mitra.");
		}
		setIsLoading(false);
	}

	return (
		<>
			<div
				role="presentation"
				onClick={() => setIsOpen(true)}
				className="contents"
			>
				{trigger || (
					<span className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer">
						<HiOutlineUserGroup size={18} />
						<span>Tambah Mitra Baru</span>
					</span>
				)}
			</div>

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

						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in border border-white/20">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden shrink-0">
								<div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-black text-slate-900 tracking-tight">
											Onboarding{" "}
											<span className="text-indigo-600">Mitra Baru</span>
										</h2>
										<p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
											Registrasi Akun Owner & Inisialisasi Outlet Franchise
										</p>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300"
									>
										<HiOutlineXMark size={20} />
									</button>
								</div>
							</div>

							{/* Content Area */}
							<div className="flex-1 overflow-y-auto custom-scrollbar">
								<form onSubmit={handleSubmit} className="p-8 space-y-8">
									{error && (
										<div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-3 animate-head-shake">
											<span>⚠️</span>
											{error}
										</div>
									)}

									{/* Section 1: Owner Info */}
									<div className="space-y-4">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
												<HiOutlineUser size={14} />
											</div>
											<h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
												Informasi Pemilik (Mitra)
											</h3>
										</div>

										<div className="grid grid-cols-2 gap-5">
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<label
													htmlFor="fullName"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Nama Lengkap
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineUser />
													</span>
													<input
														required
														id="fullName"
														name="fullName"
														placeholder="Contoh: Budi Santoso"
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
											</div>
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<label
													htmlFor="email"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Email Mitra
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineEnvelope />
													</span>
													<input
														required
														type="email"
														id="email"
														name="email"
														placeholder="owner@email.com"
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
											</div>
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<label
													htmlFor="phone"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													No. WhatsApp
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlinePhone />
													</span>
													<input
														required
														id="phone"
														name="phone"
														placeholder="0812..."
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
											</div>
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<label
													htmlFor="password"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Password Akses
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineLockClosed />
													</span>
													<input
														type="password"
														id="password"
														name="password"
														placeholder="Default: MitraMahira12!@"
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Section 2: Outlet Info */}
									<div className="space-y-4 pt-4 border-t border-slate-100">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
												<HiOutlineBuildingOffice size={14} />
											</div>
											<h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
												Informasi Cabang (Outlet)
											</h3>
										</div>

										<div className="grid grid-cols-2 gap-5">
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<label
													htmlFor="outletName"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Nama Outlet
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineBuildingOffice />
													</span>
													<input
														required
														id="outletName"
														name="outletName"
														placeholder="Mahira - Gading Serpong"
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
											</div>
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<label
													htmlFor="outletSlug"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Slug URL (Tanpa Spasi)
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineLink />
													</span>
													<input
														required
														id="outletSlug"
														name="outletSlug"
														placeholder="gading-serpong"
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
											</div>
											<div className="space-y-2 col-span-2">
												<label
													htmlFor="outletAddress"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Alamat Lengkap
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineMapPin />
													</span>
													<textarea
														required
														id="outletAddress"
														name="outletAddress"
														placeholder="Jl. Boulevard Raya Blok M3 No. 45..."
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none min-h-[80px] ring-0 focus:border-indigo-500 focus:bg-white transition-all resize-none"
													/>
												</div>
											</div>
											<div className="space-y-2 col-span-2">
												<label
													htmlFor="franchiseFee"
													className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
												>
													Franchise Fee / Royalti (%)
												</label>
												<div className="relative group/input">
													<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
														<HiOutlineCurrencyDollar />
													</span>
													<input
														required
														type="number"
														id="franchiseFee"
														name="franchiseFee"
														defaultValue="5"
														min="0"
														max="100"
														className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none ring-0 focus:border-indigo-500 focus:bg-white transition-all"
													/>
												</div>
												<p className="text-[10px] text-slate-400 italic ml-1">
													Persentase bagi hasil bulanan yang akan dipotong dari
													pendapatan outlet.
												</p>
											</div>
										</div>
									</div>

									{/* Footer Actions */}
									<div className="pt-4 flex items-center gap-4">
										<button
											type="button"
											onClick={() => setIsOpen(false)}
											disabled={isLoading}
											className="flex-1 py-4 text-sm font-black text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
										>
											Batalkan
										</button>
										<button
											type="submit"
											disabled={isLoading}
											className="flex-[2] py-4 text-sm font-black text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
										>
											{isLoading ? (
												<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											) : (
												<>
													<HiOutlineUserGroup size={20} />
													<span>Daftarkan Mitra Baru</span>
												</>
											)}
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
