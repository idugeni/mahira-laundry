"use client";

import { AnimatePresence, motion } from "motion/react";
import {
	HiOutlineCheckCircle,
	HiOutlineInformationCircle,
} from "react-icons/hi2";
import { formatIDR } from "@/lib/utils";

interface Service {
	id: string;
	name: string;
	price: number;
	unit: string;
}

interface Outlet {
	id: string;
	name: string;
}

interface OrderConfirmStepProps {
	services: Service[];
	outlets: Outlet[];
	selectedOutlet: string | null;
	quantities: Record<string, number>;
	calculateTotal: () => number;
	loading: boolean;
	onSubmit: () => void;
}

export function OrderConfirmStep({
	services,
	outlets,
	selectedOutlet,
	quantities,
	calculateTotal,
	loading,
	onSubmit,
}: OrderConfirmStepProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="s4"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="max-w-2xl mx-auto space-y-8"
			>
				<div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
					<div className="absolute top-0 right-0 p-8 text-white/5 text-9xl">
						<HiOutlineCheckCircle />
					</div>
					<div className="relative z-10 space-y-6">
						<div className="flex justify-between items-center pb-6 border-b border-white/10">
							<span className="text-white/40 text-xs font-bold uppercase tracking-widest">
								Outlet
							</span>
							<span className="font-black text-brand-accent">
								{outlets.find((o) => o.id === selectedOutlet)?.name}
							</span>
						</div>
						<div className="space-y-4">
							{services.map(
								(s) =>
									(quantities[s.id] || 0) > 0 && (
										<div
											key={s.id}
											className="flex justify-between items-center text-sm"
										>
											<span className="text-white/60">
												{s.name} ({quantities[s.id]} {s.unit})
											</span>
											<span className="font-bold">
												{formatIDR((quantities[s.id] || 0) * s.price)}
											</span>
										</div>
									),
							)}
						</div>
						<div className="flex justify-between items-end pt-8">
							<div>
								<p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
									Total Estimasi
								</p>
								<p className="text-3xl font-black text-brand-accent">
									{formatIDR(calculateTotal())}
								</p>
							</div>
							<span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full uppercase tracking-widest">
								Sangat Hemat
							</span>
						</div>
					</div>
				</div>
				<div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
					<span className="text-2xl text-amber-500 shrink-0">
						<HiOutlineInformationCircle />
					</span>
					<p className="text-xs text-amber-900 font-medium leading-relaxed">
						<b>Penting:</b> Berat pasti dan total tagihan akan ditentukan
						setelah penimbangan fisik di outlet. Anda akan menerima notifikasi
						tagihan final segera setelah proses tuntas.
					</p>
				</div>
				<button
					type="button"
					onClick={onSubmit}
					disabled={loading}
					className="w-full py-6 bg-brand-primary text-white rounded-[32px] font-black text-xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
				>
					{loading ? "Menyimpan Pesanan..." : "Konfirmasi & Bayar"}
				</button>
			</motion.div>
		</AnimatePresence>
	);
}
