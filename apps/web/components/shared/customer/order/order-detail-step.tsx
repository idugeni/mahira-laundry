"use client";

import { AnimatePresence, motion } from "motion/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface OrderDetailStepProps {
	pickupAddress: string;
	pickupDate: string;
	pickupTime: string;
	onAddressChange: (val: string) => void;
	onDateChange: (val: string) => void;
	onTimeChange: (val: string) => void;
	onNext: () => void;
}

export function OrderDetailStep({
	pickupAddress,
	pickupDate,
	pickupTime,
	onAddressChange,
	onDateChange,
	onTimeChange,
	onNext,
}: OrderDetailStepProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="s3"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -10 }}
				className="max-w-xl mx-auto space-y-8"
			>
				<div className="space-y-6">
					<div className="space-y-3">
						<label
							htmlFor="order-pickup-address"
							className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2 italic"
						>
							Alamat Penjemputan
						</label>
						<textarea
							id="order-pickup-address"
							value={pickupAddress}
							onChange={(e) => onAddressChange(e.target.value)}
							rows={3}
							placeholder="Masukkan alamat lengkap..."
							className="w-full p-6 bg-white border border-slate-100 rounded-[30px] font-medium outline-none focus:border-brand-primary/30 transition-all shadow-sm"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-3">
							<label
								htmlFor="order-pickup-date"
								className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] italic"
							>
								Tanggal
							</label>
							<input
								id="order-pickup-date"
								type="date"
								value={pickupDate}
								onChange={(e) => onDateChange(e.target.value)}
								className="w-full p-6 bg-white border border-slate-100 rounded-[30px] font-medium outline-none focus:border-brand-primary/30 transition-all shadow-sm"
							/>
						</div>
						<div className="space-y-3">
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] italic">
								Waktu
							</p>
							<Select value={pickupTime} onValueChange={onTimeChange}>
								<SelectTrigger className="w-full h-[68px] px-6 bg-white border border-slate-100 rounded-[30px] font-bold outline-none focus:ring-brand-primary/20 transition-all shadow-sm">
									<SelectValue placeholder="Pilih Waktu" />
								</SelectTrigger>
								<SelectContent className="rounded-3xl border-slate-100 shadow-2xl">
									<SelectItem
										value="08:00 - 12:00"
										className="py-4 font-bold rounded-2xl"
									>
										08:00 - 12:00
									</SelectItem>
									<SelectItem
										value="12:00 - 16:00"
										className="py-4 font-bold rounded-2xl"
									>
										12:00 - 16:00
									</SelectItem>
									<SelectItem
										value="16:00 - 20:00"
										className="py-4 font-bold rounded-2xl"
									>
										16:00 - 20:00
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<button
					type="button"
					onClick={onNext}
					disabled={!pickupAddress || !pickupDate}
					className="w-full py-6 bg-brand-primary text-white rounded-[32px] font-black text-xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50"
				>
					Lanjutkan ke Konfirmasi
				</button>
			</motion.div>
		</AnimatePresence>
	);
}
