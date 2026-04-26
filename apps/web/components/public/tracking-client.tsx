"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	HiOutlineCheckCircle,
	HiOutlineClock,
	HiOutlineMagnifyingGlass,
	HiOutlineQrCode,
	HiOutlineReceiptPercent,
	HiOutlineSparkles,
	HiOutlineTruck,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import { trackOrder } from "@/lib/actions/orders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants";
import type { Order } from "@/lib/types";
import { formatDateTime, formatIDR } from "@/lib/utils";

type TrackedOrder = Order & {
	order_status_logs?: Array<{
		status: string;
		notes?: string;
		created_at: string;
	}>;
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
			setError("Terjadi kesalahan sistem saat mencari data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (idParam) {
			setQuery(idParam);
			handleSearch(idParam);
		}
	}, [idParam]);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;
		router.replace(`/lacak?id=${query}`);
	};

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
					let idToSearch = decodedText;
					try {
						const url = new URL(decodedText);
						const idFromUrl = url.searchParams.get("id");
						if (idFromUrl) {
							idToSearch = idFromUrl;
						}
					} catch (_e) {}

					setQuery(idToSearch);
					setIsScanning(false);
					scanner?.clear();
					router.replace(`/lacak?id=${idToSearch}`);
					toast.success("QR Code berhasil dipindai!");
				},
				(_error) => {},
			);
		}

		return () => {
			if (scanner) {
				scanner.clear().catch(() => {});
			}
		};
	}, [isScanning, router]);

	return (
		<div className="space-y-12">
			{/* Search Box Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden"
			>
				{/* Decorative pulse for focus */}
				<div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />

				<form onSubmit={onSubmit} className="relative z-10 space-y-6">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="relative flex-1 group">
							<span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
								<HiOutlineMagnifyingGlass size={24} />
							</span>
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Masukkan ID Pesanan (ORD-XXXXX)"
								className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl text-lg font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all placeholder:font-medium placeholder:text-slate-300"
							/>
						</div>

						<div className="flex gap-4">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="button"
								onClick={() => setIsScanning(!isScanning)}
								className="px-8 py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
							>
								<span className="text-brand-accent">
									<HiOutlineQrCode size={24} />
								</span>
								<span className="text-xs uppercase tracking-widest">
									Scan QR
								</span>
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								disabled={loading}
								className="px-12 py-6 bg-brand-primary text-white font-black rounded-3xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-brand-primary/30 flex-1 lg:flex-none"
							>
								{loading ? "Mencari..." : "Lacak Sekarang"}
							</motion.button>
						</div>
					</div>
				</form>

				<AnimatePresence>
					{isScanning && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-8 pt-8 border-t border-slate-100 overflow-hidden"
						>
							<div
								id="qr-reader"
								className="w-full rounded-3xl overflow-hidden border-4 border-slate-900"
							/>
							<button
								type="button"
								onClick={() => setIsScanning(false)}
								className="mt-6 w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors"
							>
								Batalkan Pemindaian
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Status Result Section */}
			<AnimatePresence mode="wait">
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="bg-red-50/50 backdrop-blur-sm border border-red-100 p-12 rounded-[3.5rem] text-center"
					>
						<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-400 mx-auto mb-6 shadow-sm">
							<HiOutlineMagnifyingGlass size={40} />
						</div>
						<h3 className="text-2xl font-black text-red-900 mb-2 tracking-tight">
							Pesanan Tidak Ditemukan
						</h3>
						<p className="text-red-600 font-medium">{error}</p>
					</motion.div>
				)}

				{order && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="space-y-8"
					>
						{/* Header Card */}
						<div className="bg-slate-900 p-10 lg:p-14 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
							<div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary opacity-20 blur-[120px] -mr-40 -mt-40" />

							<div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
								<div>
									<div className="flex items-center gap-3 mb-6">
										<span className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
											{ORDER_STATUS_LABELS[order.status] || order.status}
										</span>
										<span className="text-brand-primary">
											<HiOutlineSparkles size={18} />
										</span>
									</div>
									<h2 className="text-5xl lg:text-7xl font-black font-[family-name:var(--font-heading)] leading-none tracking-tighter mb-4">
										{order.order_number}
									</h2>
									<p className="text-slate-400 font-medium text-lg">
										Terima kasih telah mempercayakan pakaian Anda pada Mahira.
									</p>
								</div>

								<div className="text-left md:text-right">
									<p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
										Total Pembayaran
									</p>
									<p className="text-4xl lg:text-5xl font-black text-brand-accent tracking-tighter">
										{formatIDR(order.total)}
									</p>
								</div>
							</div>
						</div>

						{/* Detail Grid */}
						<div className="grid lg:grid-cols-12 gap-8 items-start">
							{/* Timeline */}
							<div className="lg:col-span-7 bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm relative">
								<h3 className="text-2xl font-black text-slate-900 mb-12 flex items-center gap-4">
									<span className="text-brand-primary">
										<HiOutlineClock size={28} />
									</span>
									Riwayat Status
								</h3>

								<div className="space-y-12 relative">
									{/* Vertical Line */}
									<div className="absolute left-6 top-3 bottom-3 w-1 bg-slate-50 rounded-full" />

									{order.order_status_logs
										?.sort(
											(a, b) =>
												new Date(b.created_at).getTime() -
												new Date(a.created_at).getTime(),
										)
										.map((log, i) => (
											<motion.div
												key={log.created_at + log.status}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.1 }}
												className="relative pl-16 group"
											>
												<div
													className={`absolute left-0 top-1 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${i === 0 ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30" : "bg-slate-50 text-slate-300"}`}
												>
													{i === 0 ? (
														<HiOutlineCheckCircle size={24} />
													) : (
														<HiOutlineClock size={20} />
													)}
												</div>

												<div>
													<p
														className={`text-xl font-black tracking-tight mb-1 ${i === 0 ? "text-slate-900" : "text-slate-400"}`}
													>
														{ORDER_STATUS_LABELS[log.status] || log.status}
													</p>
													<p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
														{formatDateTime(log.created_at)}
													</p>
													{log.notes && (
														<div className="mt-3 p-4 bg-slate-50 rounded-2xl border-l-4 border-brand-primary">
															<p className="text-sm font-medium text-slate-600 italic">
																"{log.notes}"
															</p>
														</div>
													)}
												</div>
											</motion.div>
										))}
								</div>
							</div>

							{/* Summary */}
							<div className="lg:col-span-5 space-y-8">
								<div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm">
									<h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
										<span className="text-brand-primary">
											<HiOutlineReceiptPercent size={28} />
										</span>
										Rincian Layanan
									</h3>

									<div className="space-y-6">
										{order.order_items?.map((item, i) => (
											<div
												key={i}
												className="flex justify-between items-start group"
											>
												<div className="space-y-1">
													<p className="font-black text-slate-900 group-hover:text-brand-primary transition-colors">
														{item.service_name}
													</p>
													<p className="text-xs font-black text-slate-400 uppercase tracking-widest">
														{item.quantity} {item.unit}{" "}
														{item.is_express && "• EXPRESS"}
													</p>
												</div>
												<p className="font-black text-slate-900">
													{formatIDR(item.subtotal)}
												</p>
											</div>
										))}

										<div className="pt-6 border-t border-slate-50 mt-6">
											{order.notes && (
												<div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100">
													<p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">
														Instruksi Khusus
													</p>
													<p className="text-sm font-medium text-amber-900 leading-relaxed">
														{order.notes}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Delivery Info If Any */}
								<motion.div
									whileHover={{ y: -5 }}
									className="bg-brand-primary/5 p-10 rounded-[3rem] border border-brand-primary/10 flex items-center gap-6"
								>
									<div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-brand-primary shadow-sm">
										<HiOutlineTruck size={32} />
									</div>
									<div>
										<h4 className="text-lg font-black text-slate-900 tracking-tight">
											Butuh Antar Jemput?
										</h4>
										<p className="text-sm font-medium text-slate-500 leading-relaxed">
											Hubungi admin kami untuk menjadwalkan pengambilan pakaian
											kotor Anda.
										</p>
									</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
