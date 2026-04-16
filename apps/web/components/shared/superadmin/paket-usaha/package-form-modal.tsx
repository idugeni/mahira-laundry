"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Resolver } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	createBusinessPackage,
	updateBusinessPackage,
} from "@/lib/actions/business-packages";
import type { BusinessPackage, PackageTier } from "@/lib/types";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const packageItemSchema = z.object({
	name: z.string().min(1, "Nama item wajib diisi"),
	quantity: z.coerce.number().optional(),
	spec: z.string().optional(),
});

const packageFormSchema = z
	.object({
		name: z.string().min(1, "Nama paket wajib diisi"),
		tier: z.enum(["Starter", "Standard", "Premium", "Custom"] as const),
		price: z.coerce.number().min(1, "Harga wajib diisi dan lebih dari 0"),
		promo_price: z.coerce.number().nullable().optional(),
		promo_expires_at: z.string().nullable().optional(),
		description: z.string().optional(),
		items: z.array(packageItemSchema).default([]),
		training_duration_days: z.coerce.number().nullable().optional(),
		support_coverage: z.string().nullable().optional(),
		estimated_roi: z.string().nullable().optional(),
		image_url: z.string().nullable().optional(),
		sort_order: z.coerce.number().default(0),
		is_featured: z.boolean().default(false),
		is_active: z.boolean().default(true),
	})
	.superRefine((data, ctx) => {
		if (
			data.promo_price != null &&
			data.promo_price !== 0 &&
			data.price != null &&
			data.promo_price >= data.price
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Harga promo harus lebih kecil dari harga normal.",
				path: ["promo_price"],
			});
		}
	});

type PackageFormValues = z.infer<typeof packageFormSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface PackageFormModalProps {
	package?: BusinessPackage;
	onSuccess: (pkg: BusinessPackage) => void;
	onClose: () => void;
}

// ─── Tier Options ─────────────────────────────────────────────────────────────

