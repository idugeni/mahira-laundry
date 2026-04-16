"use client";

import {
	Clock,
	Edit3,
	Layers,
	LayoutGrid,
	Package,
	Plus,
	Search,
	Sparkles,
	Trash2,
	Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ServiceModal } from "@/components/shared/admin/services/service-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Service } from "@/lib/types";
import { cn, formatIDR } from "@/lib/utils";

interface ServiceManagerProps {
	services: Service[];
	outletId: string;
}

export function ServiceManager({ services, outletId }: ServiceManagerProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Sync state with URL
	useEffect(() => {
		const editSlug = searchParams.get("edit");
		if (editSlug) {
			const service = services.find((s) => s.slug === editSlug);
			if (service) {
				setSelectedService(service);
				setIsDetailOpen(true);
			}
		} else {
			setIsDetailOpen(false);
			setSelectedService(null);
		}
	}, [searchParams, services]);

	const handleServiceClick = (slug: string) => {
		router.push(`/admin/layanan?edit=${slug}`, { scroll: false });
	};

	const closeModal = () => {
		router.push("/admin/layanan", { scroll: false });
	};

	return (
		<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Action Toolbar */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
				<div className="relative group flex-1 max-w-md">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
					<Input
						className="pl-11 pr-4 py-6 bg-white rounded-2xl border-slate-100 shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm"
						placeholder="Cari layanan laundry..."
					/>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shadow-sm"
					>
						<LayoutGrid size={16} className="mr-2" /> Grid View
					</Button>
					<Button
						variant="outline"
						className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shadow-sm"
					>
						<Layers size={16} className="mr-2" /> Categories
					</Button>
					<ServiceModal
						outletId={outletId}
						trigger={
							<Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-8 h-12 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 flex items-center gap-3 ml-2">
								<Plus size={18} /> Daftarkan Layanan
							</Button>
						}
					/>
				</div>
			</div>

			{/* Services Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{services.map((service) => (
					<div
						key={service.id}
						className="group relative bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-500 overflow-hidden"
					>
						{/* Background Glow */}
						<div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

						{/* Express Badge */}
						{service.is_express && (
							<div className="absolute top-6 right-6 px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg shadow-amber-500/20 z-10 animate-bounce">
								<Zap size={10} fill="currentColor" /> Express
							</div>
						)}

						<div className="relative flex flex-col h-full gap-8">
							<div className="flex items-start gap-5">
								<div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:rotate-3 shadow-lg shadow-slate-100 group-hover:shadow-indigo-100">
									{service.icon || (
										<Package size={32} className="text-slate-300" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-indigo-600 transition-colors">
										{service.name}
									</h3>
									<div className="flex items-center gap-2 mt-2">
										<Clock size={12} className="text-slate-400" />
										<p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
											{service.estimated_duration_hours} Jam Estimasi
										</p>
									</div>
								</div>
							</div>

							<div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all duration-500">
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
									Pricelist Premium
								</p>
								<div className="flex items-baseline gap-1">
									<p className="text-3xl font-black text-slate-900 tracking-tighter">
										{formatIDR(Number(service.price)).replace("Rp", "").trim()}
									</p>
									<p className="text-xs font-black text-slate-400 uppercase tracking-widest">
										IDR / {service.unit}
									</p>
								</div>
							</div>

							<div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div
										className={cn(
											"w-2.5 h-2.5 rounded-full",
											service.is_active
												? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
												: "bg-slate-300",
										)}
									/>
									<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
										{service.is_active ? "Layanan Aktif" : "Nonaktif"}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										className="w-10 h-10 p-0 rounded-xl hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 transition-all"
										onClick={() => handleServiceClick(service.slug ?? service.id)}
									>
										<Edit3 size={18} />
									</Button>
									<Button
										variant="ghost"
										className="w-10 h-10 p-0 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all"
									>
										<Trash2 size={18} />
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{services.length === 0 && (
				<div className="bg-white rounded-[4rem] border border-slate-100 p-32 text-center shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 to-slate-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
					<div className="relative flex flex-col items-center">
						<div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-100">
							<Sparkles size={48} className="text-slate-200" />
						</div>
						<h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
							Katalog Masih Kosong
						</h3>
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-4 max-w-lg leading-relaxed text-center mx-auto">
							Daftar layanan premium Anda akan muncul di sini. Mari mulai dengan
							mendaftarkan jenis layanan laundry pertama Anda.
						</p>
						<ServiceModal
							outletId={outletId}
							trigger={
								<Button className="mt-10 bg-slate-900 border-none rounded-2xl px-10 h-14 font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20">
									Mulai Sekarang
								</Button>
							}
						/>
					</div>
				</div>
			)}

			{/* Strategy Box */}
			<div className="bg-indigo-600 rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20 transition-transform hover:scale-[1.01] duration-500">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />

				<div className="relative flex flex-col lg:flex-row items-center gap-10">
					<div className="w-24 h-24 bg-white/10 rounded-[2rem] border border-white/10 flex items-center justify-center text-4xl shadow-2xl backdrop-blur-xl shrink-0 group-hover:rotate-12 transition-transform duration-500">
						💡
					</div>
					<div className="flex-1 text-center lg:text-left">
						<h3 className="text-2xl font-black uppercase tracking-tight mb-4">
							Optimasi Produk Laundry
						</h3>
						<p className="text-indigo-100/70 font-bold text-sm leading-relaxed max-w-2xl">
							Standardisasi layanan di seluruh cabang sangat krusial. Pastikan
							setiap layanan memiliki durasi estimasi yang akurat guna menjaga
							kepuasan pelanggan dan efisiensi waktu operasional.
						</p>
					</div>
					<Button className="bg-slate-900 hover:bg-white hover:text-indigo-600 text-white rounded-2xl h-14 px-10 font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20">
						Analisis Performa
					</Button>
				</div>
			</div>

			{/* Integrated Modal Controller (URL Sync) */}
			{selectedService && (
				<ServiceModal
					service={selectedService}
					outletId={outletId}
					isOpen={isDetailOpen}
					onOpenChange={(open) => {
						if (!open) closeModal();
					}}
				/>
			)}
		</div>
	);
}
