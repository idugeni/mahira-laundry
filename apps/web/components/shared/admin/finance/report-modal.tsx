"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	HiOutlineArrowDownTray,
	HiOutlineCalendar,
	HiOutlineCurrencyDollar,
	HiOutlineDocumentChartBar,
	HiOutlineShoppingCart,
	HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "sonner";
import { generateReportData, type ReportType } from "@/lib/actions/reports";
import { exportToCSV } from "@/lib/utils/export";

interface ReportModalProps {
	initialType?: ReportType;
	trigger: React.ReactNode;
}

export function ReportModal({
	initialType = "harian",
	trigger,
}: ReportModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [reportType, setReportType] = useState<ReportType>(initialType);
	const [dateRange, setDateRange] = useState({
		from: new Date(new Date().setDate(new Date().getDate() - 30))
			.toISOString()
			.split("T")[0],
		to: new Date().toISOString().split("T")[0],
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	async function handleExport() {
		setIsLoading(true);
		try {
			const data = await generateReportData(reportType, dateRange);

			if (data.rows.length === 0) {
				toast.error("Tidak ada data pada periode ini.");
			} else {
				exportToCSV(data.rows, `Laporan_${reportType}`);
				toast.success(`Berhasil mengekspor ${data.rows.length} baris data.`);
				setIsOpen(false);
			}
		} catch (error) {
			toast.error((error as Error).message || "Gagal mengolah data laporan.");
		}
		setIsLoading(false);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="contents h-full cursor-pointer"
			>
				{trigger}
			</button>

			{isOpen &&
				mounted &&
				createPortal(
					<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
						<button
							type="button"
							aria-label="Tutup modal"
							className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in cursor-default"
							onClick={() => !isLoading && setIsOpen(false)}
						/>

						<div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in border border-white/20">
							{/* Header */}
							<div className="px-8 pt-8 pb-6 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
								<div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
								<div className="relative flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-pink-500">
											<HiOutlineDocumentChartBar size={24} />
										</div>
										<div>
											<h2 className="text-xl font-black text-slate-900 tracking-tight">
												Kustomisasi{" "}
												<span className="text-pink-600">Laporan</span>
											</h2>
											<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
												Filter & Ekspor Data Operasional
											</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
									>
										<HiOutlineXMark size={16} />
									</button>
								</div>
							</div>

							{/* Body */}
							<div className="p-8 space-y-6">
								{/* Report Type Selector */}
								<div className="space-y-3">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
										Jenis Laporan
									</p>
									<div className="grid grid-cols-2 gap-3">
										{[
											{
												id: "harian",
												label: "Harian",
												icon: <HiOutlineCalendar />,
											},
											{
												id: "bulanan",
												label: "Bulanan",
												icon: <HiOutlineDocumentChartBar />,
											},
											{
												id: "keuangan",
												label: "Keuangan",
												icon: <HiOutlineCurrencyDollar />,
											},
											{
												id: "mingguan",
												label: "Volume Order",
												icon: <HiOutlineShoppingCart />,
											},
										].map((type) => (
											<button
												key={type.id}
												type="button"
												onClick={() => setReportType(type.id as ReportType)}
												className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
													reportType === type.id
														? "bg-pink-50 border-pink-200 text-pink-600 shadow-sm"
														: "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
												}`}
											>
												<span className="text-lg">{type.icon}</span>
												<span className="text-xs font-bold">{type.label}</span>
											</button>
										))}
									</div>
								</div>

								{/* Date Range */}
								<div className="space-y-3 pt-2">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
										Rentang Waktu
									</p>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-1 text-center">
												Mulai Dari
											</p>
											<input
												type="date"
												value={dateRange.from}
												onChange={(e) =>
													setDateRange({ ...dateRange, from: e.target.value })
												}
												className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-pink-500 transition-all"
											/>
										</div>
										<div className="space-y-2">
											<p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-1 text-center">
												Sampai Dengan
											</p>
											<input
												type="date"
												value={dateRange.to}
												onChange={(e) =>
													setDateRange({ ...dateRange, to: e.target.value })
												}
												className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-pink-500 transition-all"
											/>
										</div>
									</div>
								</div>

								{/* Action */}
								<div className="pt-4">
									<button
										type="button"
										onClick={handleExport}
										disabled={isLoading}
										className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
									>
										{isLoading ? (
											<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										) : (
											<>
												<HiOutlineArrowDownTray size={20} />
												<span>Ekspor ke CSV (Excel)</span>
											</>
										)}
									</button>
									<p className="text-[10px] text-center text-slate-400 mt-4 px-8 italic">
										Data yang diekspor disinkronkan langsung dengan basis data
										utama Mahira Laundry untuk akurasi pelaporan.
									</p>
								</div>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
