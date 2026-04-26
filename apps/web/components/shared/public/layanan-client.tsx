"use client";

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiChelseaBoot } from "react-icons/gi";
import { HiOutlineArrowRight, HiOutlineSparkles } from "react-icons/hi2";
import {
	MdOutlineDryCleaning,
	MdOutlineFlashOn,
	MdOutlineIron,
	MdOutlineLocalLaundryService,
} from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { ServiceDetailModal } from "@/components/shared/customer/order/service-detail-modal";
import { useAuth } from "@/hooks/use-auth";
import type { Service } from "@/lib/types";
import { formatIDR, getDashboardUrl } from "@/lib/utils";

function ServiceCard({
	service,
	index,
	onClick,
	Icon,
	styles,
}: {
	service: Service;
	index: number;
	onClick: () => void;
	Icon: React.ElementType;
	styles: { color: string; bg: string };
}) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const mouseXSpring = useSpring(x);
	const mouseYSpring = useSpring(y);

	const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
	const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const xPct = mouseX / width - 0.5;
		const yPct = mouseY / height - 0.5;
		x.set(xPct);
		y.set(yPct);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{
				duration: 0.8,
				delay: index * 0.1,
				ease: [0.16, 1, 0.3, 1],
			}}
			style={{
				rotateX,
				rotateY,
				transformStyle: "preserve-3d",
			}}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
			className="group relative p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-brand-primary/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer"
		>
			<div style={{ transform: "translateZ(50px)" }} className="relative z-10">
				<div
					className={`w-20 h-20 rounded-3xl ${styles.bg} flex items-center justify-center text-4xl ${styles.color} mb-8 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
				>
					{service.icon ? (
						<span className="shrink-0">{service.icon}</span>
					) : (
						<span className="flex items-center justify-center">
							<Icon />
						</span>
					)}
				</div>
				<h3 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900 mb-4 tracking-tight group-hover:text-brand-primary transition-colors">
					{service.name}
				</h3>
				<p className="text-slate-500 leading-relaxed text-sm mb-8 line-clamp-3 font-medium">
					{service.description}
				</p>
				<div className="flex items-center justify-between pt-8 border-t border-slate-50">
					<div className="flex flex-col">
						<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
							Mulai Dari
						</span>
						<span className="text-2xl font-black text-slate-900 tracking-tighter">
							{formatIDR(service.price)}
							<span className="text-xs text-slate-400 font-medium ml-1">
								/{service.unit}
							</span>
						</span>
					</div>
					<div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary group-hover:scale-110 transition-all duration-500">
						<span className="w-6 h-6 flex items-center justify-center">
							<HiOutlineArrowRight />
						</span>
					</div>
				</div>
			</div>

			{/* Decorative Glow */}
			<div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
		</motion.div>
	);
}

export function LayananClient({
	initialServices,
}: {
	initialServices: Service[];
}) {
	const { user, profile, loading } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

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
		router.push(`/layanan?s=${slug}`, { scroll: false });
	};

	const handleCloseDetail = () => {
		router.push("/layanan", { scroll: false });
	};

	let orderHref = "/register";
	if (user) {
		if (profile?.role === "customer") {
			orderHref = "/customer/order/baru";
		} else {
			orderHref = getDashboardUrl(profile?.role as string);
		}
	}

	const getServiceIcon = (name: string) => {
		const n = name.toLowerCase();
		if (n.includes("sepatu")) return GiChelseaBoot;
		if (n.includes("setrika")) return MdOutlineIron;
		if (n.includes("express")) return MdOutlineFlashOn;
		if (n.includes("dry")) return MdOutlineDryCleaning;
		if (n.includes("kost")) return RiGraduationCapLine;
		return MdOutlineLocalLaundryService;
	};

	const getServiceStyles = (name: string) => {
		const n = name.toLowerCase();
		if (n.includes("sepatu"))
			return { color: "text-teal-500", bg: "bg-teal-50" };
		if (n.includes("setrika"))
			return { color: "text-orange-500", bg: "bg-orange-50" };
		if (n.includes("express"))
			return { color: "text-yellow-500", bg: "bg-yellow-50" };
		if (n.includes("dry"))
			return { color: "text-purple-500", bg: "bg-purple-50" };
		if (n.includes("kost")) return { color: "text-pink-500", bg: "bg-pink-50" };
		return { color: "text-blue-500", bg: "bg-blue-50" };
	};

	if (loading) {
		return (
			<div className="py-24 text-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-6"
				/>
				<p className="text-slate-400 font-black uppercase tracking-widest text-xs">
					Memuat katalog...
				</p>
			</div>
		);
	}

	return (
		<div className="py-24 relative overflow-hidden bg-white">
			{/* Background Decorative */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
				<motion.div
					animate={{
						y: [0, -20, 0],
						rotate: [0, 5, 0],
					}}
					transition={{ duration: 10, repeat: Infinity }}
					className="absolute top-[10%] -left-[10%] w-[40%] aspect-square rounded-full bg-brand-primary/5 blur-[120px]"
				/>
				<motion.div
					animate={{
						y: [0, 30, 0],
						rotate: [0, -5, 0],
					}}
					transition={{ duration: 12, repeat: Infinity }}
					className="absolute bottom-[10%] -right-[10%] w-[40%] aspect-square rounded-full bg-brand-accent/10 blur-[120px]"
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<div className="text-center mb-24">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-3 px-6 py-3 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-brand-primary/10"
					>
						<span className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm">
							<HiOutlineSparkles size={14} />
						</span>
						<span>Kualitas Tanpa Kompromi</span>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-6xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.8] tracking-tighter"
					>
						Layanan <br />
						<span className="text-brand-gradient">Terbaik Kami.</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4 }}
						className="mt-8 text-slate-500 max-w-xl mx-auto text-lg font-medium leading-relaxed"
					>
						Teknologi modern berpadu dengan ketelitian tangan para ahli untuk
						hasil cucian yang bersih maksimal dan wangi sepanjang hari.
					</motion.p>
				</div>

				{/* Grid */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
					{initialServices.map((service, i) => (
						<ServiceCard
							key={service.id}
							service={service}
							index={i}
							Icon={getServiceIcon(service.name)}
							styles={getServiceStyles(service.name)}
							onClick={() => handleServiceClick(service.slug || service.id)}
						/>
					))}
				</div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mt-32 p-10 lg:p-16 rounded-[3rem] bg-slate-900 relative overflow-hidden text-center"
				>
					{/* Decorative background for CTA */}
					<div className="absolute inset-0 opacity-20">
						<div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
						<div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
					</div>

					<div className="relative z-10">
						<h2 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
							Pakaian Kotor? <br />
							<span className="text-brand-accent">Biar Kami yang Atasi.</span>
						</h2>
						<p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-medium">
							Nikmati waktu luang Anda lebih banyak sementara kami menangani
							tumpukan cucian Anda dengan standar kualitas hotel bintang lima.
						</p>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="inline-block"
						>
							<Link
								href={orderHref}
								className="inline-flex items-center gap-4 px-10 py-4.5 bg-brand-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/40 group"
							>
								{user ? "Mulai Pesan Sekarang" : "Buat Akun & Pesan"}
								<motion.span
									animate={{ x: [0, 5, 0] }}
									transition={{ repeat: Infinity, duration: 1.5 }}
								>
									<HiOutlineArrowRight size={18} />
								</motion.span>
							</Link>
						</motion.div>
					</div>
				</motion.div>
			</div>

			<AnimatePresence>
				{isDetailOpen && (
					<ServiceDetailModal
						service={selectedService}
						isOpen={isDetailOpen}
						onClose={handleCloseDetail}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
