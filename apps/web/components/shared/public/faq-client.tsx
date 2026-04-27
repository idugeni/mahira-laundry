"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
	HiOutlineChevronDown,
	HiOutlineCreditCard,
	HiOutlineMagnifyingGlass,
	HiOutlineQuestionMarkCircle,
	HiOutlineShieldCheck,
	HiOutlineSparkles,
	HiOutlineTruck,
} from "react-icons/hi2";

const faqCategories = [
	{
		id: "general",
		label: "Umum",
		icon: <HiOutlineSparkles />,
		questions: [
			{
				q: "Apa itu Mahira Laundry?",
				a: "Mahira Laundry adalah penyedia layanan laundry premium yang berfokus pada kualitas kebersihan, kecepatan, dan kenyamanan pelanggan. Kami menggunakan deterjen ramah lingkungan dan teknologi pencucian modern untuk merawat pakaian Anda.",
			},
			{
				q: "Di mana lokasi outlet Mahira Laundry?",
				a: "Outlet utama kami berlokasi di Jatiwaringin, Bekasi. Kami juga memiliki beberapa titik jemput strategis dan berencana untuk terus berekspansi ke area Jabodetabek lainnya.",
			},
			{
				q: "Bagaimana cara memesan layanan Mahira Laundry?",
				a: "Anda bisa memesan langsung dengan datang ke outlet kami, melalui aplikasi web ini, atau menghubungi WhatsApp Customer Service kami di +62 838-0651-8859.",
			},
		],
	},
	{
		id: "services",
		label: "Layanan & Harga",
		icon: <HiOutlineShieldCheck />,
		questions: [
			{
				q: "Berapa harga laundry per kilogram?",
				a: "Harga laundry kiloan kami mulai dari Rp 7.000/kg untuk layanan cuci lipat. Harga bervariasi tergantung pada jenis layanan (Cuci Setrika, Dry Cleaning) dan kecepatan yang dipilih.",
			},
			{
				q: "Apakah ada layanan laundry express?",
				a: "Ya, kami menyediakan layanan Express 6 Jam dan Sameday 12 Jam untuk pelanggan yang membutuhkan cucian selesai dengan cepat.",
			},
			{
				q: "Apakah Mahira Laundry menerima cuci sepatu dan tas?",
				a: "Tentu! Kami memiliki tenaga ahli khusus untuk perawatan sepatu (Deep Clean) dan tas branded dengan teknik pembersihan yang aman sesuai materialnya.",
			},
		],
	},
	{
		id: "delivery",
		label: "Antar-Jemput",
		icon: <HiOutlineTruck />,
		questions: [
			{
				q: "Apakah layanan antar-jemput gratis?",
				a: "Kami menyediakan layanan antar-jemput GRATIS untuk area Jatiwaringin dengan minimum order tertentu. Untuk area di luar itu, dikenakan biaya flat yang sangat terjangkau.",
			},
			{
				q: "Bagaimana cara melacak pesanan saya?",
				a: "Anda dapat memantau status cucian Anda secara real-time melalui halaman 'Lacak Pesanan' di website ini dengan memasukkan nomor pesanan Anda.",
			},
		],
	},
	{
		id: "payment",
		label: "Pembayaran",
		icon: <HiOutlineCreditCard />,
		questions: [
			{
				q: "Metode pembayaran apa saja yang diterima?",
				a: "Kami menerima pembayaran tunai (Cash), Transfer Bank, QRIS (Gopay, OVO, Dana), dan melalui Virtual Account di website.",
			},
			{
				q: "Apa itu sistem Poin Sultan?",
				a: "Sistem Poin Sultan adalah program loyalitas kami. Setiap transaksi yang Anda lakukan akan menghasilkan poin yang dapat dikumpulkan dan ditukarkan dengan diskon atau layanan gratis di masa mendatang.",
			},
		],
	},
];

