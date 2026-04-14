"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	HiOutlineArrowRight,
	HiOutlinePhoto,
	HiOutlineViewColumns,
	HiOutlineXMark,
} from "react-icons/hi2";

const categories = ["Semua", "Hasil Cucian", "Fasilitas", "Proses", "Lainnya"];

import type { GalleryItem } from "@/lib/types";

export function GallerySection({ items = [] }: { items?: GalleryItem[] }) {
	const pathname = usePathname();
	const [filter, setFilter] = useState("Semua");
	const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
	const [displayLimit, setDisplayLimit] = useState(6);

	const isGalleryPage = pathname === "/galeri";

	// Only show the link if we are NOT on the gallery page
	// and we have a limited set of items (this is basically a home page helper)
	const showGalleryLink = !isGalleryPage && items.length > 0;

	const filteredItems =
		filter === "Semua"
			? items
			: items.filter((item) => item.category === filter);

	const visibleItems = filteredItems.slice(0, displayLimit);
	const hasMore = filteredItems.length > displayLimit;

	return (
		<section
			className={`${isGalleryPage ? "pt-10 pb-32" : "py-20"} bg-white overflow-hidden`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
					<div className="max-w-2xl">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4"
						>
							<span className="w-3 h-3 flex items-center justify-center">
								<HiOutlinePhoto />
							</span>
							<span>Galeri Mahira</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-tight"
						>
							Melihat Lebih Dekat <br />
							<span className="text-brand-gradient">Kualitas Kami</span>
						</motion.h2>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex flex-wrap gap-2"
					>
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setFilter(cat)}
								className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
									filter === cat
										? "bg-slate-900 text-white shadow-xl shadow-slate-200"
										: "bg-slate-50 text-slate-400 hover:bg-slate-100"
								}`}
							>
								{cat}
							</button>
						))}
					</motion.div>
				</div>

				{filteredItems.length === 0 ? (
					<div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
						<div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300 ring-1 ring-slate-100">
							<span className="w-8 h-8 flex items-center justify-center">
								<HiOutlineViewColumns />
							</span>
						</div>
						<p className="text-slate-400 font-bold">
							Belum ada foto dalam kategori ini.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{visibleItems.map((item, i) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.05 }}
								className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 cursor-zoom-in"
							>
								<Image
									src={item.image_url}
									alt={item.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div
									onClick={() => setSelectedItem(item)}
									className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8"
								>
									<span className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">
										{item.category || "Umum"}
									</span>
									<h3 className="text-white font-bold font-[family-name:var(--font-heading)] text-xl">
										{item.title}
									</h3>
								</div>
							</motion.div>
						))}
					</div>
				)}

				{hasMore ? (
					<div className="mt-16 text-center">
						<button
							onClick={() => setDisplayLimit((prev) => prev + 6)}
							className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200"
						>
							<span>Muat Lebih Banyak</span>
							<span className="w-5 h-5 flex items-center justify-center">
								<HiOutlineArrowRight />
							</span>
						</button>
					</div>
				) : (
					showGalleryLink && (
						<div className="mt-16 text-center">
							<Link
								href="/galeri"
								className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-500 rounded-full font-bold hover:border-brand-primary hover:text-brand-primary transition-all"
							>
								<span>Buka Galeri Utama</span>
								<span className="w-5 h-5 flex items-center justify-center">
									<HiOutlineArrowRight />
								</span>
							</Link>
						</div>
					)
				)}
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedItem && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setSelectedItem(null)}
							className="fixed inset-0 bg-slate-900/90 backdrop-blur-md"
						/>

						<div className="absolute inset-0 overflow-y-auto flex items-start sm:items-center justify-center p-4 sm:p-10 pt-10 pb-20">
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								onClick={(e: React.MouseEvent) => e.stopPropagation()}
								className="relative w-full max-w-6xl bg-white rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-auto lg:h-[600px] my-auto"
							>
								{/* Close Button */}
								<button
									onClick={() => setSelectedItem(null)}
									className="absolute top-4 right-4 z-50 w-10 h-10 lg:w-12 lg:h-12 bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
								>
									<span className="text-xl flex items-center justify-center">
										<HiOutlineXMark />
									</span>
								</button>

								{/* Image Container: Top on mobile, Left on Desktop (lg and up) */}
								<div className="relative w-full lg:w-1/2 aspect-video lg:aspect-auto bg-slate-100 h-auto lg:h-full shrink-0">
									<Image
										src={selectedItem.image_url}
										alt={selectedItem.title}
										fill
										sizes="(max-width: 1024px) 100vw, 1000px"
										className="object-cover"
										priority
									/>
								</div>

								{/* Info Container: Bottom on mobile, Right on Desktop (lg and up) */}
								<div className="flex-1 p-8 lg:p-14 bg-white flex flex-col justify-center">
									<div className="max-w-md mx-auto lg:mx-0">
										<span className="inline-flex px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6 w-fit">
											{selectedItem.category}
										</span>
										<h3 className="text-3xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-tight mb-6">
											{selectedItem.title}
										</h3>
										<p className="text-slate-500 leading-relaxed italic text-base lg:text-xl">
											{selectedItem.description ||
												"Hasil pengerjaan premium dari Mahira Laundry untuk pelanggan setia kami."}
										</p>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</section>
	);
}
