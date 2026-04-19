"use client";

import {
	Camera,
	Check,
	CloudUpload,
	Edit3,
	Image as ImageIcon,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { PaginationControls } from "@/components/shared/common/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	addGalleryItem,
	deleteGalleryItem,
	updateGalleryItem,
} from "@/lib/actions/gallery";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories = ["Hasil Cucian", "Fasilitas", "Proses", "Lainnya"];

export function AdminGalleryClient({
	initialItems,
}: {
	initialItems: GalleryItem[];
}) {
	const [items, setItems] = useState(initialItems);
	const [isUploading, setIsUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const [category, setCategory] = useState(categories[0]);
	const [activeCategory, setActiveCategory] = useState("Semua");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editCategory, setEditCategory] = useState("");

	const filteredItems =
		activeCategory === "Semua"
			? items
			: items.filter((item) => item.category === activeCategory);

	const totalPages = Math.ceil(filteredItems.length / pageSize);
	const paginatedItems = filteredItems.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const handleCategoryChange = (cat: string) => {
		setActiveCategory(cat);
		setCurrentPage(1);
	};

	function startEdit(item: GalleryItem) {
		setEditingId(item.id);
		setEditTitle(item.title);
		setEditCategory(item.category ?? "");
	}

	function cancelEdit() {
		setEditingId(null);
		setEditTitle("");
		setEditCategory("");
	}

	async function saveEdit(id: string) {
		const promise = updateGalleryItem(id, {
			title: editTitle,
			category: editCategory,
		});

		toast.promise(promise, {
			loading: "Menyimpan perubahan...",
			success: () => {
				setItems(
					items.map((i) =>
						i.id === id
							? { ...i, title: editTitle, category: editCategory }
							: i,
					),
				);
				cancelEdit();
				return "Aset visual berhasil diperbarui!";
			},
			error: (err: unknown) => {
				const error = err as Error;
				return error.message || "Gagal memperbarui aset.";
			},
		});
	}

	async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsUploading(true);

		const formData = new FormData(e.currentTarget);
		const promise = addGalleryItem(formData);

		toast.promise(promise, {
			loading: "Mengarsip foto kualitas...",
			success: () => {
				setIsUploading(false);
				setPreview(null);
				window.location.reload();
				return "Visual asset berhasil diamankan!";
			},
			error: (err: unknown) => {
				const error = err as Error;
				setIsUploading(false);
				return error.message || "Interupsi sistem: Gagal mengunggah.";
			},
		});
	}

	async function handleDelete(id: string, imageUrl: string) {
		if (!confirm("Hapus aset visual ini secara permanen?")) return;

		const promise = deleteGalleryItem(id, imageUrl);

		toast.promise(promise, {
			loading: "Menghapus identitas visual...",
			success: () => {
				setItems(items.filter((i) => i.id !== id));
				return "Aset visual berhasil dimusnahkan.";
			},
			error: "Interupsi sistem: Pembersihan gagal.",
		});
	}

	return (
		<div className="space-y-8 sm:space-y-12 pb-16 sm:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-none sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 text-white shadow-2xl shadow-slate-900/40 group">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center gap-3">
							<Badge className="bg-indigo-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Visual Identity
							</Badge>
							<span className="text-slate-500">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Camera size={14} /> {items.length} Aset
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none">
							Arsip <span className="text-indigo-400 italic">Visual</span>
						</h1>
						<p className="text-slate-400 font-bold text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed">
							Etalase digital kualitas Mahira Laundry. Kelola standar visual dan
							dokumentasi fasilitas.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<div className="text-right">
							<p className="text-3xl font-black text-white">{items.length}</p>
							<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
								Total Media
							</p>
						</div>
						<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
							<ImageIcon size={28} className="text-indigo-400" />
						</div>
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">
				{/* Upload Control Center — sticky on desktop, normal on mobile */}
				<div className="lg:col-span-4 order-first">
					<div className="sticky top-4">
						<form
							onSubmit={handleUpload}
							className="bg-white p-6 sm:p-8 rounded-none sm:rounded-[3rem] border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col gap-6 sm:gap-8"
						>
							<div className="flex items-center gap-3 border-b border-slate-50 pb-4 sm:pb-6">
								<div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
									<Plus size={24} />
								</div>
								<h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
									Input Aset Baru
								</h3>
							</div>

							<div className="space-y-4 sm:space-y-6">
								<div className="space-y-2">
									<label
										htmlFor="gallery-title"
										className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
									>
										Deskripsi Aset
									</label>
									<Input
										id="gallery-title"
										name="title"
										required
										placeholder="Judul visual (e.g. Lobby Sultan)"
										className="py-5 sm:py-6 rounded-2xl border-slate-50 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="gallery-category"
										className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
									>
										Klasifikasi
									</label>
									<input type="hidden" name="category" value={category} />
									<Select value={category} onValueChange={setCategory}>
										<SelectTrigger
											id="gallery-category"
											className="px-5 h-12 sm:h-14 rounded-2xl border-slate-50 bg-slate-50 focus:bg-white font-bold text-sm transition-all"
										>
											<SelectValue placeholder="Pilih Kategori" />
										</SelectTrigger>
										<SelectContent className="rounded-3xl border-slate-100 shadow-2xl p-2">
											{categories.map((c) => (
												<SelectItem
													key={c}
													value={c}
													className="rounded-xl py-3 font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer"
												>
													{c}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
										Source Media
									</p>
									<div className="relative aspect-video rounded-2xl sm:rounded-3xl border-4 border-dashed border-slate-50 overflow-hidden group/upload hover:border-indigo-100 transition-all cursor-pointer bg-slate-50/50 flex flex-col items-center justify-center gap-4">
										{preview ? (
											<Image
												src={preview}
												alt="Preview"
												fill
												className="object-cover transition-transform duration-700 group-hover/upload:scale-110"
											/>
										) : (
											<div className="flex flex-col items-center gap-4 text-slate-300">
												<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg group-hover/upload:scale-110 transition-transform shadow-slate-100">
													<CloudUpload size={28} />
												</div>
												<span className="text-[10px] font-black uppercase tracking-widest">
													Pilih File Visual
												</span>
											</div>
										)}
										<input
											type="file"
											name="image"
											required
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) setPreview(URL.createObjectURL(file));
											}}
											className="absolute inset-0 opacity-0 cursor-pointer z-20"
										/>
									</div>
								</div>

								<Button
									type="submit"
									disabled={isUploading}
									className="w-full h-14 sm:h-16 rounded-[1.5rem] bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
								>
									{isUploading ? "Mengunci Aset..." : "Publish ke Galeri"}
								</Button>
							</div>
						</form>
					</div>
				</div>

				{/* Asset Library Grid */}
				<div className="lg:col-span-8 flex flex-col gap-6 sm:gap-10">
					{/* Filter Row */}
					<div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 px-4 sm:px-0">
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							{["Semua", ...categories].map((cat) => (
								<Button
									key={cat}
									variant="ghost"
									className={cn(
										"rounded-xl sm:rounded-2xl h-9 sm:h-11 px-3 sm:px-6 font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all",
										activeCategory === cat
											? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
											: "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50",
									)}
									onClick={() => handleCategoryChange(cat)}
								>
									{cat}
								</Button>
							))}
						</div>
					</div>

					{filteredItems.length === 0 ? (
						<div className="h-[300px] sm:h-[500px] flex flex-col items-center justify-center bg-white rounded-none sm:rounded-[4rem] border-y sm:border border-slate-100 text-slate-300 shadow-xl shadow-slate-200/40">
							<div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-slate-100">
								<ImageIcon size={40} />
							</div>
							<h3 className="text-xl sm:text-2xl font-black uppercase text-slate-800 tracking-tight">
								Perpustakaan Visual Kosong
							</h3>
							<p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
								Tidak ada aset pada kategori {activeCategory}
							</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
								{paginatedItems.map((item) => (
									<motion.div
										key={item.id}
										layout
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										className="group relative bg-white rounded-none sm:rounded-[3rem] overflow-hidden border-b sm:border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-700"
									>
										<div className="relative aspect-[4/3] overflow-hidden">
											<Image
												src={item.image_url}
												alt={item.title}
												fill
												className="object-cover transition-transform duration-[2s] group-hover:scale-110"
											/>

											{/* Overlay Controls */}
											<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 sm:p-8">
												<div className="flex items-center justify-between gap-4">
													<div className="flex-1 min-w-0">
														<Badge className="bg-white/20 backdrop-blur-md text-white border-none text-[8px] font-black uppercase tracking-widest mb-2 px-3">
															{item.category}
														</Badge>
														<h4 className="font-black text-white text-lg sm:text-xl uppercase tracking-tight truncate">
															{item.title}
														</h4>
													</div>
													<div className="flex gap-2">
														<Button
															size="icon"
															variant="ghost"
															className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all active:scale-95"
															onClick={() => startEdit(item)}
														>
															<Edit3 size={18} />
														</Button>
														<Button
															size="icon"
															variant="ghost"
															className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-500/20 backdrop-blur-xl border border-red-500/10 text-red-100 hover:bg-red-500 hover:text-white transition-all active:scale-95"
															onClick={() =>
																handleDelete(item.id, item.image_url)
															}
														>
															<Trash2 size={18} />
														</Button>
													</div>
												</div>
											</div>
										</div>

										{/* Edit Mode or Normal Footer */}
										{editingId === item.id ? (
											<div className="p-4 sm:p-6 space-y-3 bg-slate-50">
												<Input
													value={editTitle}
													onChange={(e) => setEditTitle(e.target.value)}
													className="rounded-xl font-bold text-sm border-slate-200"
													placeholder="Judul..."
												/>
												<Select
													value={editCategory}
													onValueChange={setEditCategory}
												>
													<SelectTrigger className="rounded-xl font-bold text-sm border-slate-200">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="rounded-xl">
														{categories.map((c) => (
															<SelectItem key={c} value={c}>
																{c}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<div className="flex gap-2">
													<Button
														size="sm"
														className="flex-1 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest"
														onClick={() => saveEdit(item.id)}
													>
														<Check size={14} className="mr-1" /> Simpan
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="rounded-xl font-black text-[10px] uppercase tracking-widest"
														onClick={cancelEdit}
													>
														<X size={14} />
													</Button>
												</div>
											</div>
										) : (
											<div className="p-4 sm:p-6 group-hover:bg-slate-900 transition-colors duration-500">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
														<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors truncate max-w-[120px]">
															{item.title}
														</p>
													</div>
													<Badge className="bg-slate-50 group-hover:bg-white/5 group-hover:text-slate-400 text-slate-400 border-none font-bold text-[9px] uppercase tracking-widest shadow-none">
														{new Date(item.created_at).toLocaleDateString()}
													</Badge>
												</div>
											</div>
										)}
									</motion.div>
								))}
							</div>

							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
								totalItems={filteredItems.length}
								itemsPerPage={pageSize}
								onPageSizeChange={(size) => {
									setPageSize(size);
									setCurrentPage(1);
								}}
								pageSizeOptions={[12, 24, 48]}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
