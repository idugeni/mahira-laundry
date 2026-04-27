"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { PRIMARY_OUTLET } from "@/lib/constants";

interface FooterService {
	name: string;
	slug?: string;
	id?: string;
}

export function MahiraFooter({
	services = [],
}: {
	services?: FooterService[];
}) {
	const displayServices = services.map((s) => ({
		name: s.name,
		path: `/layanan?s=${s.slug || s.id}`,
	}));

	return (
		<footer className="bg-slate-900 text-white overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<MahiraLogo size={36} showText={true} />
						<p className="mt-6 text-sm text-slate-400 leading-relaxed">
							Partner terpercaya untuk membangun bisnis laundry sukses. Kami
							menghadirkan paket usaha laundry lengkap dengan sistem autopilot
							dan dukungan peralatan premium untuk profit maksimal.
						</p>
						<div className="mt-8 flex gap-3">
							{[
								{
									icon: <FaWhatsapp />,
									href: `https://api.whatsapp.com/send?phone=${PRIMARY_OUTLET.whatsapp}`,
									color: "hover:bg-[#25D366]",
									label: "WhatsApp",
								},
								{
									icon: <FaInstagram />,
									href: "#",
									color: "hover:bg-[#E4405F]",
									label: "Instagram",
								},
								{
									icon: <FaFacebookF />,
									href: "#",
									color: "hover:bg-[#1877F2]",
									label: "Facebook",
								},
							].map((social) => (
								<motion.a
									key={social.label}
									whileHover={{ y: -3 }}
									href={social.href}
									aria-label={social.label}
									className={`w-9 h-9 rounded-full bg-white/5 flex items-center justify-center transition-colors ${social.color}`}
								>
									<span className="w-4 h-4 flex items-center justify-center">
										{social.icon}
									</span>
								</motion.a>
							))}
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
					>
						<h4 className="font-bold font-[family-name:var(--font-heading)] mb-6 text-brand-primary uppercase tracking-widest text-[10px]">
							Bisnis & Layanan
						</h4>
						<ul className="space-y-3 text-sm text-slate-400">
							<li>
								<Link
									href="/paket-usaha"
									className="hover:text-brand-primary transition-colors font-bold text-white"
								>
									Peluang Paket Usaha
								</Link>
							</li>
							<li>
								<Link
									href="/paket-usaha#perbandingan"
									className="hover:text-brand-primary transition-colors"
								>
									Perbandingan Paket
								</Link>
							</li>
							<li className="pt-2">
								<p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">
									Layanan Kami
								</p>
							</li>
							{displayServices.map((service) => (
								<li key={service.path}>
									<Link
										href={service.path}
										className="hover:text-brand-primary transition-colors"
									>
										{service.name}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
					>
						<h4 className="font-bold font-[family-name:var(--font-heading)] mb-6 text-brand-primary uppercase tracking-widest text-[10px]">
							Perusahaan
						</h4>
						<ul className="space-y-3 text-sm text-slate-400">
							<li>
								<Link
									href="/tentang"
									className="hover:text-brand-primary transition-colors"
								>
									Tentang Mahira
								</Link>
							</li>
							<li>
								<Link
									href="/lokasi"
									className="hover:text-brand-primary transition-colors"
								>
									Jaringan Outlet
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="hover:text-brand-primary transition-colors font-bold text-white"
								>
									Bantuan & FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="hover:text-brand-primary transition-colors"
								>
									Kebijakan Privasi
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-brand-primary transition-colors"
								>
									Syarat & Ketentuan
								</Link>
							</li>
							<li>
								<Link
									href="/sitemap"
									className="hover:text-brand-primary transition-colors font-bold"
								>
									Sitemap
								</Link>
							</li>
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
					>
						<h4 className="font-bold font-[family-name:var(--font-heading)] mb-6 text-brand-primary uppercase tracking-widest text-[10px]">
							Hubungi Kami
						</h4>
						<ul className="space-y-4 text-sm text-slate-400">
							<li className="flex items-start gap-3">
								<span className="w-4 h-4 flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
									<HiOutlineMapPin />
								</span>
								<span className="leading-relaxed">
									{PRIMARY_OUTLET.address}
								</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="w-4 h-4 flex items-center justify-center text-brand-primary shrink-0">
									<HiOutlinePhone />
								</span>
								<span>{PRIMARY_OUTLET.phone}</span>
							</li>
						</ul>
					</motion.div>
				</div>
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="mt-20 pt-8 relative flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500"
				>
					{/* Smooth Gradient Divider */}
					<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

					<p>
						© {new Date().getFullYear()} Mahira Laundry Group. Seluruh Hak Cipta
						Dilindungi.
					</p>
					<div className="flex gap-6">
						<Link
							href="/privacy"
							className="hover:text-white transition-colors"
						>
							Privacy
						</Link>
						<Link href="/terms" className="hover:text-white transition-colors">
							Terms
						</Link>
						<Link
							href="/cookies"
							className="hover:text-white transition-colors"
						>
							Cookies
						</Link>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
