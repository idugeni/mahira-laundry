"use client";

import { motion } from "motion/react";
import {
	HiOutlineChatBubbleOvalLeftEllipsis,
	HiOutlineChevronRight,
} from "react-icons/hi2";
import { PRIMARY_OUTLET } from "@/lib/constants";

interface OrderWhatsappPanelProps {
	onBack: () => void;
}

export function OrderWhatsappPanel({ onBack }: OrderWhatsappPanelProps) {
	return (
		<motion.div
			key="whatsapp"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="max-w-md mx-auto px-4"
		>
			<div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl text-center">
				<div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl text-emerald-500 mx-auto mb-8 shadow-inner">
					<HiOutlineChatBubbleOvalLeftEllipsis />
				</div>
				<h2 className="text-2xl font-black text-slate-900 mb-4">
					Siap Membantu!
				</h2>
				<p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
					Tim kami akan membantu Anda menjadwalkan penjemputan dan pencucian
					melalui obrolan WhatsApp.
				</p>

				<div className="space-y-4">
					<a
						href={`https://api.whatsapp.com/send?phone=${PRIMARY_OUTLET.whatsapp}&text=Halo%20Mahira%20Laundry,%20saya%20ingin%20laundry%20cepat...`}
						target="_blank"
						rel="noopener noreferrer"
						className="w-full py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg"
					>
						Buka WhatsApp <HiOutlineChevronRight />
					</a>
					<button
						onClick={onBack}
						className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
					>
						Kembali ke Pilihan
					</button>
				</div>
			</div>
		</motion.div>
	);
}
