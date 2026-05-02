"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
	Calendar,
	CheckCircle2,
	MessageSquare,
	Pencil,
	Plus,
	Quote,
	Star,
	Trash2,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineChatBubbleBottomCenterText,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import { PaginationControls } from "@/components/shared/common/pagination-controls";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	createTestimonialAsAdmin,
	deleteTestimonial,
	updateTestimonialContent,
	updateTestimonialStatus,
} from "@/lib/actions/testimonial";
import { cn } from "@/lib/utils";

interface Testimonial {
	id: string;
	content: string;
	rating: number;
	is_published: boolean;
	created_at: string;
	guest_name?: string | null;
	profiles: {
		full_name: string | null;
	} | null;
}

interface AdminTestimonialsClientProps {
	testimonials: Testimonial[];
}

export function AdminTestimonialsClient({
	testimonials,
}: AdminTestimonialsClientProps) {
	const [loading, setLoading] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const [createOpen, setCreateOpen] = useState(false);
	const [createLoading, setCreateLoading] = useState(false);
	const [createRating, setCreateRating] = useState(5);

	const [editOpen, setEditOpen] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [editTarget, setEditTarget] = useState<Testimonial | null>(null);
	const [editRating, setEditRating] = useState(5);

	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const ITEMS_PER_PAGE = 9;
	const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
	const paginatedTestimonials = testimonials.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	async function handleToggleStatus(
		testimonialId: string,
		currentStatus: boolean,
	) {
		setLoading(testimonialId);
		try {
			const res = await updateTestimonialStatus(testimonialId, !currentStatus);
			if (res.error) toast.error(res.error);
			else
				toast.success(
					!currentStatus
						? "Testimoni dipublikasikan!"
						: "Testimoni disembunyikan!",
				);
		} catch (_err) {
			toast.error("Gagal memperbarui status.");
		} finally {
			setLoading(null);
		}
	}

	async function handleDelete() {
		if (!deleteId) return;
		setLoading(deleteId);
		try {
			const res = await deleteTestimonial(deleteId);
			if (res.error) toast.error(res.error);
			else toast.success("Testimoni dihapus.");
		} catch (_err) {
			toast.error("Gagal menghapus.");
		} finally {
			setLoading(null);
			setDeleteId(null);
		}
	}

	async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setCreateLoading(true);
		const formData = new FormData(e.currentTarget);
		const res = await createTestimonialAsAdmin({
			userId: formData.get("userId") as string,
			content: formData.get("content") as string,
			rating: createRating,
		});
		if (res.error) {
			toast.error(res.error);
		} else {
			toast.success("Testimoni berhasil dibuat!");
			setCreateOpen(false);
			setCreateRating(5);
		}
		setCreateLoading(false);
	}

	function openEdit(t: Testimonial) {
		setEditTarget(t);
		setEditRating(t.rating);
		setEditOpen(true);
	}

	async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!editTarget) return;
		setEditLoading(true);
		const formData = new FormData(e.currentTarget);
		const res = await updateTestimonialContent(editTarget.id, {
			content: formData.get("content") as string,
			rating: editRating,
		});
		if (res.error) {
			toast.error(res.error);
		} else {
			toast.success("Testimoni berhasil diperbarui!");
			setEditOpen(false);
			setEditTarget(null);
		}
		setEditLoading(false);
	}

	return (
		<div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			<AlertDialog
				open={!!deleteId}
				onOpenChange={(open: boolean) => !open && setDeleteId(null)}
			>
				<AlertDialogContent className="rounded-[2.5rem] border-slate-100 p-8">
					<AlertDialogHeader>
						<div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 mx-auto sm:mx-0 shadow-inner">
							<Trash2 />
						</div>
						<AlertDialogTitle className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Hapus Testimoni?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-500 font-medium text-base">
							Testimoni ini akan dihapus secara permanen dan tidak dapat
							dikembalikan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
						<AlertDialogCancel className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-slate-100 hover:bg-slate-50 transition-all">
							Batal
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								handleDelete();
							}}
							className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600 shadow-xl shadow-red-100 transition-all"
						>
							Hapus Sekarang
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-white rounded-none sm:rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />

				<div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-600 border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Kualitas Layanan
							</Badge>
							<span className="text-slate-200">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<MessageSquare size={14} /> {testimonials.length} Ulasan Total
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none text-slate-900">
							Moderasi <span className="text-indigo-600 italic">Testimoni</span>
						</h1>
						<p className="text-slate-500 font-bold text-sm md:text-base max-w-2xl leading-relaxed">
							Kurasi ulasan pelanggan terbaik untuk ditampilkan pada etalase
							digital Mahira Laundry. Pastikan standar kepuasan tetap terjaga.
						</p>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex flex-col items-end">
							<p className="text-2xl font-black text-slate-900">
								{testimonials.filter((t) => t.is_published).length}
							</p>
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								Published
							</p>
						</div>
						<div className="w-px h-10 bg-slate-100 mx-2" />
						<div className="flex flex-col items-start">
							<p className="text-2xl font-black text-amber-500">
								{testimonials.filter((t) => !t.is_published).length}
							</p>
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								Pending
							</p>
						</div>
						<div className="w-px h-10 bg-slate-100 mx-2" />
						<Button
							onClick={() => setCreateOpen(true)}
							className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl px-4 h-11 font-black text-[10px] uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2.5"
						>
							<Plus size={18} />
							Tambah Testimoni
						</Button>
					</div>
				</div>
			</div>

			{/* Testimonials Grid */}
			{testimonials.length === 0 ? (
				<div className="bg-white rounded-2xl border border-slate-100 px-6 py-14 sm:px-10 sm:py-16 text-center shadow-xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
					<div className="relative flex flex-col items-center">
						<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5 border-4 border-dashed border-slate-100">
							<MessageSquare size={32} className="text-slate-200" />
						</div>
						<h3 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
							Belum Ada Suara
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed text-center mx-auto">
							Kotak saran digital Mahira Laundry masih kosong. Mari kita
							kumpulkan ulasan dari pelanggan setia.
						</p>
					</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{paginatedTestimonials.map((t) => (
							<div
								key={t.id}
								className="group relative bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-shadow duration-300 overflow-hidden"
							>
								<div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors pointer-events-none">
									<Quote size={80} strokeWidth={4} />
								</div>

								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg border-2 border-white shadow-md transition-transform duration-300 group-hover:-translate-y-0.5">
											{(t.guest_name || t.profiles?.full_name)?.charAt(0)}
										</div>
										<div className="min-w-0">
											<p className="font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">
												{t.guest_name || t.profiles?.full_name || "Anonim"}
											</p>
											<div className="flex items-center gap-1.5 mt-1">
												<Calendar size={12} className="text-slate-400" />
												<p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
													{format(new Date(t.created_at), "dd MMM yyyy", {
														locale: id,
													})}
												</p>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											className="w-10 h-10 p-0 rounded-xl bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors shadow-xs"
											onClick={() => openEdit(t)}
											disabled={loading === t.id}
											title="Edit testimoni"
										>
											<Pencil size={18} />
										</Button>
										<Button
											variant="ghost"
											className={cn(
												"w-10 h-10 p-0 rounded-xl transition-colors shadow-xs",
												t.is_published
													? "bg-amber-50 text-amber-500 hover:bg-amber-100"
													: "bg-emerald-50 text-emerald-500 hover:bg-emerald-100",
											)}
											onClick={() => handleToggleStatus(t.id, t.is_published)}
											disabled={loading === t.id}
										>
											{t.is_published ? (
												<XCircle size={24} />
											) : (
												<CheckCircle2 size={24} />
											)}
										</Button>
										<Button
											variant="ghost"
											className="w-10 h-10 p-0 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shadow-xs"
											onClick={() => setDeleteId(t.id)}
											disabled={loading === t.id}
										>
											<Trash2 size={24} />
										</Button>
									</div>
								</div>

								<div className="relative flex-1">
									<div className="flex gap-1 mb-4">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												size={20}
												className={cn(
													"transition-colors duration-300",
													star <= t.rating
														? "text-amber-400 fill-amber-400"
														: "text-slate-100 fill-slate-100",
												)}
											/>
										))}
									</div>
									<p className="text-slate-600 font-bold text-sm leading-relaxed italic relative z-10">
										"{t.content}"
									</p>
								</div>

								<div className="relative pt-6 border-t border-slate-50 flex items-center justify-between">
									<Badge
										className={cn(
											"px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-none shadow-none",
											t.is_published
												? "bg-emerald-50 text-emerald-600"
												: "bg-slate-100 text-slate-400",
										)}
									>
										{t.is_published ? "● Published" : "○ Pelatihan"}
									</Badge>

									<div className="flex items-center gap-1">
										<p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
											Global Review
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						totalItems={testimonials.length}
						itemsPerPage={ITEMS_PER_PAGE}
					/>
				</>
			)}

			{/* ── Create Modal ── */}
			{createOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							aria-label="Tutup modal"
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-default"
							onClick={() => !createLoading && setCreateOpen(false)}
						/>
						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 text-left">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-indigo-600">
											<MessageSquare size={22} />
										</div>
										<div>
											<h2 className="text-xl font-black text-slate-900 tracking-tight">
												Tambah{" "}
												<span className="text-indigo-600">Testimoni</span>
											</h2>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
												Buat testimoni atas nama pengguna
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setCreateOpen(false)}
										className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
									>
										<HiOutlineXMark size={16} />
									</button>
								</div>
							</div>

							{/* Form */}
							<form onSubmit={handleCreate} className="p-8 space-y-5">
								{/* User ID */}
								<div className="space-y-2">
									<label
										htmlFor="testimonial-user-id"
										className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
									>
										User ID
									</label>
									<input
										required
										id="testimonial-user-id"
										type="text"
										name="userId"
										placeholder="UUID pengguna"
										className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
									/>
								</div>

								{/* Rating */}
								<div className="space-y-2">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
										Rating
									</p>
									<div className="flex gap-2">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												onClick={() => setCreateRating(star)}
												className="transition-colors hover:text-amber-500"
											>
												<Star
													size={28}
													className={cn(
														"transition-colors",
														star <= createRating
															? "text-amber-400 fill-amber-400"
															: "text-slate-200 fill-slate-200",
													)}
												/>
											</button>
										))}
									</div>
								</div>

								{/* Content */}
								<div className="space-y-2">
									<label
										htmlFor="testimonial-content"
										className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
									>
										Konten
									</label>
									<div className="relative group/input">
										<span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors">
											<HiOutlineChatBubbleBottomCenterText size={18} />
										</span>
										<textarea
											required
											id="testimonial-content"
											name="content"
											placeholder="Tulis ulasan pelanggan..."
											className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden min-h-[100px] focus:border-indigo-500 focus:bg-white transition-all resize-none"
										/>
									</div>
								</div>

								<button
									type="submit"
									disabled={createLoading}
									className="flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-100 transition-colors hover:bg-indigo-700 disabled:opacity-50"
								>
									{createLoading ? (
										<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										<>
											<Plus size={18} />
											Simpan Testimoni
										</>
									)}
								</button>
							</form>
						</div>
					</div>,
					document.body,
				)}

			{/* ── Edit Modal ── */}
			{editOpen &&
				editTarget &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							aria-label="Tutup modal"
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-default"
							onClick={() => !editLoading && setEditOpen(false)}
						/>
						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 text-left">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-amber-500">
											<Pencil size={20} />
										</div>
										<div>
											<h2 className="text-xl font-black text-slate-900 tracking-tight">
												Edit <span className="text-amber-500">Testimoni</span>
											</h2>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
												{editTarget.guest_name ||
													editTarget.profiles?.full_name ||
													"Anonim"}
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setEditOpen(false)}
										className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
									>
										<HiOutlineXMark size={16} />
									</button>
								</div>
							</div>

							{/* Form */}
							<form onSubmit={handleEdit} className="p-8 space-y-5">
								{/* Rating */}
								<div className="space-y-2">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
										Rating
									</p>
									<div className="flex gap-2">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												onClick={() => setEditRating(star)}
												className="transition-colors hover:text-amber-500"
											>
												<Star
													size={28}
													className={cn(
														"transition-colors",
														star <= editRating
															? "text-amber-400 fill-amber-400"
															: "text-slate-200 fill-slate-200",
													)}
												/>
											</button>
										))}
									</div>
								</div>

								{/* Content */}
								<div className="space-y-2">
									<label
										htmlFor="edit-testimonial-content"
										className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
									>
										Konten
									</label>
									<div className="relative group/input">
										<span className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-amber-500 transition-colors">
											<HiOutlineChatBubbleBottomCenterText size={18} />
										</span>
										<textarea
											required
											id="edit-testimonial-content"
											name="content"
											defaultValue={editTarget.content}
											placeholder="Tulis ulasan pelanggan..."
											className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-hidden min-h-[100px] focus:border-amber-500 focus:bg-white transition-all resize-none"
										/>
									</div>
								</div>

								<button
									type="submit"
									disabled={editLoading}
									className="flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-amber-500 text-sm font-black text-white shadow-lg shadow-amber-100 transition-colors hover:bg-amber-600 disabled:opacity-50"
								>
									{editLoading ? (
										<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									) : (
										<>
											<Pencil size={18} />
											Simpan Perubahan
										</>
									)}
								</button>
							</form>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
