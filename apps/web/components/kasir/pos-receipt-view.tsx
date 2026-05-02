import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { PlusCircle, Receipt } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { POS_CONFIG } from "@/lib/constants";
import { formatIDR } from "@/lib/utils";
import type { CartItem, ReceiptData } from "./pos-types";

interface PosReceiptViewProps {
	receiptData: ReceiptData;
	onNewOrder: () => void;
}

export function PosReceiptView({
	receiptData,
	onNewOrder,
}: PosReceiptViewProps) {
	const receiptRef = useRef<HTMLDivElement>(null);

	const handlePrintReceipt = () => {
		window.print();
	};

	const handleDownloadPNG = async () => {
		if (!receiptRef.current) return;
		try {
			const canvas = await html2canvas(receiptRef.current, { scale: 2 });
			const link = document.createElement("a");
			link.download = `Struk-${receiptData.orderNumber}.png`;
			link.href = canvas.toDataURL("image/png");
			link.click();
		} catch (_err) {
			toast.error("Gagal export struk PNG");
		}
	};

	const handleDownloadPDF = async () => {
		if (!receiptRef.current) return;
		try {
			const canvas = await html2canvas(receiptRef.current, { scale: 2 });
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: [80, 200],
			});
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			pdf.save(`Struk-${receiptData.orderNumber}.pdf`);
		} catch (_err) {
			toast.error("Gagal export struk PDF");
		}
	};

	const trackingUrl =
		typeof window !== "undefined"
			? `${window.location.origin}${POS_CONFIG.trackingPath}?id=${receiptData.orderId}`
			: "";

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
			<div className="flex flex-col items-center space-y-4 text-center">
				<div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-emerald-200 animate-bounce">
					✓
				</div>
				<div className="space-y-1">
					<h2 className="text-4xl font-black text-slate-900 font-[family-name:var(--font-heading)]">
						TRANSAKSI BERHASIL
					</h2>
					<p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
						Nomor Order:{" "}
						<span className="text-brand-primary">
							{receiptData.orderNumber}
						</span>
					</p>
				</div>
			</div>

			<div className="flex gap-4 w-full max-w-md print:hidden">
				<Button
					type="button"
					onClick={handlePrintReceipt}
					className="flex-1 h-auto py-5 bg-slate-900 text-white rounded-3xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 border-none"
				>
					<Receipt className="w-5 h-5" /> CETAK STRUK
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onNewOrder}
					className="flex-1 h-auto py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-3xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
				>
					<PlusCircle className="w-5 h-5" /> ORDER BARU
				</Button>
			</div>

			<div className="relative group">
				<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[82mm] h-4 bg-slate-200 rounded-t-lg -z-10 opacity-50" />

				<div
					ref={receiptRef}
					className="w-[80mm] min-h-[160mm] bg-white text-black p-8 mx-auto shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] print:shadow-none print:border-none print:m-0"
					style={{ fontFamily: "monospace" }}
				>
					<div className="text-center border-b-2 border-dashed border-slate-200 pb-6 mb-6">
						<h1 className="text-2xl font-black uppercase tracking-tighter">
							MAHIRA LAUNDRY
						</h1>
						<p className="text-[10px] mt-2 font-bold opacity-50">
							CABANG: {receiptData.outletId}
						</p>
						<p className="text-[10px] uppercase font-bold tracking-widest mt-1">
							{receiptData.date}
						</p>
					</div>

					<div className="space-y-1 mb-6 text-[10px] tabular-nums">
						<div className="flex justify-between">
							<span>NO. ORDER</span>
							<span className="font-bold">{receiptData.orderNumber}</span>
						</div>
						<div className="flex justify-between">
							<span>PELANGGAN</span>
							<span className="font-bold uppercase">
								{receiptData.customerName}
							</span>
						</div>
						<div className="flex justify-between">
							<span>KASIR</span>
							<span className="font-bold uppercase">
								{receiptData.cashierName}
							</span>
						</div>
						<div className="flex justify-between">
							<span>METODE</span>
							<span className="font-bold uppercase">
								{receiptData.paymentMethod}
							</span>
						</div>
					</div>

					<div className="border-t border-dashed border-slate-300 pt-4 mb-4">
						<p className="text-[10px] font-black mb-3 text-center tracking-widest uppercase bg-slate-50 py-1">
							--- RINCIAN PESANAN ---
						</p>
						{receiptData.items.map((item: CartItem) => (
							<div
								key={item.id}
								className="text-[10px] mb-4 flex flex-col items-start border-b border-slate-50 pb-2"
							>
								<div className="w-full flex justify-between items-start mb-1">
									<p className="font-bold flex-1 uppercase">{item.name}</p>
									<p className="font-bold text-right ml-2">
										{formatIDR(item.qty * item.price)}
									</p>
								</div>
								<div className="flex justify-between w-full text-slate-500">
									<span>
										{item.qty} {item.unit} x {formatIDR(item.price)}
									</span>
								</div>
								{item.notes && (
									<div className="mt-2 w-full bg-slate-50 p-2 rounded-sm border border-slate-100 italic text-[9px]">
										<span className="font-bold not-italic mr-1 text-slate-400">
											DETAIL:
										</span>{" "}
										{item.notes}
									</div>
								)}
							</div>
						))}
					</div>

					<div className="border-t border-b border-dashed border-slate-300 py-3 mb-6">
						<div className="flex justify-between items-center text-sm font-bold">
							<p>TOTAL</p>
							<p>{formatIDR(receiptData.total)}</p>
						</div>
					</div>

					<div className="flex flex-col items-center justify-center text-center space-y-3 pb-8">
						{trackingUrl && (
							<div className="p-2 bg-white rounded-xl">
								<QRCodeSVG value={trackingUrl} size={100} level="L" />
							</div>
						)}
						<div className="text-[10px]">
							<p className="font-bold">SCAN UNTUK LACAK ORDER</p>
							<p className="text-slate-500 mt-1">mahiralaundry.com/lacak</p>
						</div>
						<p className="text-xs font-bold mt-4">Terima Kasih!</p>
						<p className="text-[10px] text-slate-500 italic">
							Cucian Bersih, Hidup Nyaman.
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
				<Button
					type="button"
					variant="secondary"
					onClick={onNewOrder}
					className="rounded-2xl font-bold"
				>
					+ Order Baru
				</Button>
				<Button
					type="button"
					onClick={handlePrintReceipt}
					className="rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20"
				>
					<Receipt className="w-5 h-5 mr-2" /> Cetak Langsung
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={handleDownloadPNG}
					className="rounded-2xl font-bold"
				>
					🖼️ PNG
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={handleDownloadPDF}
					className="rounded-2xl font-bold"
				>
					📄 PDF
				</Button>
			</div>
		</div>
	);
}
