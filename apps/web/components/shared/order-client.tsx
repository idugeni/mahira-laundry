"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	HiOutlineChatBubbleOvalLeftEllipsis,
	HiOutlineCheckCircle,
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
	HiOutlineInformationCircle,
	HiOutlineMapPin,
	HiOutlineShoppingBag,
	HiOutlineSparkles,
} from "react-icons/hi2";
import {
	MdOutlineDryCleaning,
	MdOutlineFlashOn,
	MdOutlineIron,
	MdOutlineLocalLaundryService,
} from "react-icons/md";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createOrder } from "@/lib/actions/orders";
import { PRIMARY_OUTLET } from "@/lib/constants";
import { formatIDR } from "@/lib/utils";

const steps = [
	{ name: "Layanan", icon: HiOutlineSparkles },
	{ name: "Detail", icon: HiOutlineMapPin },
	{ name: "Konfirmasi", icon: HiOutlineCheckCircle },
];

interface OrderClientProps {
	initialOutlets: { id: string; name: string; address?: string }[];
	initialServices: {
		id: string;
		name: string;
		price: number;
		unit: string;
		description?: string;
	}[];
	user: { id: string; email?: string } | null;
}

export function OrderClient({
	initialOutlets,
	initialServices,
	user,
}: OrderClientProps) {
	const router = useRouter();
	const [orderMode, setOrderMode] = useState<"form" | "whatsapp" | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedOutlet, _setSelectedOutlet] = useState<string | null>(
		initialOutlets[0]?.id || null,
	);
	const [quantities, setQuantities] = useState<Record<string, number>>({});
	const [pickupAddress, setPickupAddress] = useState("");
	const [pickupDate, setPickupDate] = useState("");
	const [pickupTime, setPickupTime] = useState("08:00 - 12:00");
	const [loading, setLoading] = useState(false);

	const handleNext = () =>
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
	const handleBack = () => {
		if (currentStep === 0) {
			setOrderMode(null);
		} else {
			setCurrentStep((prev) => Math.max(prev - 1, 0));
		}
	};

	const updateQuantity = (id: string, delta: number) => {
		setQuantities((prev) => {
			const current = prev[id] || 0;
			const newVal = parseFloat((current + delta).toFixed(2));
			return { ...prev, [id]: Math.max(newVal, 0) };
		});
	};

	const calculateTotal = () => {
		let subtotal = 0;
		initialServices.forEach((s) => {
			subtotal += (quantities[s.id] || 0) * s.price;
		});
		return subtotal;
	};

	const getServiceIcon = (name: string) => {
		if (name.toLowerCase().includes("setrika")) return MdOutlineIron;
		if (name.toLowerCase().includes("express")) return MdOutlineFlashOn;
		if (name.toLowerCase().includes("dry")) return MdOutlineDryCleaning;
		return MdOutlineLocalLaundryService;
	};

	const handleSubmit = async () => {
		if (!selectedOutlet || !pickupAddress || !pickupDate) {
			toast.error("Mohon lengkapi semua data");
			return;
		}
		setLoading(true);
		try {
			const orderItems = initialServices
				.filter((s) => (quantities[s.id] || 0) > 0)
				.map((s) => ({
					service_id: s.id,
					service_name: s.name,
					quantity: quantities[s.id],
					unit: s.unit,
					unit_price: s.price,
					is_express: s.name.toLowerCase().includes("express"),
				}));

			const formData = new FormData();
			formData.append("outlet_id", selectedOutlet);
			formData.append("pickup_address", pickupAddress);
			formData.append("delivery_address", pickupAddress);
			formData.append("delivery_type", "both");
			formData.append("notes", `Pickup at ${pickupDate} ${pickupTime}`);
			formData.append("items", JSON.stringify(orderItems));

			const result = await createOrder(formData);
			if (result.success && result.data) {
				toast.success("Order berhasil dibuat!");
				router.push(`/order/${result.data.id}`);
			} else {
				toast.error(result.error || "Gagal membuat order");
			}
		} catch (_error) {
			toast.error("Terjadi kesalahan sistem");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto py-8">
			{/* Header UI */}
			<div className="mb-10 text-center px-4">
				<h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
					{orderMode === null
						? "Buat Pesanan Baru"
						: orderMode === "whatsapp"
							? "Pesan Cepat via WA"
							: `Langkah ${currentStep + 1}: ${steps[currentStep].name}`}
				</h1>
				<p className="text-slate-500 font-medium">
					{orderMode === null
						? "Pilih metode pemesanan yang paling nyaman untuk Anda"
						: orderMode === "whatsapp"
							? "Hubungi admin kami untuk pemesanan instan"
							: `Silakan lengkapi detail ${steps[currentStep].name.toLowerCase()} Anda`}
				</p>
			</div>

			<AnimatePresence mode="wait">
				{orderMode === null ? (
					<motion.div
						key="selection"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4"
					>
						{/* Mode Form Mandiri */}
						<button
							onClick={() => setOrderMode("form")}
							className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:border-brand-primary active:scale-95 overflow-hidden"
						>
							<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
								<span className="text-9xl text-brand-primary transition-transform group-hover:rotate-12 block">
									<HiOutlineSparkles />
								</span>
							</div>
							<div className="w-20 h-20 bg-brand-primary/10 rounded-[28px] flex items-center justify-center text-3xl text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-brand-primary/20">
								<HiOutlineShoppingBag />
							</div>
							<h3 className="text-xl font-black text-slate-900 mb-2">
								Pilih Sendiri
							</h3>
							<p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 px-4">
								Pilih layanan, hitung estimasi biaya, dan tentukan jadwal jemput
								secara mandiri melalui form.
							</p>
							<div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest bg-brand-primary/5 px-6 py-2.5 rounded-full group-hover:bg-brand-primary group-hover:text-white transition-all">
								Mulai Form <HiOutlineChevronRight />
							</div>
						</button>

						{/* Mode WhatsApp */}
						<button
							onClick={() => setOrderMode("whatsapp")}
							className="group relative flex flex-col items-center text-center p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:border-emerald-500 active:scale-95 overflow-hidden"
						>
							<div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
								<span className="text-9xl text-emerald-500 transition-transform group-hover:rotate-12 block">
									<HiOutlineChatBubbleOvalLeftEllipsis />
								</span>
							</div>
							<div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center text-3xl text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-emerald-500/20">
								<HiOutlineChatBubbleOvalLeftEllipsis />
							</div>
							<h3 className="text-xl font-black text-slate-900 mb-2">
								Pesan via WA
							</h3>
							<p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 px-4">
								Malas isi form? Chat admin kami sekarang, kami akan bantu
								buatkan pesanan untuk Anda.
							</p>
							<div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-6 py-2.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
								Chat Admin <HiOutlineChevronRight />
							</div>
						</button>
					</motion.div>
				) : orderMode === "whatsapp" ? (
					<motion.div
						key="whatsapp"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="max-w-md mx-auto px-4"
					>
						<div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl text-center">
							<div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl text-emerald-500 mx-auto mb-8 shadow-inner">
								<HiOutlineChatBubbleOvalLeftEllipsis />
							</div>
							<h2 className="text-2xl font-black text-slate-900 mb-4">
								Siap Membantu!
							</h2>
							<p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
								Tim kami akan membantu Anda menjadwalkan penjemputan dan
								pencucian melalui obrolan WhatsApp.
							</p>

							<div className="space-y-4">
								<a
									href={`https://api.whatsapp.com/send?phone=${PRIMARY_OUTLET.whatsapp}&text=Halo%20Mahira%20Laundry,%20saya%20ingin%20laundry%20cepat...`}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg"
								>
									Buka WhatsApp <HiOutlineChevronRight />
								</a>
								<button
									onClick={() => setOrderMode(null)}
									className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
								>
									Kembali ke Pilihan
								</button>
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="form"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="space-y-12"
					>
						{/* Progress Bar */}
						<div className="max-w-2xl mx-auto px-4 mb-16">
							<div className="flex items-center justify-between relative">
								<div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />
								{steps.map((step, i) => (
									<div
										key={step.name}
										className="relative z-10 flex flex-col items-center"
									>
										<div
											className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-slate-50 transition-all duration-500 ${
												i <= currentStep
													? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30"
													: "bg-white text-slate-300"
											}`}
										>
											<span className="text-xl px-2">
												<step.icon />
											</span>
										</div>
										<span
											className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${
												i <= currentStep
													? "text-brand-primary"
													: "text-slate-300"
											}`}
										>
											{step.name}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Multi-step Content */}
						<div className="min-h-[400px] px-4">
							<AnimatePresence mode="wait">
								{currentStep === 0 && (
									<motion.div
										key="s2"
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -10 }}
										className="space-y-6"
									>
										{initialServices.map((service) => {
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
																	onClick={() => updateQuantity(service.id, -1)}
																	className="w-10 h-10 bg-white rounded-xl shadow-sm text-slate-400 hover:text-brand-primary flex items-center justify-center transition-all active:scale-90"
																>
																	<HiOutlineChevronLeft />
																</button>
																<input
																	type="number"
																	step="0.1"
																	value={quantities[service.id] || 0}
																	onChange={(e) =>
																		updateQuantity(
																			service.id,
																			parseFloat(e.target.value) -
																				(quantities[service.id] || 0),
																		)
																	}
																	className="w-12 text-center font-black text-lg bg-transparent text-slate-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
																/>
																<button
																	onClick={() => updateQuantity(service.id, 1)}
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
																		onClick={() =>
																			setQuantities((p) => ({
																				...p,
																				[service.id]: k,
																			}))
																		}
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
												onClick={handleNext}
												disabled={calculateTotal() === 0}
												className="px-12 py-5 bg-brand-primary text-white rounded-[24px] font-black shadow-2xl shadow-brand-primary/20 flex items-center gap-3 transition-all hover:scale-105 disabled:opacity-50"
											>
												Konfirmasi Layanan <HiOutlineChevronRight />
											</button>
										</div>
									</motion.div>
								)}

								{currentStep === 1 && (
									<motion.div
										key="s3"
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -10 }}
										className="max-w-xl mx-auto space-y-8"
									>
										<div className="space-y-6">
											<div className="space-y-3">
												<label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2 italic">
													Alamat Penjemputan
												</label>
												<textarea
													value={pickupAddress}
													onChange={(e) => setPickupAddress(e.target.value)}
													rows={3}
													placeholder="Masukkan alamat lengkap..."
													className="w-full p-6 bg-white border border-slate-100 rounded-[30px] font-medium outline-none focus:border-brand-primary/30 transition-all shadow-sm"
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-3">
													<label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] italic">
														Tanggal
													</label>
													<input
														type="date"
														value={pickupDate}
														onChange={(e) => setPickupDate(e.target.value)}
														className="w-full p-6 bg-white border border-slate-100 rounded-[30px] font-medium outline-none focus:border-brand-primary/30 transition-all shadow-sm"
													/>
												</div>
												<div className="space-y-3">
													<label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] italic">
														Waktu
													</label>
													<Select
														value={pickupTime}
														onValueChange={setPickupTime}
													>
														<SelectTrigger className="w-full h-[68px] px-6 bg-white border border-slate-100 rounded-[30px] font-bold outline-none focus:ring-brand-primary/20 transition-all shadow-sm">
															<SelectValue placeholder="Pilih Waktu" />
														</SelectTrigger>
														<SelectContent className="rounded-3xl border-slate-100 shadow-2xl">
															<SelectItem
																value="08:00 - 12:00"
																className="py-4 font-bold rounded-2xl"
															>
																08:00 - 12:00
															</SelectItem>
															<SelectItem
																value="12:00 - 16:00"
																className="py-4 font-bold rounded-2xl"
															>
																12:00 - 16:00
															</SelectItem>
															<SelectItem
																value="16:00 - 20:00"
																className="py-4 font-bold rounded-2xl"
															>
																16:00 - 20:00
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
										<button
											onClick={handleNext}
											disabled={!pickupAddress || !pickupDate}
											className="w-full py-6 bg-brand-primary text-white rounded-[32px] font-black text-xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50"
										>
											Lanjutkan ke Konfirmasi
										</button>
									</motion.div>
								)}

								{currentStep === 2 && (
									<motion.div
										key="s4"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										className="max-w-2xl mx-auto space-y-8"
									>
										<div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
											<div className="absolute top-0 right-0 p-8 text-white/5 text-9xl">
												<HiOutlineCheckCircle />
											</div>
											<div className="relative z-10 space-y-6">
												<div className="flex justify-between items-center pb-6 border-b border-white/10">
													<span className="text-white/40 text-xs font-bold uppercase tracking-widest">
														Outlet
													</span>
													<span className="font-black text-brand-accent">
														{
															initialOutlets.find(
																(o) => o.id === selectedOutlet,
															)?.name
														}
													</span>
												</div>
												<div className="space-y-4">
													{initialServices.map(
														(s) =>
															(quantities[s.id] || 0) > 0 && (
																<div
																	key={s.id}
																	className="flex justify-between items-center text-sm"
																>
																	<span className="text-white/60">
																		{s.name} ({quantities[s.id]} {s.unit})
																	</span>
																	<span className="font-bold">
																		{formatIDR(
																			(quantities[s.id] || 0) * s.price,
																		)}
																	</span>
																</div>
															),
													)}
												</div>
												<div className="flex justify-between items-end pt-8">
													<div>
														<p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">
															Total Estimasi
														</p>
														<p className="text-3xl font-black text-brand-accent">
															{formatIDR(calculateTotal())}
														</p>
													</div>
													<span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full uppercase tracking-widest">
														Sangat Hemat
													</span>
												</div>
											</div>
										</div>
										<div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
											<span className="text-2xl text-amber-500 shrink-0">
												<HiOutlineInformationCircle />
											</span>
											<p className="text-xs text-amber-900 font-medium leading-relaxed">
												<b>Penting:</b> Berat pasti dan total tagihan akan
												ditentukan setelah penimbangan fisik di outlet. Anda
												akan menerima notifikasi tagihan final segera setelah
												proses tuntas.
											</p>
										</div>
										<button
											onClick={handleSubmit}
											disabled={loading}
											className="w-full py-6 bg-brand-primary text-white rounded-[32px] font-black text-xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
										>
											{loading ? "Menyimpan Pesanan..." : "Konfirmasi & Bayar"}
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Back Button */}
						<div className="flex justify-start px-4 max-w-2xl mx-auto">
							<button
								onClick={handleBack}
								disabled={loading}
								className="flex items-center gap-2 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase tracking-[2px] text-xs disabled:opacity-50"
							>
								<HiOutlineChevronLeft /> Kembali
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
