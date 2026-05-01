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
		<div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
					className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-5 h-11 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 flex items-center gap-2.5"
				>
					<Plus size={16} /> Tambah Paket Baru
				</Button>
			</div>

			{/* Package Cards */}
			{packages.length === 0 ? (
				<div className="bg-white rounded-2xl border border-slate-100 p-10 sm:p-14 text-center shadow-lg shadow-slate-200/40">
					<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-dashed border-slate-100">
						<Package size={32} className="text-slate-200" />
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
						className="mt-8 bg-slate-900 text-white rounded-xl px-5 h-11 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10"
					>
						<Plus size={16} className="mr-2" /> Tambah Paket Baru
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
					{packages.map((pkg) => (
						<div
							key={pkg.id}
							className="group relative bg-white rounded-none sm:rounded-2xl border-b sm:border border-slate-100 p-5 sm:p-6 shadow-lg shadow-slate-200/35 hover:shadow-xl hover:shadow-indigo-500/10 transition-[box-shadow,border-color] duration-300 overflow-hidden"
						>
							{/* Card Header */}
							<div className="flex items-center justify-between mb-5">
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5">
										<Package size={20} />
									</div>
									<div className="min-w-0">
										<p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">
											{pkg.name}
										</p>
										{pkg.description && (
											<p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">
												{pkg.description}
											</p>
										)}
									</div>
								</div>
								<Badge
									className={cn(
										"px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-none shadow-none shrink-0",
										TIER_COLORS[pkg.tier] ?? "bg-slate-100 text-slate-600",
									)}
								>
									{pkg.tier}
								</Badge>
							</div>

							{/* Price Section */}
							<div className="space-y-4 mb-5">
								<div className="flex items-baseline justify-between">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</p>
									<p className="font-black text-slate-900 text-lg">
										{formatIDR(pkg.price)}
									</p>
								</div>
								{pkg.promo_price != null && (
									<div className="flex items-center gap-2 bg-emerald-50/50 rounded-xl px-3 py-2 border border-emerald-100/50">
										<span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Promo</span>
										<span className="font-black text-emerald-600 text-sm">{formatIDR(pkg.promo_price)}</span>
									</div>
								)}
							</div>

							{/* Footer: Status + Actions */}
							<div className="pt-5 border-t border-slate-50 flex items-center justify-between">
								<button
									type="button"
									onClick={() => handleToggle(pkg.id, !pkg.is_active)}
									disabled={toggleLoading === pkg.id}
									className={cn(
										"flex items-center gap-2 transition-colors disabled:opacity-50",
										pkg.is_active ? "text-emerald-600" : "text-slate-400",
									)}
									title={pkg.is_active ? "Nonaktifkan paket" : "Aktifkan paket"}
								>
									{toggleLoading === pkg.id ? (
										<span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
									) : pkg.is_active ? (
										<ToggleRight size={24} />
									) : (
										<ToggleLeft size={24} />
									)}
									<span className="text-[10px] font-black uppercase tracking-widest">
										{pkg.is_active ? "Aktif" : "Nonaktif"}
									</span>
								</button>

								<div className="flex items-center gap-1.5">
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
							</div>
						</div>
					))}
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
										<div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-rose-100 flex items-center justify-center text-rose-500">
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
										className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
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
										className="flex-1 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest border-slate-100 hover:bg-slate-50"
									>
										Batal
									</Button>
									<Button
										onClick={handleDelete}
										disabled={deleteLoading}
										className="flex-1 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
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
