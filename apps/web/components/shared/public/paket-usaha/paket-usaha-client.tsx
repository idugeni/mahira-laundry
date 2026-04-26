"use client";

import { motion } from "motion/react";
import { HiOutlineArrowDown, HiOutlineSparkles } from "react-icons/hi2";
import type { BusinessPackage } from "@/lib/types";
import ComparisonTable from "./comparison-table";
import { PackageCard } from "./package-card";

interface PaketUsahaClientProps {
	packages: BusinessPackage[];
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.16, 1, 0.3, 1],
		},
	},
};

export function PaketUsahaClient({ packages }: PaketUsahaClientProps) {
	const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_CS ?? "6281234567890";
	const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Mahira Laundry, saya ingin konsultasi mengenai paket usaha laundry.")}`;

	return (
		<div className="bg-white">
			{/* Hero / Header - Premium Overhaul */}
			<section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 py-24">
				{/* Cinematic Background */}
				<div className="absolute inset-0 bg-brand-gradient opacity-20 mix-blend-overlay" />
				<motion.div
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{ duration: 15, repeat: Infinity }}
					className="absolute top-0 right-0 w-full h-full bg-brand-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"
				/>

				<div className="container relative z-10 mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8 }}
						className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent backdrop-blur-md border-0"
					>
						<span className="text-sm">
							<HiOutlineSparkles />
						</span>
						<span>Program Kemitraan</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
						className="max-w-4xl mx-auto text-4xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl tracking-tighter"
					>
						Bangun Bisnis <br />
						<span className="text-brand-gradient">Laundry Masa Depan.</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-400"
					>
						Kami tidak hanya menjual peralatan, kami membangun sistem kesuksesan
						untuk Anda. Bergabunglah dengan standar premium Mahira Laundry.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.4 }}
						className="mt-12"
					>
						<motion.button
							onClick={() =>
								document
									.getElementById("packages")
									?.scrollIntoView({ behavior: "smooth" })
							}
							animate={{ y: [0, 10, 0] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="text-white/30 hover:text-brand-accent transition-colors flex flex-col items-center gap-2 mx-auto"
						>
							<span className="text-[10px] font-black uppercase tracking-[0.3em]">
								Lihat Paket
							</span>
							<HiOutlineArrowDown size={24} />
						</motion.button>
					</motion.div>
				</div>
			</section>

			{/* Package Cards - Staggered Motion */}
			<section
				id="packages"
				className="py-24 bg-slate-50 relative overflow-hidden"
			>
				<div className="container relative z-10 mx-auto px-6">
					<div className="mb-16 text-center">
						<h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
							Pilihan Paket Investasi
						</h2>
						<p className="mt-4 text-slate-500 font-medium italic">
							Satu langkah awal menuju kebebasan finansial Anda.
						</p>
					</div>

					{packages.length === 0 ? (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center text-slate-400 font-medium py-20"
						>
							Belum ada paket tersedia saat ini.
						</motion.p>
					) : (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, margin: "-100px" }}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
						>
							{packages.map((pkg) => (
								<motion.div key={pkg.id} variants={itemVariants}>
									<PackageCard package={pkg} />
								</motion.div>
							))}
						</motion.div>
					)}
				</div>
			</section>

			{/* Comparison Table - Reveal Animation */}
			{packages.length > 0 && (
				<section id="perbandingan" className="bg-white py-24 scroll-mt-24">
					<div className="container mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="mb-16 text-center"
						>
							<h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
								Bandingkan{" "}
								<span className="text-brand-gradient">Paket Usaha</span>
							</h2>
							<div className="mt-4 flex justify-center">
								<div className="h-1.5 w-24 bg-brand-primary rounded-full" />
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.98 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 1 }}
							viewport={{ once: true }}
							className="rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-slate-200"
						>
							<ComparisonTable packages={packages} />
						</motion.div>
					</div>
				</section>
			)}

			{/* WhatsApp CTA Section - High Impact Motion */}
			<section
				id="contact-wa"
				className="py-16 bg-slate-900 relative overflow-hidden"
			>
				<div className="absolute inset-0 bg-brand-gradient opacity-10" />
				<div className="container relative z-10 mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="max-w-4xl mx-auto rounded-[3rem] bg-white/5 backdrop-blur-2xl p-10 lg:p-16 border-0 shadow-2xl"
					>
						<h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tighter leading-tight">
							Wujudkan Mimpi <br />
							<span className="text-brand-accent">Menjadi Wirausaha.</span>
						</h2>
						<p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed max-w-2xl mx-auto italic">
							"Konsultasikan kebutuhan bisnis laundry Anda dengan tim ahli kami
							secara gratis melalui WhatsApp."
						</p>
						<motion.a
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							href={waUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-4 rounded-full bg-brand-accent px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-2xl shadow-brand-accent/20 transition-all"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="h-6 w-6"
								aria-hidden="true"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
								<path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.728.888.924-3.638-.234-.374A9.818 9.818 0 1112 21.818z" />
							</svg>
							Mulai Konsultasi Gratis
						</motion.a>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
