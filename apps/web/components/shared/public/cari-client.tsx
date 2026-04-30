"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	HiOutlineInformationCircle,
	HiOutlineMapPin,
	HiOutlineSparkles,
} from "react-icons/hi2";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { UniversalSearch } from "@/components/shared/public/universal-search";
import { formatIDR } from "@/lib/utils";

interface ServiceResult {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	price: number;
	unit: string;
	icon?: string | null;
	is_express: boolean;
}

interface GalleryResult {
	id: string;
	title: string;
	category?: string | null;
	image_url?: string | null;
}

interface CariClientProps {
	services: ServiceResult[];
	galleryItems: GalleryResult[];
}

const quickPages = [
	{
		href: "/lokasi",
		label: "Lokasi Outlet",
		description: "Temukan outlet terdekat",
		icon: HiOutlineMapPin,
	},
	{
		href: "/tentang",
		label: "Tentang Kami",
		description: "Cerita & visi Mahira",
		icon: HiOutlineInformationCircle,
	},
	{
		href: "/paket-usaha",
		label: "Paket Usaha",
		description: "Mulai bisnis laundry",
		icon: HiOutlineSparkles,
	},
];

export function CariClient({ services, galleryItems }: CariClientProps) {
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") || "");

	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);

	const q = query.toLowerCase().trim();

	const filteredServices = q
		? services.filter(
				(s) =>
					s.name.toLowerCase().includes(q) ||
					s.description?.toLowerCase().includes(q) ||
					s.slug.toLowerCase().includes(q),
			)
		: [];

	const filteredGallery = q
		? galleryItems.filter(
				(g) =>
					g.title.toLowerCase().includes(q) ||
					g.category?.toLowerCase().includes(q),
			)
		: [];

	const hasResults = filteredServices.length > 0 || filteredGallery.length > 0;

	return (
		<div className="min-h-[70vh] py-14 sm:py-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-10"
				>
					<h1 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tighter mb-3">
						Cari <span className="text-brand-gradient">Apapun</span>
					</h1>
					<p className="text-slate-500 font-medium">
						Temukan layanan, galeri, lokasi, dan info lainnya
					</p>
				</motion.div>

				{/* Search Bar */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-12"
				>
					<UniversalSearch
						variant="section"
						placeholder="Cari layanan, galeri, lokasi..."
					/>
				</motion.div>

				{/* No query - Quick Links */}
				{!q && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
							Jelajahi
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							{quickPages.map((page) => {
								const Icon = page.icon;
								return (
									<Link
										key={page.href}
										href={page.href}
										className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
									>
										<div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shrink-0">
											<Icon size={20} />
										</div>
										<div>
											<p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
												{page.label}
											</p>
											<p className="text-[11px] text-slate-400">
												{page.description}
											</p>
										</div>
									</Link>
								);
							})}
						</div>

						{/* Popular Services */}
						<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 mt-10">
							Layanan Populer
						</p>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{services.slice(0, 6).map((service) => (
								<Link
									key={service.id}
									href={`/layanan?s=${service.slug}`}
									className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-brand-primary/20 transition-all duration-300"
								>
									<div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary shrink-0">
										{service.icon ? (
											<span className="text-sm">{service.icon}</span>
										) : (
											<MdOutlineLocalLaundryService size={16} />
										)}
									</div>
									<div className="min-w-0">
										<p className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors truncate">
											{service.name}
										</p>
										<p className="text-[10px] text-slate-400">
											{formatIDR(service.price)}/{service.unit}
										</p>
									</div>
								</Link>
							))}
						</div>
					</motion.div>
				)}

				{/* Results */}
				{q && (
					<div className="space-y-10">
						{/* Services */}
						{filteredServices.length > 0 && (
							<div>
								<div className="flex items-center justify-between mb-4">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
										Layanan ({filteredServices.length})
									</p>
									<Link
										href={`/layanan?q=${encodeURIComponent(query)}`}
										className="text-xs font-bold text-brand-primary hover:underline"
									>
										Lihat Semua →
									</Link>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{filteredServices.slice(0, 6).map((service, i) => (
										<motion.div
											key={service.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.05 }}
										>
											<Link
												href={`/layanan?s=${service.slug}`}
												className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300"
											>
												<div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shrink-0 text-xl">
													{service.icon ? (
														<span>{service.icon}</span>
													) : (
														<MdOutlineLocalLaundryService size={24} />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
														{service.name}
													</p>
													<p className="text-[11px] text-slate-400 line-clamp-1">
														{service.description}
													</p>
												</div>
												<div className="text-right shrink-0">
													<p className="text-sm font-black text-slate-900">
														{formatIDR(service.price)}
													</p>
													<p className="text-[10px] text-slate-400">
														/{service.unit}
													</p>
												</div>
											</Link>
										</motion.div>
									))}
								</div>
							</div>
						)}

						{/* Gallery */}
						{filteredGallery.length > 0 && (
							<div>
								<div className="flex items-center justify-between mb-4">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
										Galeri ({filteredGallery.length})
									</p>
									<Link
										href="/galeri"
										className="text-xs font-bold text-brand-primary hover:underline"
									>
										Lihat Semua →
									</Link>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
									{filteredGallery.slice(0, 8).map((item, i) => (
										<motion.div
											key={item.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.05 }}
										>
											<Link
												href="/galeri"
												className="group block rounded-2xl overflow-hidden border border-slate-100 hover:border-brand-primary/20 transition-all duration-300"
											>
												<div className="aspect-square relative overflow-hidden bg-slate-100">
													{item.image_url && (
														<Image
															src={item.image_url}
															alt={item.title}
															fill
															className="object-cover group-hover:scale-105 transition-transform duration-500"
														/>
													)}
												</div>
												<div className="p-3">
													<p className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors truncate">
														{item.title}
													</p>
													{item.category && (
														<p className="text-[10px] text-slate-400">
															{item.category}
														</p>
													)}
												</div>
											</Link>
										</motion.div>
									))}
								</div>
							</div>
						)}

						{/* No Results */}
						{!hasResults && q && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="py-16 text-center"
							>
								<div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
									<HiOutlineSparkles size={32} />
								</div>
								<h3 className="text-xl font-black text-slate-900 mb-2">
									Tidak ditemukan
								</h3>
								<p className="text-slate-500 font-medium mb-6">
									Tidak ada hasil untuk &ldquo;{query}&rdquo;
								</p>
								<div className="flex flex-wrap justify-center gap-2">
									{quickPages.map((page) => {
										const Icon = page.icon;
										return (
											<Link
												key={page.href}
												href={page.href}
												className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-brand-primary/10 text-slate-600 hover:text-brand-primary rounded-full text-xs font-bold border border-slate-100 hover:border-brand-primary/20 transition-colors duration-200"
											>
												<Icon size={14} />
												{page.label}
											</Link>
										);
									})}
								</div>
							</motion.div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