export function FAQClient() {
	const [activeCategory, setActiveCategory] = useState("general");
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCategories = faqCategories
		.map((cat) => ({
			...cat,
			questions: cat.questions.filter(
				(q) =>
					q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
					q.a.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		}))
		.filter((cat) => cat.questions.length > 0);

	return (
		<div className="min-h-screen bg-slate-50 pb-24">
			{/* Hero Section */}
			<section className="relative pt-32 pb-20 overflow-hidden bg-white border-b border-slate-100">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
					<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-brand-primary/10 blur-[120px] rounded-full" />
					<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-brand-accent/10 blur-[120px] rounded-full" />
				</div>

				<div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 text-brand-primary text-sm font-bold mb-6"
					>
						<span className="text-lg flex items-center justify-center">
							<HiOutlineQuestionMarkCircle />
						</span>
						<span>Pusat Bantuan Mahira</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-4xl md:text-6xl font-black font-[family-name:var(--font-heading)] text-slate-900 mb-6 tracking-tight"
					>
						Ada yang bisa kami{" "}
						<span className="text-brand-primary">bantu?</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto"
					>
						Cari jawaban cepat untuk pertanyaan yang sering ditanyakan mengenai
						layanan, harga, hingga kemitraan kami.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3 }}
						className="relative max-w-xl mx-auto"
					>
						<span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl flex items-center justify-center">
							<HiOutlineMagnifyingGlass />
						</span>
						<input
							type="text"
							placeholder="Ketik pertanyaan Anda di sini..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-brand-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
						/>
					</motion.div>
				</div>
			</section>

			{/* Main Content */}
			<section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar Categories */}
					<div className="lg:w-1/3">
						<div className="sticky top-28 bg-white/70 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col gap-2">
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 pl-4">
								Kategori Pertanyaan
							</p>
							{faqCategories.map((cat) => (
								<button
									key={cat.id}
									onClick={() => {
										setActiveCategory(cat.id);
										setOpenIndex(0);
									}}
									className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
										activeCategory === cat.id
											? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
											: "text-slate-600 hover:bg-slate-50"
									}`}
								>
									<span
										className={`text-xl ${activeCategory === cat.id ? "text-white" : "text-brand-primary"}`}
									>
										{cat.icon}
									</span>
									<span>{cat.label}</span>
								</button>
							))}
						</div>
					</div>

					{/* FAQ Accordion */}
					<div className="lg:w-2/3">
						<div className="space-y-4">
							<AnimatePresence mode="wait">
								{filteredCategories
									.find((c) => c.id === activeCategory)
									?.questions.map((faq, idx) => (
										<motion.div
											key={faq.q}
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -20 }}
											transition={{ delay: idx * 0.05 }}
											className="group"
										>
											<div
												className={`overflow-hidden rounded-[2rem] border transition-all duration-300 ${
													openIndex === idx
														? "bg-white border-brand-primary/20 shadow-xl shadow-brand-primary/5"
														: "bg-white/50 border-slate-100 hover:border-slate-200"
												}`}
											>
												<button
													onClick={() =>
														setOpenIndex(openIndex === idx ? null : idx)
													}
													className="w-full flex items-center justify-between p-6 md:p-8 text-left"
												>
													<span
														className={`text-lg md:text-xl font-bold transition-colors ${openIndex === idx ? "text-brand-primary" : "text-slate-900"}`}
													>
														{faq.q}
													</span>
													<div
														className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? "bg-brand-primary text-white rotate-180" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}
													>
														<HiOutlineChevronDown size={20} />
													</div>
												</button>

												<AnimatePresence>
													{openIndex === idx && (
														<motion.div
															initial={{ height: 0, opacity: 0 }}
															animate={{ height: "auto", opacity: 1 }}
															exit={{ height: 0, opacity: 0 }}
															transition={{ duration: 0.3, ease: "easeInOut" }}
														>
															<div className="px-6 md:px-8 pb-8 text-slate-600 leading-relaxed text-lg">
																<div className="h-px w-full bg-slate-100 mb-6" />
																{faq.a}
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										</motion.div>
									))}
							</AnimatePresence>

							{searchQuery && filteredCategories.length === 0 && (
								<div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
									<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
										<span className="text-slate-400 text-2xl flex items-center justify-center">
											<HiOutlineMagnifyingGlass />
										</span>
									</div>
									<h3 className="text-xl font-bold text-slate-900 mb-2">
										Maaf, tidak ada hasil
									</h3>
									<p className="text-slate-500">
										Kami tidak dapat menemukan jawaban untuk "{searchQuery}".{" "}
										<br />
										Coba gunakan kata kunci lain atau hubungi CS kami.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="max-w-4xl mx-auto px-4 mt-24">
				<div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
					<div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
					<div className="relative z-10">
						<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
							Masih punya pertanyaan lain?
						</h2>
						<p className="text-slate-400 mb-8 max-w-lg mx-auto">
							Tim customer service kami siap membantu Anda 24/7 untuk segala
							pertanyaan mendesak.
						</p>
						<a
							href="https://wa.me/6283806518859"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-full font-black hover:bg-brand-primary/90 transition-all hover:scale-105"
						>
							Hubungi Kami via WhatsApp
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
