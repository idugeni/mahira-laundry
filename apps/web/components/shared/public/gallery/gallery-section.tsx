"use client";

import {
	AnimatePresence,
	LayoutGroup,
	motion,
	type PanInfo,
	useMotionValue,
	useSpring,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const springConfig = { damping: 25, stiffness: 200 };
	const cursorX = useSpring(mouseX, springConfig);
	const cursorY = useSpring(mouseY, springConfig);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		mouseX.set(e.clientX - rect.left);
		mouseY.set(e.clientY - rect.top);
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
			transition={{
				duration: 0.8,
				delay: index * 0.05,
				ease: [0.16, 1, 0.3, 1],
			}}
			whileHover={{ y: -10 }}
			className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 cursor-none"
			onMouseMove={handleMouseMove}
			onClick={onClick}
		>
			<Image
				src={item.image_url}
				alt={item.title}
				fill
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
				className="object-cover transition-transform duration-1000 group-hover:scale-110"
				priority={index < 3}
			/>

			{/* Overlay Gradient */}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-90 transition-all duration-500" />

			<div className="absolute inset-0 flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
				<div className="flex items-center gap-3 mb-4">
					<span className="w-10 h-px bg-brand-primary" />
					<span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">
						{item.category || "PREMIUM"}
					</span>
				</div>
				<h3 className="text-white font-black font-[family-name:var(--font-heading)] text-3xl leading-none tracking-tight mb-4">
					{item.title}
				</h3>
				<p className="text-slate-300 text-sm font-medium line-clamp-2 leading-relaxed">
					{item.description || "Dedikasi kami untuk hasil pengerjaan terbaik."}
				</p>

				<div className="mt-8 flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl">
						<HiOutlineViewColumns size={20} />
					</div>
					<span className="text-white text-[10px] font-black uppercase tracking-widest">
						Detail View
					</span>
				</div>
			</div>

			{/* Custom Cursor for Hover - Now actually following the mouse */}
			<motion.div
				className="absolute pointer-events-none z-30 opacity-0 group-hover:opacity-100 hidden lg:flex items-center justify-center"
				style={{
					left: cursorX,
					top: cursorY,
					x: "-50%",
					y: "-50%",
				}}
			>
				<motion.div
					className="w-24 h-24 bg-brand-primary/20 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white"
					animate={{ scale: [1, 1.1, 1] }}
					transition={{ repeat: Infinity, duration: 2 }}
				>
					<span className="text-[10px] font-black tracking-widest uppercase">
						Lihat
					</span>
				</motion.div>
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
		filter === "Semua"
			? items
			: items.filter((item) => item.category === filter);

	const visibleItems = filteredItems.slice(0, displayLimit);
	const hasMore = filteredItems.length > displayLimit;

	const handleNext = () => {
		if (!selectedItem) return;
		const currentIndex = filteredItems.findIndex(
			(item) => item.id === selectedItem.id,
		);
		const nextIndex = (currentIndex + 1) % filteredItems.length;
		setSelectedItem(filteredItems[nextIndex]);
	};

	const handlePrev = () => {
		if (!selectedItem) return;
		const currentIndex = filteredItems.findIndex(
			(item) => item.id === selectedItem.id,
		);
		const prevIndex =
			(currentIndex - 1 + filteredItems.length) % filteredItems.length;
		setSelectedItem(filteredItems[prevIndex]);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!selectedItem) return;
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "ArrowLeft") handlePrev();
			if (e.key === "Escape") setSelectedItem(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedItem, filteredItems]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<section
			className={`${isGalleryPage ? "pt-10 pb-32" : "py-24"} bg-white relative overflow-hidden`}
		>
			{/* Decorative Background */}
			<div className="absolute inset-0 pointer-events-none opacity-40">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="flex flex-col items-center text-center gap-12 mb-20">
					<div className="max-w-3xl">
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
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
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
							className="text-6xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.8] tracking-tighter"
						>
							Eksplorasi <br />
							<span className="text-brand-gradient">Detail Kualitas.</span>
						</motion.h2>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex flex-wrap justify-center gap-3"
					>
						<LayoutGroup>
							{categories.map((cat) => (
								<button
									type="button"
									key={cat}
									onClick={() => setFilter(cat)}
									className={`relative px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
										filter === cat
											? "text-white"
											: "text-slate-400 hover:text-slate-900 bg-slate-50/80"
									}`}
								>
									{filter === cat && (
										<motion.div
											layoutId="active-cat-bg"
											className="absolute inset-0 bg-slate-900 rounded-full shadow-2xl shadow-slate-200"
											transition={{
												type: "spring",
												bounce: 0.2,
												duration: 0.6,
											}}
										/>
									)}
									<span className="relative z-10">{cat}</span>
								</button>
							))}
						</LayoutGroup>
					</motion.div>
				</div>

				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					<AnimatePresence mode="popLayout">
						{visibleItems.length === 0 ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="col-span-full py-32 text-center bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center"
							>
								<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-6">
									<HiOutlineViewColumns size={40} />
								</div>
								<p className="text-slate-400 font-black uppercase tracking-widest text-xs">
									Galeri Belum Tersedia.
								</p>
							</motion.div>
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
					</AnimatePresence>
				</motion.div>

				{hasMore && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						className="mt-20 text-center"
					>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => setDisplayLimit((prev) => prev + 6)}
							className="inline-flex items-center gap-5 px-12 py-6 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
						>
							<span>Muat Koleksi Lain</span>
							<HiOutlineArrowRight size={20} />
						</motion.button>
					</motion.div>
				)}

				{!hasMore && showGalleryLink && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-20 text-center"
					>
						<Link
							href="/galeri"
							className="inline-flex items-center gap-4 px-10 py-5 border border-slate-200 text-slate-500 rounded-full font-black text-xs uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all group"
						>
							<span>Buka Galeri Utama</span>
							<span className="group-hover:translate-x-2 transition-transform">
								<HiOutlineArrowRight />
							</span>
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
						className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 lg:p-20"
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setSelectedItem(null)}
							className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl"
						/>

						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 100 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 100 }}
							transition={{ type: "spring", damping: 30, stiffness: 300 }}
							onClick={(e: React.MouseEvent) => e.stopPropagation()}
							className="relative w-full max-w-7xl h-full flex flex-col lg:flex-row bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_200px_-50px_rgba(0,0,0,0.8)]"
						>
							{/* Image Container */}
							<div className="relative w-full lg:w-2/3 h-1/2 lg:h-full bg-slate-950 overflow-hidden group">
								<AnimatePresence mode="wait">
									<motion.div
										key={selectedItem.id}
										initial={{ opacity: 0, x: 100 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -100 }}
										transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
										className="relative w-full h-full"
									>
										<Image
											src={selectedItem.image_url}
											alt={selectedItem.title}
											fill
											className="object-contain"
											sizes="(max-width: 1024px) 100vw, 66vw"
											priority
										/>
									</motion.div>
								</AnimatePresence>

								{/* Navigation Buttons */}
								<div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={handlePrev}
										className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-slate-900 transition-all"
									>
										<HiOutlineChevronLeft size={24} />
									</button>
									<button
										onClick={handleNext}
										className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-slate-900 transition-all"
									>
										<HiOutlineChevronRight size={24} />
									</button>
								</div>
							</div>

							{/* Info Section */}
							<div className="flex-1 p-8 lg:px-12 lg:py-10 flex flex-col justify-between relative bg-white overflow-hidden">
								<button
									onClick={() => setSelectedItem(null)}
									className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-20"
								>
									<HiOutlineXMark size={24} />
								</button>

								<div>
									<motion.div
										key={`meta-${selectedItem.id}`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className="inline-flex px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6"
									>
										{selectedItem.category}
									</motion.div>
									<motion.h3
										key={`title-${selectedItem.id}`}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.8] tracking-tighter mb-6"
									>
										{selectedItem.title}
									</motion.h3>
									<motion.p
										key={`desc-${selectedItem.id}`}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
										className="text-slate-500 text-lg font-medium leading-relaxed italic"
									>
										{selectedItem.description ||
											"Setiap helai kain ditangani dengan presisi dan standar kebersihan tertinggi Mahira."}
									</motion.p>
								</div>

								<div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
											<HiOutlinePhoto size={20} />
										</div>
										<div>
											<p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
												Portfolio
											</p>
											<p className="text-xs font-black text-slate-900">
												Mahira Premium
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
											Katalog
										</p>
										<p className="text-xl font-black text-brand-primary tabular-nums">
											{(
												filteredItems.findIndex(
													(i) => i.id === selectedItem.id,
												) + 1
											)
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
