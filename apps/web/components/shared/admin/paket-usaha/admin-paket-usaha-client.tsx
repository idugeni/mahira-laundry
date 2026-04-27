"use client";

import {
	Edit3,
	Layers,
	Package,
	Plus,
	ToggleLeft,
	ToggleRight,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "sonner";
import { PackageFormModal } from "@/components/shared/admin/paket-usaha/package-form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	deleteBusinessPackage,
	toggleBusinessPackageActive,
} from "@/lib/actions/business-packages";
import type { BusinessPackage } from "@/lib/types";
import { cn, formatIDR } from "@/lib/utils";

interface AdminPaketUsahaClientProps {
	packages: BusinessPackage[];
}

const TIER_COLORS: Record<string, string> = {
	Starter: "bg-slate-100 text-slate-600",
	Standard: "bg-indigo-50 text-indigo-600",
	Premium: "bg-amber-50 text-amber-600",
	Custom: "bg-emerald-50 text-emerald-600",
};

export function AdminPaketUsahaClient({
	packages: initialPackages,
}: AdminPaketUsahaClientProps) {
	const [packages, setPackages] = useState<BusinessPackage[]>(initialPackages);
	// undefined = modal closed, null = create mode, BusinessPackage = edit mode
	const [modalPackage, setModalPackage] = useState<
		BusinessPackage | null | undefined
	>(undefined);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [toggleLoading, setToggleLoading] = useState<string | null>(null);

	async function handleToggle(id: string, newActive: boolean) {
		setToggleLoading(id);
		try {
			const res = await toggleBusinessPackageActive(id, newActive);
			if (!res.success) {
				toast.error(res.error ?? "Gagal mengubah status paket.");
			} else {
				setPackages((prev) =>
					prev.map((p) => (p.id === id ? { ...p, is_active: newActive } : p)),
				);
				toast.success(newActive ? "Paket diaktifkan." : "Paket dinonaktifkan.");
			}
		} catch {
			toast.error("Terjadi kesalahan, coba lagi.");
		} finally {
			setToggleLoading(null);
		}
	}

	async function handleDelete() {
		if (!deleteConfirm) return;
		setDeleteLoading(true);
		try {
			const res = await deleteBusinessPackage(deleteConfirm);
			if (!res.success) {
				toast.error(res.error ?? "Gagal menghapus paket.");
			} else {
				setPackages((prev) => prev.filter((p) => p.id !== deleteConfirm));
				toast.success("Paket berhasil dihapus.");
				setDeleteConfirm(null);
			}
		} catch {
			toast.error("Terjadi kesalahan, coba lagi.");
		} finally {
			setDeleteLoading(false);
		}
	}

	function handleModalSuccess(updated: BusinessPackage) {
		setPackages((prev) => {
			const exists = prev.find((p) => p.id === updated.id);
			if (exists) {
				return prev.map((p) => (p.id === updated.id ? updated : p));
			}
			return [...prev, updated];
		});
		setModalPackage(undefined);
	}

	const packageToDelete = packages.find((p) => p.id === deleteConfirm);

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
						<Layers size={20} />
					</div>
					<div>
						<p className="font-black text-slate-900 uppercase tracking-tight text-sm">
							{packages.length} Paket Terdaftar
						</p>
						<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
							{packages.filter((p) => p.is_active).length} aktif
						</p>
					</div>
				</div>
				<Button
					onClick={() => setModalPackage(null)}
					className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-6 h-12 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 flex items-center gap-3"
				>
					<Plus size={16} /> Tambah Paket Baru
				</Button>
			</div>

			{/* Table */}
			{packages.length === 0 ? (
				<div className="bg-white rounded-[3rem] border border-slate-100 p-24 text-center shadow-xl shadow-slate-200/40">
					<div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-slate-100">
						<Package size={40} className="text-slate-200" />
					</div>
					<h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
						Belum Ada Paket
					</h3>
					<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-3 max-w-sm mx-auto leading-relaxed">
						Tambahkan paket usaha laundry pertama untuk ditampilkan ke calon
						mitra.
					</p>
					<Button
						onClick={() => setModalPackage(null)}
						className="mt-8 bg-slate-900 text-white rounded-2xl px-8 h-12 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10"
					>
						<Plus size={16} className="mr-2" /> Tambah Paket Baru
					</Button>
				</div>
			) : (
				<div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-slate-50">
									<th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Nama Paket
									</th>
									<th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Tier
									</th>
									<th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Harga
									</th>
									<th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Inquiry
									</th>
									<th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Status
									</th>
									<th className="text-right px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{packages.map((pkg) => (
									<tr
										key={pkg.id}
										className="group hover:bg-slate-50/50 transition-colors"
									>
										{/* Name */}
										<td className="px-8 py-5">
											<div className="flex items-center gap-4">
												<div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
													<Package size={18} />
												</div>
												<div className="min-w-0">
													<p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate max-w-[200px]">
														{pkg.name}
													</p>
													{pkg.description && (
														<p className="text-[10px] font-bold text-slate-400 truncate max-w-[200px] mt-0.5">
															{pkg.description}
														</p>
													)}
												</div>
											</div>
										</td>

										{/* Tier */}
										<td className="px-6 py-5">
											<Badge
												className={cn(
													"px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border-none shadow-none",
													TIER_COLORS[pkg.tier] ??
														"bg-slate-100 text-slate-600",
												)}
											>
												{pkg.tier}
											</Badge>
										</td>

										{/* Price */}
										<td className="px-6 py-5">
											<div>
												<p className="font-black text-slate-900 text-sm">
													{formatIDR(pkg.price)}
												</p>
												{pkg.promo_price != null && (
													<p className="text-[10px] font-bold text-emerald-600 mt-0.5">
														Promo: {formatIDR(pkg.promo_price)}
													</p>
												)}
											</div>
										</td>

										{/* Inquiry count — not available from props */}
										<td className="px-6 py-5">
											<span className="text-sm font-bold text-slate-400">
												—
											</span>
										</td>

										{/* Status toggle */}
										<td className="px-6 py-5">
											<button
												type="button"
												onClick={() => handleToggle(pkg.id, !pkg.is_active)}
												disabled={toggleLoading === pkg.id}
												className={cn(
													"flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50",
													pkg.is_active ? "text-emerald-600" : "text-slate-400",
												)}
												title={
													pkg.is_active ? "Nonaktifkan paket" : "Aktifkan paket"
												}
											>
												{toggleLoading === pkg.id ? (
													<span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
												) : pkg.is_active ? (
													<ToggleRight size={28} />
												) : (
													<ToggleLeft size={28} />
												)}
												<span className="text-[10px] font-black uppercase tracking-widest">
													{pkg.is_active ? "Aktif" : "Nonaktif"}
												</span>
											</button>
										</td>

										{/* Actions */}
										<td className="px-8 py-5">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setModalPackage(pkg)}
													className="w-9 h-9 p-0 rounded-xl hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 transition-all"
													title="Edit paket"
												>
													<Edit3 size={16} />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setDeleteConfirm(pkg.id)}
													className="w-9 h-9 p-0 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all"
													title="Hapus paket"
												>
													<Trash2 size={16} />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* PackageFormModal */}
			{modalPackage !== undefined && (
				<PackageFormModal
					package={modalPackage ?? undefined}
					onSuccess={handleModalSuccess}
					onClose={() => setModalPackage(undefined)}
				/>
			)}

			{/* Delete Confirmation Dialog */}
			{deleteConfirm !== null &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							aria-label="Tutup modal"
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-default"
							onClick={() => !deleteLoading && setDeleteConfirm(null)}
						/>
						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-rose-50 border-b border-rose-100 relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-rose-100 flex items-center justify-center text-rose-500">
											<Trash2 size={20} />
										</div>
										<div>
											<h2 className="text-xl font-black text-slate-900 tracking-tight">
												Hapus <span className="text-rose-500">Paket</span>
											</h2>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
												Tindakan ini tidak dapat dibatalkan
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => !deleteLoading && setDeleteConfirm(null)}
										className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
									>
										<HiOutlineXMark size={16} />
									</button>
								</div>
							</div>

							{/* Body */}
							<div className="p-8 space-y-6">
								<p className="text-sm font-bold text-slate-600 leading-relaxed">
									Apakah Anda yakin ingin menghapus paket{" "}
									<span className="font-black text-slate-900">
										{packageToDelete?.name}
									</span>
									? Paket yang memiliki inquiry terkait tidak dapat dihapus.
								</p>

								<div className="flex items-center gap-3">
									<Button
										variant="outline"
										onClick={() => setDeleteConfirm(null)}
										disabled={deleteLoading}
										className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-slate-100 hover:bg-slate-50"
									>
										Batal
									</Button>
									<Button
										onClick={handleDelete}
										disabled={deleteLoading}
										className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
									>
										{deleteLoading ? (
											<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										) : (
											<>
												<Trash2 size={14} /> Hapus Paket
											</>
										)}
									</Button>
								</div>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
