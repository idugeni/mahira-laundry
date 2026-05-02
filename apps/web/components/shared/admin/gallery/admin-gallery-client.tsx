"use client";

import { format } from "date-fns";
import {
	Camera,
	Check,
	ChevronDown,
	CloudUpload,
	Edit3,
	Image as ImageIcon,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	addGalleryItem,
	deleteGalleryItem,
	updateGalleryItem,
} from "@/lib/actions/gallery";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories = ["Hasil Cucian", "Fasilitas", "Proses", "Lainnya"];

function CategoryDropdown({
	value,
	onChange,
	options,
	placeholder = "Pilih kategori",
	className,
}: {
	value: string;
	onChange: (value: string) => void;
	options: string[];
	placeholder?: string;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={rootRef} className={cn("relative z-30", className)}>
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className={cn(
					"flex h-11 w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 text-left text-sm font-bold text-slate-700 outline-none",
					"transition-colors hover:bg-white focus:bg-white focus:ring-4 focus:ring-indigo-500/10",
					open && "bg-white ring-4 ring-indigo-500/10",
				)}
			>
				<span className={cn(!value && "text-slate-400")}>
					{value || placeholder}
				</span>
				<ChevronDown
					size={17}
					className={cn(
						"text-slate-400 transition-transform duration-200",
						open && "rotate-180 text-indigo-500",
					)}
				/>
			</button>

			{open ? (
				<div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-900/10">
					<div className="max-h-64 overflow-y-auto">
						{options.map((option) => {
							const active = option === value;

							return (
								<button
									key={option}
									type="button"
									onClick={() => {
										onChange(option);
										setOpen(false);
									}}
									className={cn(
										"flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-black text-slate-600 transition-colors",
										"hover:bg-indigo-50 hover:text-indigo-600",
										active &&
											"bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white",
									)}
								>
									<span>{option}</span>
									{active ? <Check size={16} /> : null}
								</button>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}

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
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleteImageUrl, setDeleteImageUrl] = useState<string | null>(null);

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
		setEditCategory(item.category || categories[0]);
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

	function confirmDelete(id: string, imageUrl: string) {
		setDeleteId(id);
		setDeleteImageUrl(imageUrl);
	}

	async function handleDelete() {
		if (!deleteId || !deleteImageUrl) return;

		const promise = deleteGalleryItem(deleteId, deleteImageUrl);

		toast.promise(promise, {
			loading: "Menghapus identitas visual...",
			success: () => {
				setItems(items.filter((i) => i.id !== deleteId));
				setDeleteId(null);
				setDeleteImageUrl(null);
				return "Aset visual berhasil dimusnahkan.";
			},
			error: "Interupsi sistem: Pembersihan gagal.",
		});
	}

	return (
		<div className="space-y-8 sm:space-y-12">
			<AlertDialog
				open={!!deleteId}
				onOpenChange={(open: boolean) =>
					!open && (setDeleteId(null), setDeleteImageUrl(null))
				}
			>
				<AlertDialogContent className="rounded-[2.5rem] border-slate-100 p-8">
					<AlertDialogHeader>
						<div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 mx-auto sm:mx-0 shadow-inner">
							<Trash2 />
						</div>
						<AlertDialogTitle className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Hapus Aset Visual?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-500 font-medium text-base">
							Aset visual ini akan dihapus secara permanen dan tidak dapat
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
			<div className="relative overflow-hidden rounded-none bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/30 sm:rounded-3xl sm:p-8 md:rounded-[2rem] md:p-10">
				<div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

				<div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-3">
							<Badge className="border-none bg-indigo-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-500">
								Visual Identity
							</Badge>
							<span className="text-slate-600">•</span>
							<span className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
								<Camera size={14} /> {items.length} Aset
							</span>
						</div>

						<h1 className="font-[family-name:var(--font-heading)] text-3xl font-black leading-none tracking-tight sm:text-5xl md:text-6xl">
							Arsip <span className="text-indigo-400 italic">Visual</span>
						</h1>

						<p className="max-w-2xl text-xs font-bold leading-relaxed text-slate-400 sm:text-sm md:text-base">
							Etalase digital kualitas Mahira Laundry. Kelola dokumentasi
							fasilitas, proses, dan hasil layanan dalam satu pusat kendali.
						</p>
					</div>

					<div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
						<div className="text-right">
							<p className="text-4xl font-black text-white">{items.length}</p>
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
								Total Media
							</p>
						</div>
						<div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
							<ImageIcon size={28} className="text-indigo-400" />
						</div>
					</div>
				</div>
			</div>

			<div className="grid items-start gap-6 md:grid-cols-12 md:gap-8">
				<div className="order-first md:col-span-4">
					<div className="relative z-40 md:sticky md:top-4">
						<Card className="overflow-visible rounded-none border-y border-slate-100 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:border">
							<CardHeader className="border-b border-slate-100 px-6 pb-5 pt-6">
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
										<Plus size={24} />
									</div>
									<div>
										<CardTitle className="text-lg font-black uppercase tracking-tight text-slate-950">
											Input Aset Baru
										</CardTitle>
										<CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
											Upload visual premium
										</CardDescription>
									</div>
								</div>
							</CardHeader>

							<form onSubmit={handleUpload}>
								<CardContent className="space-y-5 px-6">
									<div className="space-y-2">
										<Label
											htmlFor="gallery-title"
											className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
										>
											Deskripsi Aset
										</Label>
										<Input
											id="gallery-title"
											name="title"
											required
											placeholder="Judul visual"
											className="h-11 rounded-xl border-slate-100 bg-slate-50 font-bold text-sm transition-colors focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
											Klasifikasi
										</Label>
										<input type="hidden" name="category" value={category} />
										<CategoryDropdown
											value={category}
											onChange={setCategory}
											options={categories}
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
											Source Media
										</Label>
										<div className="group/upload relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-4 border-dashed border-slate-100 bg-slate-50/70 transition-colors hover:border-indigo-100 hover:bg-indigo-50/30">
											{preview ? (
												<Image
													src={preview}
													alt="Preview"
													fill
													sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
													className="object-cover transition-transform duration-500 group-hover/upload:scale-105"
												/>
											) : (
												<div className="flex flex-col items-center gap-4 text-slate-300">
													<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl shadow-slate-200 transition-transform group-hover/upload:-translate-y-1">
														<CloudUpload size={30} />
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
												className="absolute inset-0 z-20 cursor-pointer opacity-0"
											/>
										</div>
									</div>
								</CardContent>

								<CardFooter className="px-6 pb-6">
									<Button
										type="submit"
										disabled={isUploading}
										className="h-12 w-full rounded-xl bg-slate-950 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-900/10 transition-colors hover:bg-indigo-600 disabled:opacity-50"
									>
										{isUploading ? "Mengunci Aset..." : "Publish ke Galeri"}
									</Button>
								</CardFooter>
							</form>
						</Card>
					</div>
				</div>

				<div className="flex flex-col gap-6 sm:gap-10 md:col-span-8">
					<div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-0">
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							{["Semua", ...categories].map((cat) => (
								<button
									type="button"
									key={cat}
									onClick={() => handleCategoryChange(cat)}
									className={cn(
										"h-9 rounded-xl px-3 text-[9px] font-black uppercase tracking-widest transition-all duration-200 sm:h-11 sm:rounded-2xl sm:px-6 sm:text-[10px]",
										activeCategory === cat
											? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
											: "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-950",
									)}
								>
									{cat}
								</button>
							))}
						</div>
					</div>

					{filteredItems.length === 0 ? (
						<Card className="flex h-[300px] flex-col items-center justify-center gap-4 rounded-none border-y border-slate-100 text-slate-300 shadow-xl shadow-slate-200/50 sm:h-[420px] sm:rounded-3xl sm:border">
							<div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-dashed border-slate-100 bg-slate-50">
								<ImageIcon size={32} />
							</div>
							<CardTitle className="text-xl font-black uppercase tracking-tight text-slate-800 sm:text-2xl">
								Perpustakaan Visual Kosong
							</CardTitle>
							<CardDescription className="text-xs font-bold uppercase tracking-widest">
								Tidak ada aset pada kategori {activeCategory}
							</CardDescription>
						</Card>
					) : (
						<>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
								{paginatedItems.map((item, index) => (
									<div
										key={item.id}
										className={cn(
											"group relative",
											editingId === item.id && "z-40",
										)}
									>
										<Card className="overflow-visible rounded-none border-b border-slate-100 py-0 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 sm:rounded-3xl sm:border">
											<CardContent className="relative aspect-[4/3] overflow-hidden rounded-t-none p-0 sm:rounded-t-3xl">
												<Image
													src={item.image_url}
													alt={item.title}
													fill
													sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
													loading={index === 0 ? "eager" : undefined}
													priority={index === 0}
													className="object-cover transition-transform duration-700 group-hover:scale-105"
												/>

												<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-8">
													<div className="flex items-center justify-between gap-4">
														<div className="min-w-0 flex-1">
															<Badge className="mb-2 border-none bg-white/20 px-3 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
																{item.category || "Lainnya"}
															</Badge>
															<CardTitle className="truncate text-lg font-black uppercase tracking-tight text-white sm:text-xl">
																{item.title}
															</CardTitle>
														</div>

														<div className="flex gap-2">
															<Button
																size="icon"
																variant="ghost"
																className="h-10 w-10 rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white hover:text-slate-950"
																onClick={() => startEdit(item)}
															>
																<Edit3 size={18} />
															</Button>
															<Button
																size="icon"
																variant="ghost"
																className="h-10 w-10 rounded-xl border border-red-500/10 bg-red-500/20 text-red-100 backdrop-blur-xl transition-colors hover:bg-red-500 hover:text-white"
																onClick={() =>
																	confirmDelete(item.id, item.image_url)
																}
															>
																<Trash2 size={18} />
															</Button>
														</div>
													</div>
												</div>
											</CardContent>

											{editingId === item.id ? (
												<CardContent className="space-y-3 rounded-b-3xl bg-slate-50 p-4">
													<div className="space-y-2">
														<Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
															Judul Aset
														</Label>
														<Input
															value={editTitle}
															onChange={(e) => setEditTitle(e.target.value)}
															className="rounded-xl border-slate-200 bg-white font-bold text-sm"
															placeholder="Judul..."
														/>
													</div>

													<div className="space-y-2">
														<Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
															Kategori
														</Label>
														<CategoryDropdown
															value={editCategory}
															onChange={setEditCategory}
															options={categories}
															placeholder="Pilih kategori"
														/>
													</div>

													<CardFooter className="px-0 pb-0 pt-0">
														<div className="flex w-full gap-2">
															<Button
																size="sm"
																className="flex-1 rounded-xl bg-slate-950 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600"
																onClick={() => saveEdit(item.id)}
															>
																<Check size={14} className="mr-1" /> Simpan
															</Button>
															<Button
																size="sm"
																variant="outline"
																className="rounded-xl text-[10px] font-black uppercase tracking-widest"
																onClick={cancelEdit}
															>
																<X size={14} />
															</Button>
														</div>
													</CardFooter>
												</CardContent>
											) : (
												<CardFooter className="rounded-b-none px-4 py-3 transition-colors duration-500 group-hover:bg-slate-950 sm:rounded-b-3xl">
													<div className="flex w-full items-center justify-between">
														<div className="flex min-w-0 items-center gap-2">
															<div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
															<CardDescription className="max-w-[140px] truncate text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-indigo-400">
																{item.title}
															</CardDescription>
														</div>
														<Badge className="border-none bg-slate-50 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-none group-hover:bg-white/5 group-hover:text-slate-400">
															{format(new Date(item.created_at), "dd/MM/yyyy")}
														</Badge>
													</div>
												</CardFooter>
											)}
										</Card>
									</div>
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
