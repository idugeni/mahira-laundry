"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	HiOutlineArrowRight,
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
	HiOutlinePhoto,
	HiOutlineViewColumns,
	HiOutlineXMark,
} from "react-icons/hi2";

import type { GalleryItem } from "@/lib/types";

const categories = ["Semua", "Hasil Cucian", "Fasilitas", "Proses", "Lainnya"];

function GalleryCard({
	item,
	index,
	onClick,
}: {
	item: GalleryItem;
	index: number;
	onClick: () => void;
}) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4 }}
			viewport={{ once: false }}
			transition={{
				duration: 0.5,
				delay: index * 0.1,
				ease: [0.16, 1, 0.3, 1],
			}}
			className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 cursor-pointer"
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			aria-label={`Buka galeri: ${item.title}`}
		>
			<motion.div
				className="absolute inset-0"
				whileHover={{ scale: 1.05 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
			>
				<Image
					src={item.image_url}
					alt={item.title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover"
					priority={index < 3}
					loading={index < 3 ? "eager" : "lazy"}
				/>
			</motion.div>

			{/* Overlay Gradient */}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			{/* Content */}
			<motion.div
				className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10"
				initial={false}
				animate={{ opacity: 0, y: 16 }}
				whileHover={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
			>
				<div className="flex items-center gap-3 mb-3">
					<span className="w-8 h-px bg-brand-primary" />
					<span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">
						{item.category || "PREMIUM"}
					</span>
				</div>
				<h3 className="text-white font-black font-[family-name:var(--font-heading)] text-2xl sm:text-3xl leading-none tracking-tight mb-3">
					{item.title}
				</h3>
				<p className="text-white/70 text-sm font-medium line-clamp-2 leading-relaxed">
					{item.description || "Dedikasi kami untuk hasil pengerjaan terbaik."}
				</p>

				<div className="mt-6 flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
						<HiOutlineViewColumns size={18} />
					</div>
					<span className="text-white/80 text-[10px] font-black uppercase tracking-widest">
						Lihat Detail
					</span>
				</div>
			</motion.div>
		</motion.div>
	);
}

export function GallerySection({ items = [] }: { items?: GalleryItem[] }) {
	const pathname = usePathname();
	const [filter, setFilter] = useState("Semua");
	const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
	const [displayLimit, setDisplayLimit] = useState(6);

	const isGalleryPage = pathname === "/galeri";
	const showGalleryLink = !isGalleryPage && items.length > 0;

	const filteredItems =
		filter === "Semua" ? items : items.filter((item) => item.category === filter);

	const visibleItems = filteredItems.slice(0, displayLimit);
	const hasMore = filteredItems.length > displayLimit;

	const handleNext = useCallback(() => {
		if (!selectedItem) return;
		const currentIndex = filteredItems.findIndex((item) => item.id === selectedItem.id);
		const nextIndex = (currentIndex + 1) % filteredItems.length;
		setSelectedItem(filteredItems[nextIndex] ?? null);
	}, [selectedItem, filteredItems]);

	const handlePrev = useCallback(() => {
		if (!selectedItem) return;
		const currentIndex = filteredItems.findIndex((item) => item.id === selectedItem.id);
		const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
		setSelectedItem(filteredItems[prevIndex] ?? null);
	}, [selectedItem, filteredItems]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!selectedItem) return;
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "ArrowLeft") handlePrev();
			if (e.key === "Escape") setSelectedItem(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedItem, handlePrev, handleNext]);

	useEffect(() => {
		if (selectedItem) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedItem]);

	return (
		<section
			className={`${isGalleryPage ? "pt-10 pb-32" : "py-14 sm:py-16"} bg-white relative overflow-hidden w-full min-w-0`}
		>
			{/* Decorative Background */}
			<div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
				<div className="absolute top-0 right-0 w-[min(420px,45vw)] h-[420px] bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/3" />
				<div className="absolute bottom-0 left-0 w-[min(420px,45vw)] h-[420px] bg-brand-accent/5 rounded-full blur-[120px] translate-y-1/3" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="flex flex-col items-center text-center gap-12 mb-20">
					<div className="max-w-3xl">
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: false }}
							className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-brand-primary/10"
						>
							<motion.span
								animate={{ rotate: 360 }}
								transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
								className="w-4 h-4 flex items-center justify-center"
							>
								<HiOutlinePhoto size={14} />
							</motion.span>
							<span>Karya Nyata Kami</span>
						</motion.div>
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: false }}
							transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.8] tracking-tighter"
						>
							Eksplorasi <br />
							<span className="text-brand-gradient">Detail Kualitas.</span>
						</motion.h2>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: false }}
						transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="flex flex-wrap justify-center gap-2 sm:gap-3"
					>
						{categories.map((cat) => (
							<button
								type="button"
								key={cat}
								onClick={() => setFilter(cat)}
								className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-300 ease-out ${
									filter === cat
										? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105"
										: "text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs"
								}`}
							>
								{cat}
							</button>
						))}
					</motion.div>
				</div>

				<motion.div
					key={filter}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: false }}
					transition={{ duration: 0.3 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{visibleItems.length === 0 ? (
						<div className="col-span-full py-16 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
							<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-xs mb-6">
								<HiOutlineViewColumns size={40} />
							</div>
							<p className="text-slate-400 font-black uppercase tracking-widest text-xs">
								Galeri Belum Tersedia.
							</p>
						</div>
					) : (
						visibleItems.map((item, i) => (
							<GalleryCard
								key={item.id}
								item={item}
								index={i}
								onClick={() => setSelectedItem(item)}
							/>
						))
					)}
				</motion.div>

				{hasMore && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: false }}
						transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="mt-20 text-center"
					>
						<motion.button
							type="button"
							onClick={() => setDisplayLimit((prev) => prev + 6)}
							className="group inline-flex items-center gap-4 px-8 py-4 bg-slate-50 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100"
						>
							<span>Muat Koleksi Lain</span>
							<motion.div
								animate={{ x: [0, 5, 0] }}
								transition={{ repeat: Infinity, duration: 1.5 }}
							>
								<HiOutlineArrowRight size={18} />
							</motion.div>
						</motion.button>
					</motion.div>
				)}

				{!hasMore && showGalleryLink && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: false }}
						transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="mt-20 text-center"
					>
						<Link
							href="/galeri"
							className="group inline-flex items-center gap-4 px-8 py-4 bg-slate-50 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100"
						>
							<span>Buka Galeri Utama</span>
							<motion.div
								animate={{ x: [0, 5, 0] }}
								transition={{ repeat: Infinity, duration: 1.5 }}
							>
								<HiOutlineArrowRight size={18} />
							</motion.div>
						</Link>
					</motion.div>
				)}
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{selectedItem && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-20"
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setSelectedItem(null)}
							role="presentation"
							className="absolute inset-0 bg-black/30 backdrop-blur-xs"
						/>

						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
							onClick={(e: React.MouseEvent) => e.stopPropagation()}
							className="relative w-full max-w-7xl h-[90dvh] sm:h-[85dvh] md:h-auto md:aspect-[2/1] flex flex-col md:flex-row bg-white/80 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-[0_50px_200px_-50px_rgba(0,0,0,0.8)]"
						>
							{/* Image Container - Full Height */}
							<div className="relative w-full md:w-3/5 flex-1 min-h-0 md:flex-none md:aspect-auto md:h-full overflow-hidden group">
								<AnimatePresence mode="wait">
									<motion.div
										key={selectedItem.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="relative w-full h-full"
									>
										<Image
											src={selectedItem.image_url}
											alt={selectedItem.title}
											fill
											className="object-cover"
											sizes="(max-width: 1024px) 100vw, 60vw"
											priority
										/>
									</motion.div>
								</AnimatePresence>

								{/* Navigation Buttons */}
								<div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
									<button
										type="button"
										onClick={handlePrev}
										className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-slate-900 transition-all duration-300"
									>
										<HiOutlineChevronLeft size={18} />
									</button>
									<button
										type="button"
										onClick={handleNext}
										className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-slate-900 transition-all duration-300"
									>
										<HiOutlineChevronRight size={18} />
									</button>
								</div>
							</div>

							{/* Info Section - Centered */}
							<div className="flex-none sm:flex-1 sm:min-h-0 flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 relative bg-white max-h-[40dvh] sm:max-h-none md:max-h-none overflow-y-auto">
								<button
									type="button"
									onClick={() => setSelectedItem(null)}
									className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-20"
								>
									<HiOutlineXMark size={20} />
								</button>

								<div className="text-center max-w-sm">
									<motion.div
										key={`meta-${selectedItem.id}`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.1 }}
										className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8 border border-brand-primary/10"
									>
										<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
										{selectedItem.category}
									</motion.div>

									<motion.h3
										key={`title-${selectedItem.id}`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.5,
											delay: 0.15,
											ease: [0.16, 1, 0.3, 1],
										}}
										className="text-3xl sm:text-4xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.9] tracking-tighter mb-6"
									>
										{selectedItem.title}
									</motion.h3>

									<motion.div
										key={`divider-${selectedItem.id}`}
										initial={{ scaleX: 0 }}
										animate={{ scaleX: 1 }}
										transition={{
											duration: 0.5,
											delay: 0.25,
											ease: [0.16, 1, 0.3, 1],
										}}
										className="w-12 h-px bg-brand-primary mx-auto mb-6"
									/>

									<motion.p
										key={`desc-${selectedItem.id}`}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}
										className="text-slate-500 text-base font-medium leading-relaxed"
									>
										{selectedItem.description ||
											"Setiap helai kain ditangani dengan presisi dan standar kebersihan tertinggi Mahira."}
									</motion.p>
								</div>

								<div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
											<HiOutlinePhoto size={16} />
										</div>
										<div>
											<p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
												Portfolio
											</p>
											<p className="text-[11px] font-black text-slate-900">Mahira Premium</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
											Katalog
										</p>
										<p className="text-xl font-black text-brand-primary tabular-nums">
											{(filteredItems.findIndex((i) => i.id === selectedItem.id) + 1)
												.toString()
												.padStart(2, "0")}
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