const TIER_OPTIONS: PackageTier[] = [
	"Starter",
	"Standard",
	"Premium",
	"Custom",
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function toDatetimeLocal(iso?: string | null): string {
	if (!iso) return "";
	// Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
	return iso.slice(0, 16);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PackageFormModal({
	package: pkg,
	onSuccess,
	onClose,
}: PackageFormModalProps) {
	const isEdit = pkg != null;

	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<PackageFormValues>({
		resolver: zodResolver(packageFormSchema) as Resolver<PackageFormValues>,
		defaultValues: {
			name: "",
			tier: "Starter",
			price: 0,
			promo_price: null,
			promo_expires_at: null,
			description: "",
			items: [],
			training_duration_days: null,
			support_coverage: null,
			estimated_roi: null,
			image_url: null,
			sort_order: 0,
			is_featured: false,
			is_active: true,
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
	});

	// Pre-fill form in edit mode
	useEffect(() => {
		if (pkg) {
			reset({
				name: pkg.name,
				tier: pkg.tier,
				price: pkg.price,
				promo_price: pkg.promo_price ?? null,
				promo_expires_at: toDatetimeLocal(pkg.promo_expires_at),
				description: pkg.description ?? "",
				items: pkg.items ?? [],
				training_duration_days: pkg.training_duration_days ?? null,
				support_coverage: pkg.support_coverage ?? null,
				estimated_roi: pkg.estimated_roi ?? null,
				image_url: pkg.image_url ?? null,
				sort_order: pkg.sort_order,
				is_featured: pkg.is_featured,
				is_active: pkg.is_active,
			});
		}
	}, [pkg, reset]);

	async function onSubmit(values: PackageFormValues) {
		const payload = {
			...values,
			promo_price: values.promo_price || null,
			promo_expires_at: values.promo_expires_at
				? new Date(values.promo_expires_at).toISOString()
				: null,
			training_duration_days: values.training_duration_days || null,
			support_coverage: values.support_coverage || null,
			estimated_roi: values.estimated_roi || null,
			image_url: values.image_url || null,
		};

		const res = isEdit
			? await updateBusinessPackage(pkg.id, payload)
			: await createBusinessPackage(payload);

		if (!res.success || !res.data) {
			toast.error(res.error ?? "Terjadi kesalahan, coba lagi.");
			return;
		}

		toast.success("Paket berhasil disimpan.");
		onSuccess(res.data);
	}

	// Close on Escape
	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape" && !isSubmitting) onClose();
		}
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [isSubmitting, onClose]);

	const watchPrice = watch("price");

	return createPortal(
		<div className="fixed inset-0 z-[999] flex items-start justify-center p-4 overflow-y-auto">
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Tutup modal"
				className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-default"
				onClick={() => !isSubmitting && onClose()}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-8 overflow-hidden border border-white/20">
				{/* Header */}
				<div className="px-8 pt-8 pb-6 bg-indigo-50 border-b border-indigo-100 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 blur-3xl" />
					<div className="relative flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600">
								<Package size={20} />
							</div>
							<div>
								<h2 className="text-xl font-black text-slate-900 tracking-tight">
									{isEdit ? (
										<>
											Edit <span className="text-indigo-600">Paket</span>
										</>
									) : (
										<>
											Tambah <span className="text-indigo-600">Paket Baru</span>
										</>
									)}
								</h2>
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
									{isEdit
										? `ID: ${pkg.id.slice(0, 8)}…`
										: "Isi semua field yang diperlukan"}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => !isSubmitting && onClose()}
							className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
						>
							<HiOutlineXMark size={16} />
						</button>
					</div>
				</div>

				{/* Form Body */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
					{/* Row: Name + Tier */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label
								htmlFor="pkg-name"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Nama Paket <span className="text-rose-500">*</span>
							</label>
							<input
								id="pkg-name"
								{...register("name")}
								placeholder="Contoh: Paket Starter Laundry"
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
							{errors.name && (
								<p className="text-[10px] font-bold text-rose-500">
									{errors.name.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="pkg-tier"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Tier <span className="text-rose-500">*</span>
							</label>
							<select
								id="pkg-tier"
								{...register("tier")}
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
							>
								{TIER_OPTIONS.map((t) => (
									<option key={t} value={t}>
										{t}
									</option>
								))}
							</select>
							{errors.tier && (
								<p className="text-[10px] font-bold text-rose-500">
									{errors.tier.message}
								</p>
							)}
						</div>
					</div>

					{/* Row: Price + Promo Price */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label
								htmlFor="pkg-price"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Harga Normal (Rp) <span className="text-rose-500">*</span>
							</label>
							<input
								id="pkg-price"
								{...register("price")}
								type="number"
								min={1}
								placeholder="0"
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
							{errors.price && (
								<p className="text-[10px] font-bold text-rose-500">
									{errors.price.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="pkg-promo-price"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Harga Promo (Rp){" "}
								<span className="text-slate-300 font-bold normal-case tracking-normal">
									opsional
								</span>
							</label>
							<input
								id="pkg-promo-price"
								{...register("promo_price")}
								type="number"
								min={0}
								placeholder={watchPrice ? `< ${watchPrice}` : "0"}
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
							{errors.promo_price && (
								<p className="text-[10px] font-bold text-rose-500">
									{errors.promo_price.message}
								</p>
							)}
						</div>
					</div>

					{/* Promo Expires At */}
					<div className="space-y-1.5">
						<label
							htmlFor="pkg-promo-expires"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							Berakhir Promo{" "}
							<span className="text-slate-300 font-bold normal-case tracking-normal">
								opsional
							</span>
						</label>
						<input
							id="pkg-promo-expires"
							{...register("promo_expires_at")}
							type="datetime-local"
							className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
						/>
					</div>

					{/* Description */}
					<div className="space-y-1.5">
						<label
							htmlFor="pkg-description"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							Deskripsi{" "}
							<span className="text-slate-300 font-bold normal-case tracking-normal">
								opsional
							</span>
						</label>
						<textarea
							id="pkg-description"
							{...register("description")}
							rows={3}
							placeholder="Deskripsi singkat paket usaha..."
							className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none"
						/>
					</div>

					{/* Items (dynamic list) */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
								Daftar Item Paket
							</span>
							<button
								type="button"
								onClick={() =>
									append({ name: "", quantity: undefined, spec: "" })
								}
								className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
							>
								<Plus size={12} /> Tambah Item
							</button>
						</div>

						{fields.length === 0 && (
							<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
								<p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
									Belum ada item — klik "Tambah Item" untuk menambahkan
								</p>
							</div>
						)}

						<div className="space-y-2">
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="grid grid-cols-[1fr_80px_1fr_auto] gap-2 items-start"
								>
									<div>
										<input
											{...register(`items.${index}.name`)}
											placeholder="Nama item"
											className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
										/>
										{errors.items?.[index]?.name && (
											<p className="text-[9px] font-bold text-rose-500 mt-0.5">
												{errors.items[index]?.name?.message}
											</p>
										)}
									</div>
									<input
										{...register(`items.${index}.quantity`)}
										type="number"
										min={1}
										placeholder="Qty"
										className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
									/>
									<input
										{...register(`items.${index}.spec`)}
										placeholder="Spesifikasi (opsional)"
										className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
									/>
									<button
										type="button"
										onClick={() => remove(index)}
										className="w-10 h-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-all shrink-0"
									>
										<X size={14} />
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Row: Training + Support */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label
								htmlFor="pkg-training-days"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Durasi Training (hari){" "}
								<span className="text-slate-300 font-bold normal-case tracking-normal">
									opsional
								</span>
							</label>
							<input
								id="pkg-training-days"
								{...register("training_duration_days")}
								type="number"
								min={0}
								placeholder="Contoh: 7"
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="pkg-support"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Cakupan Support{" "}
								<span className="text-slate-300 font-bold normal-case tracking-normal">
									opsional
								</span>
							</label>
							<input
								id="pkg-support"
								{...register("support_coverage")}
								placeholder="Contoh: 12 bulan penuh"
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
						</div>
					</div>

					{/* Row: ROI + Image URL */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<label
								htmlFor="pkg-roi"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Estimasi ROI{" "}
								<span className="text-slate-300 font-bold normal-case tracking-normal">
									opsional
								</span>
							</label>
							<input
								id="pkg-roi"
								{...register("estimated_roi")}
								placeholder="Contoh: 12–18 bulan"
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="pkg-image-url"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								URL Gambar{" "}
								<span className="text-slate-300 font-bold normal-case tracking-normal">
									opsional
								</span>
							</label>
							<input
								id="pkg-image-url"
								{...register("image_url")}
								placeholder="https://..."
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
						</div>
					</div>

					{/* Row: Sort Order + Toggles */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
						<div className="space-y-1.5">
							<label
								htmlFor="pkg-sort-order"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
							>
								Sort Order
							</label>
							<input
								id="pkg-sort-order"
								{...register("sort_order")}
								type="number"
								min={0}
								placeholder="0"
								className="w-full h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
							/>
						</div>

						<label className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all">
							<input
								{...register("is_featured")}
								type="checkbox"
								className="w-4 h-4 rounded accent-indigo-600"
							/>
							<span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
								Featured
							</span>
						</label>

						<label className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all">
							<input
								{...register("is_active")}
								type="checkbox"
								className="w-4 h-4 rounded accent-emerald-600"
							/>
							<span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
								Aktif
							</span>
						</label>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-3 pt-2 border-t border-slate-50">
						<Button
							type="button"
							variant="outline"
							onClick={() => !isSubmitting && onClose()}
							disabled={isSubmitting}
							className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-slate-100 hover:bg-slate-50"
						>
							Batal
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-slate-900/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{isSubmitting ? (
								<>
									<Loader2 size={14} className="animate-spin" /> Menyimpan…
								</>
							) : (
								<>
									<Package size={14} />{" "}
									{isEdit ? "Simpan Perubahan" : "Buat Paket"}
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>,
		document.body,
	);
}
