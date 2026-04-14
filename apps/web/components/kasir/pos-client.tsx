"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
	Banknote,
	ChevronDown,
	ClipboardList,
	CreditCard,
	Info,
	LayoutGrid,
	Package,
	PlusCircle,
	Receipt,
	Scale,
	ShoppingCart,
	Trash2,
	User,
	X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { searchCustomers } from "@/lib/actions/customers";
import { createOrder } from "@/lib/actions/orders";
import type { Profile, Service } from "@/lib/types";
import { cn, formatIDR } from "@/lib/utils";

interface CartItem {
	id: string;
	serviceId: string;
	name: string;
	qty: number;
	price: number;
	unit: string;
	notes: string;
	isManual?: boolean;
}

interface POSClientProps {
	initialServices: Service[];
	outletId: string;
	cashierName?: string;
}

export function POSClient({
	initialServices,
	outletId,
	cashierName,
}: POSClientProps) {
	// Core State
	const [cart, setCart] = useState<CartItem[]>([]);
	const [customerSearch, setCustomerSearch] = useState("");
	const [searchResults, setSearchResults] = useState<Profile[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(
		null,
	);
	const [walkInName, setWalkInName] = useState("");
	const [loading, setLoading] = useState(false);
	const [isSearching, setIsSearching] = useState(false);

	// Manual/Quick Entry State
	const [activeTab, setActiveTab] = useState<"manual" | "grid">("manual");
	const [quickSearch, setQuickSearch] = useState("");
	const [quickQty, setQuickQty] = useState("");
	const [quickNote, setQuickNote] = useState("");
	const [selectedService, setSelectedService] = useState<Service | null>(null);

	// Pure Manual Mode (Ad-hoc services)
	const [isPureManual, setIsPureManual] = useState(false);
	const [manualName, setManualName] = useState("");
	const [manualPrice, setManualPrice] = useState("");
	const [manualUnit, setManualUnit] = useState("kg");

	interface ReceiptData {
		orderId: string;
		orderNumber: string;
		items: CartItem[];
		total: number;
		paymentMethod: string;
		customerName: string;
		cashierName: string;
		date: string;
		outletId: string;
	}

	// Receipt State
	const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
	const receiptRef = useRef<HTMLDivElement>(null);
	const qtyInputRef = useRef<HTMLInputElement>(null);

	const [_isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Filtered services for quick search
	const filteredServices = useMemo(() => {
		if (!quickSearch) return initialServices;
		return initialServices.filter((s) =>
			s.name.toLowerCase().includes(quickSearch.toLowerCase()),
		);
	}, [quickSearch, initialServices]);

	// Debounced customer search
	useEffect(() => {
		const timer = setTimeout(async () => {
			if (customerSearch.length >= 3) {
				setIsSearching(true);
				const result = await searchCustomers(customerSearch);
				if (result.data) {
					setSearchResults(result.data);
				}
				setIsSearching(false);
			} else {
				setSearchResults([]);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [customerSearch]);

	const handleSelectService = (service: Service) => {
		setSelectedService(service);
		setQuickSearch(service.name);
		// Auto focus quantity input
		setTimeout(() => qtyInputRef.current?.focus(), 100);
	};

	const addToCartFromForm = (e: React.FormEvent) => {
		e.preventDefault();

		const qty = parseFloat(quickQty);
		if (Number.isNaN(qty) || qty <= 0) {
			toast.error("Berat / Qty tidak valid");
			qtyInputRef.current?.focus();
			return;
		}

		if (isPureManual) {
			if (!manualName || !manualPrice) {
				toast.error("Lengkapi data layanan manual");
				return;
			}
			const priceNum = parseInt(manualPrice.replace(/\D/g, ""), 10);
			const newItem: CartItem = {
				id: `manual-${Date.now()}`,
				serviceId: "manual",
				name: `${manualName} (Manual)`,
				qty: qty,
				price: priceNum,
				unit: manualUnit,
				notes: quickNote,
				isManual: true,
			};
			setCart((prev) => [...prev, newItem]);
			setManualName("");
			setManualPrice("");
		} else {
			if (!selectedService) {
				toast.error("Pilih layanan terlebih dahulu");
				return;
			}

			const newItem: CartItem = {
				id: `service-${selectedService.id}-${Date.now()}`,
				serviceId: selectedService.id,
				name: selectedService.name,
				qty: qty,
				price: selectedService.price,
				unit: selectedService.unit,
				notes: quickNote,
			};
			setCart((prev) => [...prev, newItem]);
		}

		// Reset form
		setQuickQty("");
		setQuickNote("");
		setQuickSearch("");
		setSelectedService(null);
		toast.success("Item ditambahkan ke keranjang");
	};

	const _updateQty = (id: string, newQty: number) => {
		if (newQty <= 0) return;
		setCart((prev) =>
			prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i)),
		);
	};

	const removeFromCart = (id: string) => {
		setCart((prev) => prev.filter((i) => i.id !== id));
	};

	const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

	const handleCheckout = async (paymentMethod: string) => {
		if (cart.length === 0) {
			toast.error("Keranjang kosong");
			return;
		}

		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("outlet_id", outletId);
			formData.append("pickup_address", "In-Store POS (Direct)");
			formData.append("delivery_address", "In-Store POS (Direct)");
			formData.append("delivery_type", "pickup");

			let finalNotes = `POS Checkout — Method: ${paymentMethod}`;
			if (!selectedCustomer && walkInName.trim() !== "") {
				finalNotes += `\nWalk-in Guest Name: ${walkInName.trim()}`;
			}
			formData.append("notes", finalNotes);

			if (selectedCustomer) {
				formData.append("customer_id", selectedCustomer.id);
			}

			const orderItems = cart.map((item) => ({
				service_id:
					item.serviceId === "manual" ? initialServices[0].id : item.serviceId, // Fallback if manual
				service_name: item.name,
				quantity: item.qty,
				unit: item.unit,
				unit_price: item.price,
				is_express: item.name.toLowerCase().includes("express"),
				notes: item.notes,
			}));

			formData.append("items", JSON.stringify(orderItems));

			const result = await createOrder(formData);

			if (result.success && result.data) {
				toast.success(`Berhasil! Order ID: ${result.data.id.split("-")[0]}`);

				// Show receipt view
				setReceiptData({
					orderId: result.data.id,
					orderNumber:
						result.data.order_number ||
						result.data.id.split("-")[0].toUpperCase(),
					items: [...cart],
					total,
					paymentMethod,
					customerName: selectedCustomer
						? selectedCustomer.full_name
						: walkInName || "Walk-in Guest",
					cashierName: cashierName || "Admin",
					date: `${new Intl.DateTimeFormat("id-ID", {
						day: "numeric",
						month: "long",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					})
						.format(new Date())
						.replace(/\./g, ":")} WIB`,
					outletId: outletId.split("-")[0].toUpperCase(),
				});

				setCart([]);
				setSelectedCustomer(null);
				setCustomerSearch("");
				setWalkInName("");
			} else {
				toast.error(result.error || "Gagal membuat order");
			}
		} catch (_error) {
			toast.error("Terjadi kesalahan sistem");
		} finally {
			setLoading(false);
		}
	};

	const handlePrintReceipt = () => {
		window.print();
	};

	const handleDownloadPNG = async () => {
		if (!receiptRef.current || !receiptData) return;
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
		if (!receiptRef.current || !receiptData) return;
		try {
			const canvas = await html2canvas(receiptRef.current, { scale: 2 });
			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: [80, 200], // Receipt printer format
			});
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			pdf.save(`Struk-${receiptData.orderNumber}.pdf`);
		} catch (_err) {
			toast.error("Gagal export struk PDF");
		}
	};

	if (receiptData) {
		const trackingUrl =
			typeof window !== "undefined"
				? `${window.location.origin}/lacak?id=${receiptData.orderId}`
				: "";

		return (
			<div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-10 space-y-8 animate-in fade-in zoom-in duration-300">
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
						onClick={() => setReceiptData(null)}
						className="flex-1 h-auto py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-3xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
					>
						<PlusCircle className="w-5 h-5" /> ORDER BARU
					</Button>
				</div>

				<div className="relative group">
					{/* Decorative receipt edges */}
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
										<div className="mt-2 w-full bg-slate-50 p-2 rounded border border-slate-100 italic text-[9px]">
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
					<button
						onClick={() => setReceiptData(null)}
						className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
					>
						+ Order Baru
					</button>
					<button
						onClick={handlePrintReceipt}
						className="px-6 py-3 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20 flex items-center gap-2"
					>
						<Receipt className="w-5 h-5" /> Cetak Langsung
					</button>
					<button
						onClick={handleDownloadPNG}
						className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
					>
						🖼️ PNG
					</button>
					<button
						onClick={handleDownloadPDF}
						className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
					>
						📄 PDF
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="grid lg:grid-cols-12 gap-8 print:block">
			{/* Left/Middle: Input Actions (Full Height, No Internal Scroll) */}
			<div className="lg:col-span-8 flex flex-col gap-8 print:hidden">
				{/* Customer Header */}
				<div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
					<div className="relative flex-1 w-full">
						<div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
							<User className="w-5 h-5" />
						</div>
						<input
							type="text"
							placeholder="Cari pelanggan (Nama/Email/Telepon)..."
							value={customerSearch}
							onChange={(e) => {
								setCustomerSearch(e.target.value);
								if (selectedCustomer) setSelectedCustomer(null);
							}}
							className={`w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-200 text-sm focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none ${selectedCustomer ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"}`}
						/>
						{isSearching && (
							<div className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
						)}

						{/* Search Dropdown */}
						{!selectedCustomer && searchResults.length > 0 && (
							<div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-auto py-3 animate-in fade-in slide-in-from-top-2">
								{searchResults.map((c) => (
									<button
										key={c.id}
										onClick={() => {
											setSelectedCustomer(c);
											setCustomerSearch(c.full_name);
											setSearchResults([]);
										}}
										className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
									>
										<div className="text-left">
											<p className="text-sm font-bold text-slate-900">
												{c.full_name}
											</p>
											<p className="text-[10px] text-slate-500 font-mono mt-1">
												{c.phone || c.email}
											</p>
										</div>
										<span className="text-[10px] font-black uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-xl">
											Pilih
										</span>
									</button>
								))}
							</div>
						)}
					</div>

					<div className="w-px h-12 bg-slate-200 hidden md:block" />

					{selectedCustomer ? (
						<div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-2xl animate-in shake-in-1">
							<div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-200">
								<PlusCircle className="w-4 h-4" />
							</div>
							<div className="text-left min-w-[120px]">
								<p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">
									Customer
								</p>
								<p className="text-sm font-black text-emerald-900">
									{selectedCustomer.full_name}
								</p>
							</div>
							<button
								type="button"
								onClick={() => setSelectedCustomer(null)}
								className="p-1.5 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-600"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					) : (
						<div className="relative flex-1 w-full">
							<Input
								type="text"
								placeholder="Walk-in Guest Name..."
								value={walkInName}
								onChange={(e) => setWalkInName(e.target.value)}
								className="h-[58px] px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold"
							/>
						</div>
					)}
				</div>

				{/* Input Form Section */}
				<div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
					<div className="p-3 bg-slate-50/50 border-b border-slate-200 flex gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setActiveTab("manual")}
							className={cn(
								"flex-1 flex items-center justify-center gap-3 h-auto py-4 rounded-[1.25rem] text-xs font-black transition-all",
								activeTab === "manual"
									? "bg-white text-brand-primary shadow-sm border border-slate-200"
									: "text-slate-400 hover:text-brand-primary hover:bg-white/50",
							)}
						>
							<ClipboardList className="w-5 h-5" /> INPUT MANUAL
						</Button>
						<Button
							type="button"
							variant="ghost"
							onClick={() => setActiveTab("grid")}
							className={cn(
								"flex-1 flex items-center justify-center gap-3 h-auto py-4 rounded-[1.25rem] text-xs font-black transition-all",
								activeTab === "grid"
									? "bg-white text-brand-primary shadow-sm border border-slate-200"
									: "text-slate-400 hover:text-brand-primary hover:bg-white/50",
							)}
						>
							<LayoutGrid className="w-5 h-5" /> GRID MENU
						</Button>
					</div>

					<div className="p-8">
						{activeTab === "manual" ? (
							<div className="max-w-4xl mx-auto space-y-8">
								<div className="space-y-8">
									<div className="flex items-center justify-between">
										<h2 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-4">
											<div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shadow-inner">
												<Scale className="w-7 h-7" />
											</div>
											Input Pesanan & Timbangan
										</h2>
										<button
											type="button"
											onClick={() => setIsPureManual(!isPureManual)}
											className={`text-[10px] font-black px-5 py-2.5 rounded-xl border-2 transition-all ${isPureManual ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" : "bg-white border-slate-200 text-slate-500 hover:border-brand-primary hover:text-brand-primary"}`}
										>
											{isPureManual
												? "Layanan Custom Aktif ⚡"
												: "Layanan Custom?"}
										</button>
									</div>

									<form onSubmit={addToCartFromForm} className="space-y-6">
										<div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-200 ring-8 ring-slate-50/30 space-y-6">
											{/* Baris 1: Nama / Search */}
											{isPureManual ? (
												<div className="space-y-3">
													<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
														Nama Layanan Custom
													</label>
													<Input
														required
														type="text"
														placeholder="Cth: Cuci Boneka Besar..."
														value={manualName}
														onChange={(e) => setManualName(e.target.value)}
														className="h-[58px] px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold"
													/>
												</div>
											) : (
												<div className="relative space-y-3">
													<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
														Pilih Layanan / Jenis Barang
													</label>
													<div className="relative">
														<Input
															type="text"
															placeholder="Ketik nama layanan..."
															value={quickSearch}
															onChange={(e) => {
																setQuickSearch(e.target.value);
																if (selectedService) setSelectedService(null);
															}}
															className={cn(
																"h-[58px] px-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold",
																selectedService
																	? "bg-brand-primary/5 border-brand-primary/20"
																	: "bg-white",
															)}
														/>
														{!selectedService && quickSearch.length > 0 && (
															<div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-auto py-3 animate-in fade-in slide-in-from-top-2">
																{filteredServices.map((s) => (
																	<button
																		key={s.id}
																		type="button"
																		onClick={() => handleSelectService(s)}
																		className="w-full px-6 py-4 text-left hover:bg-brand-primary/5 transition-colors flex items-center justify-between group"
																	>
																		<div>
																			<p className="text-sm font-bold group-hover:text-brand-primary transition-colors">
																				{s.name}
																			</p>
																			<p className="text-[10px] text-slate-400 uppercase mt-1">
																				{formatIDR(s.price)} / {s.unit}
																			</p>
																		</div>
																		<ChevronDown className="w-5 h-5 text-slate-300 -rotate-90 group-hover:text-brand-primary transition-colors" />
																	</button>
																))}
															</div>
														)}
													</div>
												</div>
											)}

											{/* Baris 2: Qty, Unit, Price */}
											<div
												className={`grid gap-4 ${isPureManual ? "md:grid-cols-3" : "grid-cols-2"}`}
											>
												<div className="space-y-3">
													<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
														Berat / Qty
													</label>
													<div className="relative">
														<Input
															ref={qtyInputRef}
															required
															type="text"
															inputMode="decimal"
															placeholder="0.00"
															value={quickQty}
															onFocus={(e) =>
																(e.target as HTMLInputElement).select()
															}
															onChange={(e) => {
																const val = e.target.value.replace(",", ".");
																if (val === "" || /^\d*\.?\d*$/.test(val)) {
																	setQuickQty(val);
																}
															}}
															className="h-[58px] px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all font-black text-brand-primary text-xl"
														/>
														<div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black uppercase">
															{isPureManual
																? manualUnit
																: selectedService?.unit || "kg"}
														</div>
													</div>
												</div>

												{isPureManual ? (
													<>
														<div className="space-y-3">
															<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
																Satuan
															</label>
															<Select
																value={manualUnit}
																onValueChange={setManualUnit}
															>
																<SelectTrigger className="w-full h-[58px] px-5 bg-white border border-slate-200 rounded-2xl font-bold">
																	<SelectValue placeholder="Pilih Satuan" />
																</SelectTrigger>
																<SelectContent className="rounded-2xl shadow-2xl">
																	<SelectItem
																		value="kg"
																		className="font-bold py-3"
																	>
																		Kilogram (kg)
																	</SelectItem>
																	<SelectItem
																		value="pcs"
																		className="font-bold py-3"
																	>
																		Pcs / Satuan
																	</SelectItem>
																	<SelectItem
																		value="m2"
																		className="font-bold py-3"
																	>
																		Meter Persegi (m2)
																	</SelectItem>
																	<SelectItem
																		value="pasang"
																		className="font-bold py-3"
																	>
																		Pasang
																	</SelectItem>
																	<SelectItem
																		value="set"
																		className="font-bold py-3"
																	>
																		Set
																	</SelectItem>
																</SelectContent>
															</Select>
														</div>
														<div className="space-y-3">
															<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
																Harga / Unit
															</label>
															<Input
																required
																type="text"
																placeholder="Rp 0"
																value={manualPrice}
																onChange={(e) => {
																	const val = e.target.value.replace(/\D/g, "");
																	setManualPrice(
																		val ? formatIDR(parseInt(val, 10)) : "",
																	);
																}}
																className="h-[58px] px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all font-black text-slate-900"
															/>
														</div>
													</>
												) : (
													<div className="space-y-3">
														<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
															Total Harga Preview
														</label>
														<div className="w-full h-[58px] px-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-end font-black text-xl text-slate-900 shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200">
															{selectedService
																? formatIDR(
																		selectedService.price *
																			parseFloat(quickQty || "0"),
																	)
																: "Rp 0"}
														</div>
													</div>
												)}
											</div>

											<div className="space-y-3">
												<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
													<Info className="w-3 h-3 text-brand-primary" />{" "}
													Rincian Item (Cth: 5 Kemeja, 3 Celana Kain)
												</label>
												<Textarea
													rows={3}
													placeholder="Berikan detail isi laundry untuk mempermudah pengecekan..."
													value={quickNote}
													onChange={(e) => setQuickNote(e.target.value)}
													className="px-6 py-5 rounded-[2rem] border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none text-sm placeholder:italic"
												/>
											</div>
										</div>

										<Button
											type="submit"
											disabled={!isPureManual && !selectedService}
											className="w-full h-auto py-5 bg-brand-gradient text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4 border-none"
										>
											<PlusCircle className="w-7 h-7" /> TAMBAHKAN KE TRANSAKSI
										</Button>
									</form>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
								{initialServices.map((service) => (
									<button
										key={service.id}
										type="button"
										onClick={() => handleSelectService(service)}
										className={`p-6 rounded-[2rem] border transition-all text-left flex flex-col group ${selectedService?.id === service.id ? "border-brand-primary bg-brand-primary/5 ring-8 ring-brand-primary/5 shadow-lg" : "border-slate-100 bg-white hover:border-brand-primary hover:shadow-2xl hover:-translate-y-2"}`}
									>
										<div
											className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm transition-transform group-hover:scale-110 ${selectedService?.id === service.id ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-400"}`}
										>
											{service.icon || "🧺"}
										</div>
										<p className="font-black text-slate-900 text-sm leading-tight mb-2">
											{service.name}
										</p>
										<div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
											<p className="text-brand-primary font-black text-base">
												{formatIDR(service.price)}
											</p>
											<span className="text-[10px] font-black text-slate-300 uppercase italic">
												/{service.unit}
											</span>
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					<div className="p-6 bg-brand-primary/5 border-t border-brand-primary/10 flex gap-6 items-center">
						<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm ring-1 ring-brand-primary/10">
							<Info className="w-7 h-7" />
						</div>
						<p className="text-xs font-medium text-slate-700 leading-relaxed max-w-2xl">
							<span className="font-black text-brand-primary uppercase mr-2 tracking-widest">
								Tips Kasir:
							</span>
							Gunakan tab **Manual** untuk menimbang laundry secara presisi
							hingga satuan gram. Jangan lupa tambahkan rincian barang pada
							kolom catatan untuk transparansi layanan ke pelanggan.
						</p>
					</div>
				</div>
			</div>

			{/* Right: Order Summary (Floating Sticky on Desktop) */}
			<div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
				<div className="bg-white rounded-[2.5rem] flex flex-col shadow-2xl border border-slate-200 overflow-hidden outline outline-4 outline-slate-50">
					<div className="p-8 border-b border-slate-100 bg-slate-50/30">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
								<ShoppingCart className="w-6 h-6 text-brand-primary" /> Rincian
								Order
							</h3>
							<div className="px-4 py-1.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">
								{cart.length} Layanan
							</div>
						</div>

						<div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
							<div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
								<Receipt className="w-5 h-5" />
							</div>
							<div className="flex flex-col">
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
									Lokasi Transaksi
								</p>
								<p className="text-sm font-black text-slate-900">
									{outletId.split("-")[0].toUpperCase()} Terminal
								</p>
							</div>
						</div>
					</div>

					<div className="max-h-[40vh] overflow-y-auto px-8 py-6 space-y-4 custom-scrollbar">
						{cart.length === 0 ? (
							<div className="flex flex-col items-center justify-center text-center py-24 opacity-30">
								<Package className="w-20 h-20 mb-6 text-slate-300" />
								<p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
									Keranjang masih kosong
								</p>
							</div>
						) : (
							cart.map((item) => (
								<div
									key={item.id}
									className="group relative bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100 hover:border-brand-primary/30 hover:bg-white hover:shadow-xl transition-all animate-in slide-in-from-right-4"
								>
									<div className="flex justify-between items-start gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="text-sm font-black text-slate-900 truncate">
													{item.name}
												</p>
												{item.isManual && (
													<Badge
														variant="secondary"
														className="bg-amber-100 text-amber-600 border-amber-200 uppercase font-black text-[8px] px-2 py-0.5"
													>
														Custom
													</Badge>
												)}
											</div>
											<p className="text-xs font-bold text-slate-400">
												{item.qty} {item.unit}{" "}
												<span className="mx-1 opacity-30">|</span>{" "}
												{formatIDR(item.price)}
											</p>
											{item.notes && (
												<div className="mt-4 bg-white/80 p-3 rounded-xl border border-slate-200/50">
													<p className="text-[9px] text-brand-primary font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
														<ClipboardList className="w-3 h-3" /> Catatan Item
													</p>
													<p className="text-[10px] text-slate-500 italic leading-relaxed line-clamp-2">
														{item.notes}
													</p>
												</div>
											)}
										</div>
										<div className="text-right shrink-0">
											<p className="text-sm font-black text-brand-primary">
												{formatIDR(item.qty * item.price)}
											</p>
											<button
												type="button"
												onClick={() => removeFromCart(item.id)}
												className="mt-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>

					<div className="p-8 bg-slate-50 border-t border-slate-200/50 space-y-8">
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
									Total Pembayaran
								</span>
								<span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full uppercase italic">
									Nett Amount
								</span>
							</div>
							<div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-inner">
								<span className="text-sm font-black text-slate-900 uppercase tracking-widest opacity-20">
									Rupiah
								</span>
								<span className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
									{total.toLocaleString("id-ID")}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Button
								type="button"
								onClick={() => handleCheckout("tunai")}
								disabled={loading || cart.length === 0}
								className="h-auto py-6 rounded-[2rem] bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl shadow-emerald-200 flex flex-col items-center gap-3 group border-b-4 border-emerald-800"
							>
								<div className="bg-white/20 p-2.5 rounded-2xl group-hover:scale-110 transition-transform">
									<Banknote className="w-8 h-8 text-white" />
								</div>
								BAYAR TUNAI
							</Button>
							<Button
								type="button"
								onClick={() => handleCheckout("qris")}
								disabled={loading || cart.length === 0}
								className="h-auto py-6 rounded-[2rem] bg-brand-primary text-white font-black text-sm hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-brand-primary/20 flex flex-col items-center gap-3 group border-b-4 border-brand-primary-dark"
							>
								<div className="bg-white/20 p-2.5 rounded-2xl group-hover:scale-110 transition-transform">
									<CreditCard className="w-8 h-8 text-white" />
								</div>
								QRIS / TRANSFER
							</Button>
						</div>

						<button
							type="button"
							onClick={handlePrintReceipt}
							disabled={cart.length === 0}
							className="w-full py-4 border-2 border-slate-200 bg-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30 flex items-center justify-center gap-4"
						>
							<Receipt className="w-4 h-4" /> CETAK DRAFT STRUK (PREVIEW)
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
