"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { GiChelseaBoot } from "react-icons/gi";
import {
	HiOutlineArrowRight,
	HiOutlineMapPin,
	HiOutlineSparkles,
	HiOutlineStar,
} from "react-icons/hi2";
import {
	MdOutlineCheckCircle,
	MdOutlineDryCleaning,
	MdOutlineFlashOn,
	MdOutlineIron,
	MdOutlineLocalLaundryService,
} from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { PRIMARY_OUTLET } from "@/lib/constants";

interface Stat {
	value: string;
	label: string;
}

import type { GalleryItem, Service, Testimonial } from "@/lib/types";

interface HomeClientProps {
	initialServices: Service[];
	stats: Stat[];
	testimonials: Testimonial[];
	galleryItems: GalleryItem[];
}

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardUrl } from "@/lib/utils";
import { GallerySection } from "./gallery-section";
import { ServiceDetailModal } from "./service-detail-modal";
import { TestimonialSection } from "./testimonial-section";

export function HomeClient({
	initialServices,
	stats,
	testimonials,
	galleryItems,
}: HomeClientProps) {
	const { user, profile, loading } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Sync state with URL
	useEffect(() => {
		const serviceSlug = searchParams.get("s");
		if (serviceSlug) {
			const service = initialServices.find(
				(s) => s.id === serviceSlug || s.slug === serviceSlug,
			);
			if (service) {
				setSelectedService(service);
				setIsDetailOpen(true);
			}
		} else {
			setIsDetailOpen(false);
		}
	}, [searchParams, initialServices]);

	const handleServiceClick = (slug: string) => {
		router.push(`/?s=${slug}`, { scroll: false });
	};

	const handleCloseDetail = () => {
		router.push("/", { scroll: false });
	};

	const dashboardHref = getDashboardUrl(profile?.role as string);

	// Map icons from metadata or name
	const getServiceIcon = (name: string) => {
		if (name.toLowerCase().includes("sepatu")) return GiChelseaBoot;
		if (name.toLowerCase().includes("setrika")) return MdOutlineIron;
		if (name.toLowerCase().includes("express")) return MdOutlineFlashOn;
		if (name.toLowerCase().includes("dry")) return MdOutlineDryCleaning;
		if (name.toLowerCase().includes("kost")) return RiGraduationCapLine;
		return MdOutlineLocalLaundryService;
	};

	const getServiceStyles = (name: string) => {
		if (name.toLowerCase().includes("sepatu"))
			return { color: "text-teal-500", bg: "bg-teal-50" };
		if (name.toLowerCase().includes("setrika"))
			return { color: "text-orange-500", bg: "bg-orange-50" };
		if (name.toLowerCase().includes("express"))
			return { color: "text-yellow-500", bg: "bg-yellow-50" };
		if (name.toLowerCase().includes("dry"))
			return { color: "text-purple-500", bg: "bg-purple-50" };
		if (name.toLowerCase().includes("kost"))
			return { color: "text-pink-500", bg: "bg-pink-50" };
		return { color: "text-blue-500", bg: "bg-blue-50" };
	};

	return (
		<div className="overflow-hidden">
			{/* Hero Section */}
			<section className="relative py-16 lg:pt-24 lg:pb-32">
				<div className="absolute inset-0 bg-brand-gradient opacity-[0.03]" />
				<motion.div
					animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-primary rounded-full blur-[120px]"
				/>
				<motion.div
					animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
					transition={{ duration: 15, repeat: Infinity, delay: 2 }}
					className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent rounded-full blur-[100px]"
				/>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<div className="grid lg:grid-cols-2 gap-20 items-center">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="text-center lg:text-left flex flex-col items-center lg:items-start"
						>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-semibold mb-8 border border-brand-primary/10"
							>
								<span className="w-4 h-4 flex items-center justify-center animate-pulse">
									<HiOutlineSparkles />
								</span>
								<span>Standar Baru Laundry Indonesia</span>
							</motion.div>

							<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[family-name:var(--font-heading)] leading-[1.1] tracking-tight text-slate-900">
								Cucian Bersih,
								<br />
								<span className="inline-block text-brand-gradient">
									Hidup Nyaman.
								</span>
							</h1>

							<p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-lg">
								Mahira Laundry hadir sebagai solusi modern untuk kebutuhan gaya
								hidup Anda. Pakaian Anda ditangani secara profesional dengan
								antar-jemput gratis.
							</p>

							<div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-5">
								{!loading ? (
									<Link
										href={user ? dashboardHref : "/register"}
										className="group relative px-8 py-4 bg-brand-primary text-white rounded-full font-bold overflow-hidden transition-all hover:shadow-2xl hover:shadow-brand-primary/30"
									>
										<motion.div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
										<span className="relative flex items-center gap-2">
											{user ? "Buka Dashboard" : "Mulai Sekarang"}
											<span className="w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
												<HiOutlineArrowRight />
											</span>
										</span>
									</Link>
								) : (
									<div className="w-48 h-14 bg-slate-100 animate-pulse rounded-full" />
								)}
								<Link
									href="/layanan"
									className="px-8 py-4 border-2 border-slate-200 rounded-full font-bold text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center gap-2"
								>
									Lihat Layanan
								</Link>
							</div>

							<div className="mt-12 flex items-center gap-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 max-w-sm mx-auto lg:mx-0">
								<div className="flex -space-x-3">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="w-12 h-12 rounded-full bg-slate-200 border-4 border-white overflow-hidden shadow-sm"
										>
											<img
												src={`https://i.pravatar.cc/150?u=${i + 10}`}
												alt="Pelanggan"
												className="w-full h-full object-cover"
											/>
										</div>
									))}
								</div>
								<div>
									<div className="flex text-amber-500 text-sm">
										{"★★★★★".split("").map((s, i) => (
											<span key={i}>{s}</span>
										))}
									</div>
									<p className="text-sm font-medium text-slate-600">
										<strong className="text-slate-900">2,500+</strong> pelanggan
										puas
									</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
							className="relative"
						>
							<div className="relative z-10 glass-card p-6 sm:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-white/40 ring-1 ring-black/5">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl text-brand-primary shadow-inner">
										<MdOutlineLocalLaundryService />
									</div>
									<div>
										<h3 className="text-lg font-bold text-slate-900 leading-tight">
											Order Aktif
										</h3>
										<p className="text-sm text-slate-500 font-medium">
											Pickup dalam 30 menit
										</p>
									</div>
								</div>

								<div className="space-y-4">
									{[
										"Cuci Setrika 3kg",
										"Dry Cleaning 2 item",
										"Express Setrika 1kg",
									].map((item, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: 10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.5 + i * 0.1 }}
											className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
										>
											<span className="text-sm font-semibold text-slate-700">
												{item}
											</span>
											<span className="text-emerald-500 w-5 h-5 flex items-center justify-center">
												<MdOutlineCheckCircle />
											</span>
										</motion.div>
									))}
								</div>

								<div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
									<div>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
											Total Pembayaran
										</p>
										<p className="text-2xl font-black text-brand-primary mt-1">
											Rp 85.000
										</p>
									</div>
									<div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold ring-1 ring-emerald-100 uppercase">
										Paid
									</div>
								</div>
							</div>

							{/* Float Element */}
							<motion.div
								animate={{ y: [0, -15, 0] }}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -bottom-8 -right-8 z-20 glass-card p-5 shadow-2xl ring-1 ring-black/5 flex items-center gap-4 max-w-[220px]"
							>
								<div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-2xl">
									<span className="text-brand-accent flex items-center justify-center">
										<HiOutlineMapPin />
									</span>
								</div>
								<div>
									<p className="text-[10px] uppercase font-bold text-slate-400">
										Kurir Mahira
									</p>
									<p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
										Sedang Menuju Lokasi
									</p>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-24 relative bg-slate-900 overflow-hidden">
				{/* Elite Decorative Elements */}
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
						{stats.map((stat, i) => {
							const icons = [
								<HiOutlineSparkles key="1" />,
								<HiOutlineStar key="2" />,
								<HiOutlineMapPin key="3" />,
								<MdOutlineFlashOn key="4" />,
							];

							return (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.1, duration: 0.8 }}
									className="relative group flex flex-col items-center text-center"
								>
									<div className="mb-6 relative">
										<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl text-brand-accent transition-all duration-500 group-hover:bg-brand-accent group-hover:text-slate-900 group-hover:rotate-[15deg] shadow-xl group-hover:shadow-brand-accent/30 ring-1 ring-white/5 group-hover:ring-brand-accent">
											{icons[i]}
										</div>
										<div className="absolute -inset-4 bg-brand-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
									</div>

									<div className="text-4xl lg:text-5xl font-black text-white font-[family-name:var(--font-heading)] mb-2 tracking-tight">
										{stat.value}
									</div>
									<div className="text-[10px] lg:text-xs font-black text-brand-accent uppercase tracking-[0.3em] leading-relaxed">
										{stat.label}
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-20 bg-slate-50/50" id="layanan">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-slate-900"
						>
							Layanan{" "}
							<span className="inline-block text-brand-gradient">Premium</span>{" "}
							Kami
						</motion.h2>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto"
						>
							Setiap pakaian diperlakukan khusus dengan deterjen premium dan
							teknologi modern.
						</motion.p>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{initialServices
							.slice(0, isDetailOpen ? initialServices.length : 6)
							.map((service, i) => {
								const Icon = getServiceIcon(service.name);
								const styles = getServiceStyles(service.name);
								return (
									<motion.div
										key={service.id}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: i * 0.1 }}
										whileHover={{ y: -10 }}
										onClick={() =>
											handleServiceClick(service.slug || service.id)
										}
										className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-brand-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer"
									>
										<div
											className={`w-16 h-16 rounded-full ${styles.bg} flex items-center justify-center text-3xl ${styles.color} mb-8 ring-4 ring-white shadow-sm`}
										>
											{service.icon ? (
												<span className="shrink-0">{service.icon}</span>
											) : (
												<Icon />
											)}
										</div>
										<h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-3 grayscale group-hover:grayscale-0 transition-all">
											{service.name}
										</h3>
										<p className="text-slate-500 leading-relaxed text-sm mb-6 line-clamp-2">
											{service.description}
										</p>
										<div className="flex items-center justify-between pt-6 border-t border-slate-50">
											<span className="text-xl font-black text-brand-primary">
												{new Intl.NumberFormat("id-ID", {
													style: "currency",
													currency: "IDR",
													maximumFractionDigits: 0,
												}).format(service.price)}
												<span className="text-xs text-slate-400 font-medium">
													/{service.unit}
												</span>
											</span>
											<div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
												<span className="w-5 h-5 flex items-center justify-center">
													<HiOutlineArrowRight />
												</span>
											</div>
										</div>
									</motion.div>
								);
							})}
					</div>

					{initialServices.length > 6 && (
						<div className="mt-16 text-center">
							<Link
								href="/layanan"
								className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/25"
							>
								Lihat Seluruh Layanan
								<HiOutlineArrowRight />
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Gallery Section */}
			<GallerySection items={galleryItems} />

			{/* Testimonials */}
			<TestimonialSection testimonials={testimonials} />

			{/* CTA Section */}
			<section className="py-24 relative overflow-hidden bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="group relative p-12 lg:p-24 rounded-[4rem] bg-slate-900 text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
					>
						{/* Elite Background Effects */}
						<div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-brand-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
						<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px]" />
						<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

						<div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
							<div className="flex-1 text-center lg:text-left">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.2 }}
									className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8"
								>
									<span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
									Premium Services
								</motion.div>

								<h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[family-name:var(--font-heading)] leading-[1.1] mb-8">
									Nikmati Kualitas <br />
									<span className="text-brand-gradient">Perawatan Pakaian</span>{" "}
									<br />
									Terbaik Hari Ini
								</h2>

								<p className="text-xl text-white/60 leading-relaxed max-w-xl mb-12">
									Berikan yang terbaik untuk pakaian favorit Anda. Tim
									profesional kami siap memberikan hasil yang higienis, wangi,
									dan rapi sempurna.
								</p>

								<div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
									<div className="flex items-center gap-2 text-sm font-bold">
										<span className="text-brand-accent">
											<MdOutlineCheckCircle />
										</span>
										<span>Hygienic</span>
									</div>
									<div className="flex items-center gap-2 text-sm font-bold">
										<span className="text-brand-accent">
											<MdOutlineCheckCircle />
										</span>
										<span>Professional</span>
									</div>
									<div className="flex items-center gap-2 text-sm font-bold">
										<span className="text-brand-accent">
											<MdOutlineCheckCircle />
										</span>
										<span>Fast Result</span>
									</div>
								</div>
							</div>

							<div className="shrink-0 w-full lg:w-auto flex justify-center">
								<motion.a
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									href={`https://wa.me/${PRIMARY_OUTLET.whatsapp}?text=Halo Mahira Laundry, saya ingin order laundry`}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black text-xl hover:bg-brand-accent hover:text-slate-900 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group/btn"
								>
									<span className="w-8 h-8 flex items-center justify-center text-emerald-500 bg-emerald-50 rounded-full group-hover/btn:bg-slate-900 transition-colors">
										<FaWhatsapp />
									</span>
									Hubungi Kami Sekarang
								</motion.a>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Service Detail Modal (PWA Model) */}
			<ServiceDetailModal
				service={selectedService}
				isOpen={isDetailOpen}
				onClose={handleCloseDetail}
			/>
		</div>
	);
}
