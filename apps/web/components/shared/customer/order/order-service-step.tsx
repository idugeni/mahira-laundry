"use client";

import { AnimatePresence, motion } from "motion/react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import {
	MdOutlineDryCleaning,
	MdOutlineFlashOn,
	MdOutlineIron,
	MdOutlineLocalLaundryService,
} from "react-icons/md";
import { formatIDR } from "@/lib/utils";

interface Service {
	id: string;
	name: string;
	price: number;
	unit: string;
	description?: string;
}

interface OrderServiceStepProps {
	services: Service[];
	quantities: Record<string, number>;
	onUpdateQuantity: (id: string, delta: number) => void;
	onSetQuantity: (id: string, value: number) => void;
	onNext: () => void;
	calculateTotal: () => number;
}

function getServiceIcon(name: string) {
	if (name.toLowerCase().includes("setrika")) return MdOutlineIron;
	if (name.toLowerCase().includes("express")) return MdOutlineFlashOn;
	if (name.toLowerCase().includes("dry")) return MdOutlineDryCleaning;
	return MdOutlineLocalLaundryService;
}

export function OrderServiceStep({
	services,
	quantities,
	onUpdateQuantity,
	onSetQuantity,
	onNext,
	calculateTotal,
}: OrderServiceStepProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="s2"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -10 }}
				className="space-y-6"
			>
				{services.map((service) => {
					const Icon = getServiceIcon(service.name);
					return (
						<div
							key={service.id}
							className="p-6 sm:p-8 bg-white rounded-[32px] border border-slate-100 group transition-all"
						>
							<div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 items-center">
								<div className="flex items-start gap-6">
									<div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl text-slate-400 group-hover:text-brand-primary transition-colors shrink-0 shadow-inner">
										<Icon />
									</div>
									<div className="min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
												{service.name}
											</h3>
											<span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md uppercase">
												{service.unit}
											</span>
										</div>
										<p className="text-slate-500 text-sm font-medium line-clamp-1 mb-3">
											{service.description}
										</p>
										<div className="flex items-center gap-2">
											<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
												Estimasi:
											</span>
											<span className="text-xl font-black text-brand-primary">
												{formatIDR(service.price)}
											</span>
											<span className="text-[10px] font-black text-slate-300 uppercase">
												/{service.unit}
											</span>
										</div>
									</div>
								</div>
								<div className="flex flex-col items-center lg:items-end gap-3">
									<div className="flex items-center gap-4 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
										<button
											type="button"
											onClick={() => onUpdateQuantity(service.id, -1)}
											className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-400 hover:text-brand-primary flex items-center justify-center transition-all active:scale-90"
										>
											<HiOutlineChevronLeft />
										</button>
										<input
											type="number"
											step="0.1"
											value={quantities[service.id] || 0}
											onChange={(e) =>
												onUpdateQuantity(
													service.id,
													parseFloat(e.target.value) -
														(quantities[service.id] || 0),
												)
											}
											className="w-12 text-center font-black text-lg bg-transparent text-slate-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
										/>
										<button
											type="button"
											onClick={() => onUpdateQuantity(service.id, 1)}
											className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-400 hover:text-brand-primary flex items-center justify-center transition-all active:scale-90"
										>
											<HiOutlineChevronRight />
										</button>
									</div>
									<div
										className={`flex gap-1.5 ${service.unit === "kg" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
									>
										{[3, 5, 8].map((k) => (
											<button
												key={k}
												type="button"
												onClick={() => onSetQuantity(service.id, k)}
												className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 hover:text-brand-primary hover:border-brand-primary shadow-sm transition-all"
											>
												{k}Kg
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					);
				})}
				<div className="flex justify-end pt-8">
					<button
						type="button"
						onClick={onNext}
						disabled={calculateTotal() === 0}
						className="px-12 py-5 bg-brand-primary text-white rounded-[24px] font-black shadow-2xl shadow-brand-primary/20 flex items-center gap-3 transition-all hover:scale-105 disabled:opacity-50"
					>
						Konfirmasi Layanan <HiOutlineChevronRight />
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
