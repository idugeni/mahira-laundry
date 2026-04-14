"use client";

import { motion } from "motion/react";
import {
	HiOutlineChatBubbleOvalLeftEllipsis,
	HiOutlineChevronRight,
	HiOutlineShoppingBag,
} from "react-icons/hi2";

interface OrderModeSelectorProps {
	onSelectForm: () => void;
	onSelectWhatsapp: () => void;
}

export function OrderModeSelector({
	onSelectForm,
	onSelectWhatsapp,
}: OrderModeSelectorProps) {
	return (
		<motion.div
			key="selection"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4"
		>
			{/* Mode Form Mandiri */}
			<button
				onClick={onSelectForm}
				className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:border-brand-primary active:scale-95 overflow-hidden"
			>
				<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
					<span className="text-9xl text-brand-primary transition-transform group-hover:rotate-12 block">
						<HiOutlineShoppingBag />
					</span>
				</div>
				<div className="w-20 h-20 bg-brand-primary/10 rounded-[28px] flex items-center justify-center text-3xl text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-brand-primary/20">
					<HiOutlineShoppingBag />
				</div>
				<h3 className="text-xl font-black text-slate-900 mb-2">
					Pilih Sendiri
				</h3>
				<p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 px-4">
					Pilih layanan, hitung estimasi biaya, dan tentukan jadwal jemput
					secara mandiri melalui form.
				</p>
				<div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest bg-brand-primary/5 px-6 py-2.5 rounded-full group-hover:bg-brand-primary group-hover:text-white transition-all">
					Mulai Form <HiOutlineChevronRight />
				</div>
			</button>

			{/* Mode WhatsApp */}
			<button
				onClick={onSelectWhatsapp}
				className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:border-emerald-500 active:scale-95 overflow-hidden"
			>
				<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
					<span className="text-9xl text-emerald-500 transition-transform group-hover:rotate-12 block">
						<HiOutlineChatBubbleOvalLeftEllipsis />
					</span>
				</div>
				<div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center text-3xl text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-emerald-500/20">
					<HiOutlineChatBubbleOvalLeftEllipsis />
				</div>
				<h3 className="text-xl font-black text-slate-900 mb-2">Pesan via WA</h3>
				<p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 px-4">
					Malas isi form? Chat admin kami sekarang, kami akan bantu buatkan
					pesanan untuk Anda.
				</p>
				<div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-6 py-2.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
					Chat Admin <HiOutlineChevronRight />
				</div>
			</button>
		</motion.div>
	);
}
