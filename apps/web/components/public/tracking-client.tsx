"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trackOrder } from "@/lib/actions/orders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants";
import type { Order } from "@/lib/types";
import { formatDateTime, formatIDR } from "@/lib/utils";

type TrackedOrder = Order & {
	order_status_logs?: Array<{ status: string; notes?: string; created_at: string }>;
};

export function TrackingClient() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<TrackedOrder | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isScanning, setIsScanning] = useState(false);

	const idParam = searchParams.get("id");

	const handleSearch = async (searchQuery: string) => {
		if (!searchQuery.trim()) return;

		setLoading(true);
		setError(null);
		setOrder(null);

		try {
			const res = await trackOrder(searchQuery);
			if (res.success && res.data) {
				setOrder(res.data as TrackedOrder);
			} else {
				setError(res.error || "Pesanan tidak ditemukan");
			}
		} catch (_err) {
			setError("Terjadi kesalahan sistem");
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: handleSearch is stable within component lifecycle
	useEffect(() => {
		if (idParam) {
			setQuery(idParam);
			handleSearch(idParam);
		}
	}, [idParam]);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		router.replace(`/lacak?id=${query}`);
	};

	// QR Scanner logic
	useEffect(() => {
		let scanner: Html5QrcodeScanner | null = null;

		if (isScanning) {
			scanner = new Html5QrcodeScanner(
				"qr-reader",
				{ fps: 10, qrbox: { width: 250, height: 250 } },
				false,
			);

			scanner.render(
				(decodedText) => {
					// If it's a URL, extract ID
					let idToSearch = decodedText;
					try {
						const url = new URL(decodedText);
						const idFromUrl = url.searchParams.get("id");
						if (idFromUrl) {
							idToSearch = idFromUrl;
						}
					} catch (_e) {
						// Not a URL, use text directly
					}

					setQuery(idToSearch);
					setIsScanning(false);
					scanner?.clear();
					router.replace(`/lacak?id=${idToSearch}`);
					toast.success("QR Code berhasil dipindai!");
				},
				(_error) => {
					// Ignore scanner frame errors
				},
			);
		}

		return () => {
			if (scanner) {
				scanner.clear().catch(console.error);
			}
		};
	}, [isScanning, router]);

	return (
		<div className="space-y-6">
			{/* Search Box */}
			<div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
				<form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Ketik ID Pesanan (misal: ORD-123...)"
						className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:font-medium"
					/>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setIsScanning(!isScanning)}
							className="px-5 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
						>
							<span>📷</span> Scan QR
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-8 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20"
						>
							{loading ? "Mencari..." : "Lacak"}
						</button>
					</div>
				</form>

				{isScanning && (
					<div className="mt-4 p-4 border border-slate-200 rounded-2xl overflow-hidden">
						<div id="qr-reader" className="w-full"></div>
						<button
							type="button"
							onClick={() => setIsScanning(false)}
							className="mt-4 w-full py-2 bg-red-50 text-red-600 font-bold rounded-xl"
						>
							Tutup Kamera
						</button>
					</div>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
					<span className="text-3xl mb-2 block">🔍</span>
					<p className="font-bold text-red-600">{error}</p>
					<p className="text-sm text-red-500 mt-1">
						Pastikan ID atau Nomor Order sudah benar.
					</p>
				</div>
			)}

			{/* Order Result */}
			{order && (
				<div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
					<div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
									Status Saat Ini
								</p>
								<div className="flex items-center gap-3">
									<h2 className="text-2xl font-black text-slate-900">
										{order.order_number}
									</h2>
									<span
										className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${ORDER_STATUS_COLORS[order.status] || "bg-slate-100 text-slate-600"}`}
									>
										{ORDER_STATUS_LABELS[order.status] || order.status}
									</span>
								</div>
							</div>
							<div className="text-left sm:text-right">
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
									Total
								</p>
								<p className="text-xl font-black text-brand-primary">
									{formatIDR(order.total)}
								</p>
							</div>
						</div>
					</div>

					<div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
						{/* Timeline */}
						<div className="p-6 sm:p-8">
							<h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
								<span>⏱️</span> Timeline Pesanan
							</h3>
							<div className="space-y-6">
								{(
									order.order_status_logs as Array<{
										created_at: string;
										status: string;
										notes?: string;
									}>
								)
									?.sort(
										(a, b) =>
											new Date(b.created_at).getTime() -
											new Date(a.created_at).getTime(),
									)
									.map((log, idx) => (
										<div
											key={log.created_at + log.status}
											className="relative pl-6"
										>
											{idx !==
												(order.order_status_logs as unknown[]).length - 1 && (
												<div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-slate-200" />
											)}
											<div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center">
												<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
											</div>
											<div>
												<p className="font-bold text-sm text-slate-900">
													{ORDER_STATUS_LABELS[log.status] || log.status}
												</p>
												<p className="text-xs text-slate-500 mt-0.5">
													{formatDateTime(log.created_at)}
												</p>
												{log.notes && (
													<p className="text-[10px] font-medium text-slate-400 mt-1 italic">
														"{log.notes}"
													</p>
												)}
											</div>
										</div>
									))}
							</div>
						</div>

						{/* Items */}
						<div className="p-6 sm:p-8 bg-slate-50/30">
							<h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
								<span>🧺</span> Rincian Layanan
							</h3>
							<div className="space-y-4">
								{(
									order.order_items as Array<{
										service_name: string;
										quantity: number;
										unit?: string;
										is_express?: boolean;
										subtotal: number;
									}>
								)?.map((item) => (
									<div key={item.service_name} className="flex justify-between items-start">
										<div className="pr-4">
											<p className="font-bold text-sm text-slate-900">
												{item.service_name}
											</p>
											<p className="text-xs font-medium text-slate-500 mt-0.5">
												{item.quantity} {item.unit}{" "}
												{item.is_express ? "⚡ Express" : ""}
											</p>
										</div>
										<p className="font-bold text-sm text-slate-700 shrink-0">
											{formatIDR(item.subtotal)}
										</p>
									</div>
								))}
							</div>

							{order.notes && (
								<div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100/50">
									<p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">
										Catatan
									</p>
									<p className="text-xs text-amber-700 whitespace-pre-wrap">
										{order.notes}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
