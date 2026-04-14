"use client";

import { useOptimistic } from "react";
import { toast } from "sonner";

interface DeliveryClientProps {
	initialDeliveries: (Record<string, unknown> & {
		id: string;
		status: string;
		type: string;
		orders?: {
			id: string;
			pickup_address?: string;
			delivery_address?: string;
			profiles?: { full_name?: string };
		};
	})[];
}

export function DeliveryClient({ initialDeliveries }: DeliveryClientProps) {
	const [optimisticDeliveries, addOptimisticDelivery] = useOptimistic(
		initialDeliveries,
		(state, { id, status }) =>
			state.map((d) => (d.id === id ? { ...d, status } : d)),
	);

	const handleUpdateStatus = async (id: string, status: string) => {
		// In a real app, you'd call a server action here
		addOptimisticDelivery({ id, status });
		toast.success("Status tugas diperbarui");
	};

	return (
		<div className="space-y-4">
			{optimisticDeliveries.map((delivery) => (
				<div
					key={delivery.id}
					className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-wrap items-center justify-between gap-6 hover:shadow-xl transition-all"
				>
					<div className="flex items-center gap-6">
						<div
							className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
								delivery.type === "pickup"
									? "bg-blue-50 text-blue-500"
									: "bg-emerald-50 text-emerald-500"
							}`}
						>
							{delivery.type === "pickup" ? "📥" : "📤"}
						</div>
						<div>
							<div className="font-black text-slate-900 group-hover:text-brand-primary transition-colors">
								{delivery.orders?.id.split("-")[0].toUpperCase()} •{" "}
								{delivery.type === "pickup" ? "Penjemputan" : "Pengantaran"}
							</div>
							<div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
								{delivery.orders?.profiles?.full_name || "Pelanggan Guest"}
							</div>
							<div className="text-sm text-slate-500 font-medium mt-2 flex items-center gap-2">
								<span className="text-brand-primary">📍</span>
								{delivery.type === "pickup"
									? delivery.orders?.pickup_address
									: delivery.orders?.delivery_address}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<a
							href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((delivery.type === "pickup" ? delivery.orders?.pickup_address : delivery.orders?.delivery_address) || "")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-3 rounded-xl border border-slate-100 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
						>
							Peta
						</a>
						<button
							onClick={() => handleUpdateStatus(delivery.id, "picked_up")}
							className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-slate-200"
						>
							{delivery.type === "pickup" ? "Selesai Jemput" : "Selesai Antar"}
						</button>
					</div>
				</div>
			))}

			{optimisticDeliveries.length === 0 && (
				<div className="py-20 text-center">
					<div className="text-6xl mb-4 text-slate-200 font-black">☕</div>
					<p className="text-slate-400 font-bold uppercase tracking-widest">
						Tidak ada tugas aktif
					</p>
				</div>
			)}
		</div>
	);
}
