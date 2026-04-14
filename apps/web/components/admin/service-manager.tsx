"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlinePencilAlt, HiPlus } from "react-icons/hi";
import { ServiceModal } from "@/components/shared/service-modal";
import { formatIDR } from "@/lib/utils";

interface ServiceManagerProps {
	services: any[];
	outletId: string;
}

export function ServiceManager({ services, outletId }: ServiceManagerProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [selectedService, setSelectedService] = useState<any>(null);
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
		<div className="space-y-8 animate-fade-in">
			{/* Action Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-2xl">
						🧺
					</div>
					<div>
						<h2 className="text-xl font-black text-slate-900 leading-none">
							Manajemen Layanan
						</h2>
						<p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
							Pusat Pengaturan Produk
						</p>
					</div>
				</div>
				<ServiceModal
					outletId={outletId}
					trigger={
						<button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-0.5 transition-all">
							<span className="text-lg">
								<HiPlus />
							</span>
							<span>Tambah Baru</span>
						</button>
					}
				/>
			</div>

			{/* Services Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{services.map((service) => (
					<div
						key={service.id}
						onClick={() => handleServiceClick(service.slug)}
						className="group relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-brand-primary/20 transition-all duration-300 cursor-pointer overflow-hidden"
					>
						{/* Express Badge */}
						{service.is_express && (
							<div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-bl-2xl">
								⚡ Express
							</div>
						)}

						<div className="flex items-start gap-5">
							<div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-brand-primary/5 group-hover:border-brand-primary/10 transition-all duration-300">
								{service.icon || "🧺"}
							</div>
							<div className="flex-1">
								<h3 className="text-base font-black text-slate-900 group-hover:text-brand-primary transition-colors">
									{service.name}
								</h3>
								<p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">
									{service.estimated_duration_hours} JAM ESTIMASI
								</p>
							</div>
						</div>

						<div className="mt-6 pt-6 border-t border-slate-50 flex items-end justify-between">
							<div>
								<span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
									Mulai Dari
								</span>
								<span className="text-xl font-black text-slate-900 font-mono">
									{formatIDR(Number(service.price))}
									<span className="text-xs text-slate-400 font-bold lowercase ml-0.5">
										/{service.unit}
									</span>
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div
									className={`w-2 h-2 rounded-full ${service.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"}`}
								/>
								<span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
									{service.is_active ? "Aktif" : "Nonaktif"}
								</span>
							</div>
						</div>

						{/* Hover Indicator */}
						<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
							<div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/30">
								<HiOutlinePencilAlt size={16} />
							</div>
						</div>
					</div>
				))}
			</div>

			{services.length === 0 && (
				<div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
					<div className="text-6xl mb-6">🧺</div>
					<h3 className="text-xl font-black text-slate-900 tracking-tight">
						Belum Ada Layanan
					</h3>
					<p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">
						Daftar layanan Anda akan muncul di sini setelah Anda menambahkannya.
					</p>
				</div>
			)}

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
