import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/utils";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	return {
		title: `Order ${id}`,
		description: `Detail dan tracking order ${id} di Mahira Laundry.`,
	};
}

const statusLabels: Record<string, string> = {
	pending: "Menunggu Konfirmasi",
	confirmed: "Dikonfirmasi",
	picked_up: "Dijemput",
	received: "Diterima Outlet",
	washing: "Sedang Dicuci",
	ironing: "Sedang Disetrika",
	qc_passed: "Lulus Quality Control",
	ready: "Siap Dikirim/Diambil",
	delivering: "Sedang Dikirim",
	completed: "Selesai",
	cancelled: "Dibatalkan",
};

export default async function OrderDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: order } = await supabase
		.from("orders")
		.select("*, order_items(*)")
		.eq("id", id)
		.single();

	if (!order) {
		notFound();
	}

	const getTimeline = () => {
		const steps = [
			{ status: "pending", label: "Pesanan Dibuat", time: order.created_at },
			{ status: "confirmed", label: "Dikonfirmasi", time: order.confirmed_at },
			{ status: "washing", label: "Proses Pencucian", time: order.washing_at },
			{
				status: "ironing",
				label: "Proses Penyetrikaan",
				time: order.ironing_at,
			},
			{
				status: "qc_passed",
				label: "Quality Control",
				time: order.qc_passed_at,
			},
			{ status: "ready", label: "Siap Diambil/Dikirim", time: order.ready_at },
			{
				status: "completed",
				label: "Pesanan Selesai",
				time: order.completed_at,
			},
		];

		if (order.status === "cancelled") {
			steps.push({
				status: "cancelled",
				label: "Dibatalkan",
				time: order.cancelled_at,
			});
		}

		return steps.map((step) => {
			const isPastOrCurrent = !!step.time || order.status === "completed";
			return {
				...step,
				done: isPastOrCurrent,
			};
		});
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6 py-10 px-4">
			<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
				Detail <span className="inline-block text-brand-gradient">Order</span>
			</h1>

			<div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8">
				<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
					<div>
						<span className="text-xs font-black text-slate-400 uppercase tracking-widest">
							ID Transaksi
						</span>
						<div className="font-black text-xl text-slate-900 mt-1 uppercase">
							{order.id.split("-")[0]}...{order.id.split("-")[4]}
						</div>
					</div>
					<span
						className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
							order.status === "completed"
								? "bg-emerald-50 text-emerald-600"
								: order.status === "cancelled"
									? "bg-red-50 text-red-600"
									: "bg-brand-primary/10 text-brand-primary"
						}`}
					>
						{statusLabels[order.status] || order.status}
					</span>
				</div>

				{/* Timeline */}
				<div className="mb-12">
					<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
						Tracking Status
					</h3>
					<div className="space-y-6 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
						{getTimeline().map((item, i) => (
							<div key={i} className="flex items-start gap-6 relative">
								<div
									className={`w-3 h-3 rounded-full mt-1.5 z-10 ${item.done ? "bg-brand-primary shadow-[0_0_0_4px_rgba(26,107,74,0.1)]" : "bg-slate-200"}`}
								/>
								<div>
									<div
										className={`text-sm font-bold ${item.done ? "text-slate-900" : "text-slate-300"}`}
									>
										{item.label}
									</div>
									{item.time && (
										<div className="text-xs text-slate-400 font-medium mt-1">
											{format(new Date(item.time), "d MMM yyyy, HH:mm", {
												locale: idLocale,
											})}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Items */}
				<div className="border-t border-slate-50 pt-8">
					<h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
						Detail Cucian
					</h3>
					<div className="space-y-3">
						{order.order_items?.map(
							(
								item: Record<string, unknown> & {
									id: string;
									service_name: string;
									quantity: number;
									price: number;
									unit?: string;
									subtotal: number;
								},
							) => (
								<div
									key={item.id}
									className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
								>
									<div>
										<div className="text-sm font-bold text-slate-900">
											{item.service_name}
										</div>
										<div className="text-xs text-slate-500 font-medium mt-0.5">
											{item.quantity} {item.unit}
										</div>
									</div>
									<span className="font-black text-slate-900">
										{formatIDR(item.subtotal)}
									</span>
								</div>
							),
						)}
					</div>
					<div className="mt-8 flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white">
						<span className="font-bold">Total Pembayaran</span>
						<span className="text-2xl font-black text-brand-accent">
							{formatIDR(order.total_amount)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
