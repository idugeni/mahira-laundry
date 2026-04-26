"use client";

import { motion } from "motion/react";
import {
	HiOutlineClock,
	HiOutlineDevicePhoneMobile,
	HiOutlineHeart,
	HiOutlineRocketLaunch,
	HiOutlineSparkles,
	HiOutlineTrophy,
} from "react-icons/hi2";
import { MdOutlineScience } from "react-icons/md";

export function TentangClient() {
	return (
		<div className="py-32 bg-white relative overflow-hidden">
			{/* Decorative Background Elements */}
			<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
				<motion.div
					animate={{
						y: [0, -30, 0],
						rotate: [0, 10, 0],
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-[5%] -left-[10%] w-[50%] aspect-square rounded-full bg-brand-primary/5 blur-[120px]"
				/>
				<motion.div
					animate={{
						y: [0, 40, 0],
						rotate: [0, -8, 0],
					}}
					transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-[5%] -right-[10%] w-[50%] aspect-square rounded-full bg-brand-accent/5 blur-[120px]"
				/>
			</div>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Hero Section */}
				<div className="text-center mb-32">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-brand-primary/10"
					>
						<span className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm">
							<HiOutlineSparkles size={14} />
						</span>
						<span>Visi & Warisan Kami</span>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						className="text-6xl lg:text-8xl font-black font-[family-name:var(--font-heading)] text-slate-900 leading-[0.8] tracking-tighter"
					>
						Eksklusivitas <br />
						<span className="text-brand-gradient">Mahira Laundry.</span>
					</motion.h1>
					<motion.div
						initial={{ opacity: 0, width: 0 }}
						whileInView={{ opacity: 1, width: "100px" }}
						viewport={{ once: true }}
						transition={{ delay: 0.5, duration: 1 }}
						className="h-1 bg-brand-primary mx-auto mt-12 rounded-full"
					/>
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.6 }}
						className="mt-12 text-2xl lg:text-3xl text-slate-500 font-medium leading-relaxed italic max-w-3xl mx-auto"
					>
						"Lahir dari visi{" "}
						<strong className="text-slate-900 font-black">
							Indira Maharani
						</strong>{" "}
						untuk menghadirkan standar kebersihan premium yang melampaui
						ekspektasi."
					</motion.p>
				</div>

				<div className="grid gap-32">
					{/* Visi Section */}
					<motion.section
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="relative group p-12 lg:p-20 bg-slate-900 rounded-[4rem] overflow-hidden"
					>
						<div className="absolute top-0 right-0 p-12 text-[200px] text-white/5 font-black pointer-events-none select-none -mr-20 -mt-20">
							VISI
						</div>

						<div className="relative z-10">
							<div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center text-white mb-10 shadow-2xl shadow-brand-primary/20 rotate-3 group-hover:rotate-6 transition-transform duration-500">
								<HiOutlineRocketLaunch size={40} />
							</div>
							<h2 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] mb-8 text-white tracking-tighter">
								Visi Utama Kami
							</h2>
							<p className="text-slate-400 text-xl lg:text-2xl leading-relaxed font-medium">
								Menjadi layanan laundry terpercaya nomor satu di Indonesia
								dengan standar kebersihan internasional yang menyatu dengan
								teknologi modern untuk kenyamanan hidup Anda.
							</p>
						</div>
					</motion.section>

					{/* Misi Section */}
					<div className="grid lg:grid-cols-2 gap-20 items-center">
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<div className="w-20 h-20 bg-brand-accent/20 rounded-3xl flex items-center justify-center text-brand-accent-dark mb-10 shadow-inner">
								<HiOutlineTrophy size={40} />
							</div>
							<h2 className="text-5xl lg:text-6xl font-black font-[family-name:var(--font-heading)] mb-8 text-slate-900 leading-[0.9] tracking-tighter">
								Misi <br />
								<span className="text-brand-accent-dark">Operasional.</span>
							</h2>
							<p className="text-slate-500 text-lg font-medium leading-relaxed">
								Kami tidak hanya mencuci pakaian, kami merawat memori dan
								investasi Anda melalui standar pengerjaan yang ketat.
							</p>
						</motion.div>

						<div className="grid gap-6">
							{[
								"Inovasi deterjen ramah lingkungan dengan formula premium.",
								"Penggunaan teknologi modern untuk efisiensi dan kebersihan.",
								"Sistem Quality Control 3 lapis untuk hasil tanpa cacat.",
								"Pengalaman pelanggan yang personal dan profesional.",
							].map((misi, i) => (
								<motion.div
									key={misi}
									initial={{ opacity: 0, x: 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.1 }}
									className="flex items-start gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group"
								>
									<div className="w-12 h-12 rounded-2xl bg-white text-brand-primary flex items-center justify-center font-black shrink-0 shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500">
										0{i + 1}
									</div>
									<p className="text-slate-600 font-bold leading-snug pt-2 text-lg">
										{misi}
									</p>
								</motion.div>
							))}
						</div>
					</div>

					{/* Values Grid */}
					<section>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center mb-20"
						>
							<h2 className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tighter">
								Filosofi Kerja Kami
							</h2>
						</motion.div>
						<div className="grid sm:grid-cols-2 gap-8">
							{[
								{
									icon: MdOutlineScience,
									title: "Deterjen Premium",
									desc: "Formula khusus yang aman untuk serat kain dan ramah lingkungan.",
									color: "text-blue-500",
									bg: "bg-blue-50",
								},
								{
									icon: HiOutlineHeart,
									title: "Parfum Signature",
									desc: "Keharuman eksklusif yang dirancang khusus untuk kesegaran tahan lama.",
									color: "text-pink-500",
									bg: "bg-pink-50",
								},
								{
									icon: HiOutlineClock,
									title: "Kecepatan Express",
									desc: "Layanan 6 jam bersih seketika untuk mendukung produktivitas Anda.",
									color: "text-orange-500",
									bg: "bg-orange-50",
								},
								{
									icon: HiOutlineDevicePhoneMobile,
									title: "Konektivitas Digital",
									desc: "Pantau status cucian Anda secara real-time melalui dashboard canggih.",
									color: "text-brand-primary",
									bg: "bg-brand-primary/10",
								},
							].map((item, i) => (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.1 }}
									whileHover={{ y: -10 }}
									className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col items-start gap-8 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 group"
								>
									<div
										className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-3xl shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner`}
									>
										<item.icon />
									</div>
									<div>
										<h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
											{item.title}
										</h3>
										<p className="text-slate-500 leading-relaxed font-medium text-lg">
											{item.desc}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</section>
				</div>

				{/* Closing CTA */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					className="mt-40 p-10 lg:p-16 rounded-[3rem] bg-brand-primary text-center text-white relative overflow-hidden"
				>
					<div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
					<div className="relative z-10">
						<h3 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter leading-tight">
							Bergabung dalam <br /> Standard Mahira.
						</h3>
						<p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
							Kami percaya bahwa kebersihan adalah bentuk penghormatan terhadap
							diri sendiri. Mari rawat pakaian Anda dengan rasa hormat tersebut.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-10 py-4.5 bg-white text-brand-primary rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl"
						>
							Pesan Layanan Sekarang
						</motion.button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
