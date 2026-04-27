"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	HiOutlineCheckCircle,
	HiOutlineChevronLeft,
	HiOutlineMapPin,
	HiOutlineSparkles,
} from "react-icons/hi2";
import { toast } from "sonner";
import { OrderConfirmStep } from "@/components/shared/customer/order/order-confirm-step";
import { OrderDetailStep } from "@/components/shared/customer/order/order-detail-step";
import { OrderModeSelector } from "@/components/shared/customer/order/order-mode-selector";
import { OrderServiceStep } from "@/components/shared/customer/order/order-service-step";
import { OrderWhatsappPanel } from "@/components/shared/customer/order/order-whatsapp-panel";
import { createOrder } from "@/lib/actions/orders";

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
	user: _user,
}: OrderClientProps) {
	const router = useRouter();
	const [orderMode, setOrderMode] = useState<"form" | "whatsapp" | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedOutlet] = useState<string | null>(
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

	const setQuantityDirect = (id: string, value: number) => {
		setQuantities((prev) => ({ ...prev, [id]: value }));
	};

	const calculateTotal = () => {
		let subtotal = 0;
		initialServices.forEach((s) => {
			subtotal += (quantities[s.id] || 0) * s.price;
		});
		return subtotal;
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
					<OrderModeSelector
						onSelectForm={() => setOrderMode("form")}
						onSelectWhatsapp={() => setOrderMode("whatsapp")}
					/>
				) : orderMode === "whatsapp" ? (
					<OrderWhatsappPanel onBack={() => setOrderMode(null)} />
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
							{currentStep === 0 && (
								<OrderServiceStep
									services={initialServices}
									quantities={quantities}
									onUpdateQuantity={updateQuantity}
									onSetQuantity={setQuantityDirect}
									onNext={handleNext}
									calculateTotal={calculateTotal}
								/>
							)}
							{currentStep === 1 && (
								<OrderDetailStep
									pickupAddress={pickupAddress}
									pickupDate={pickupDate}
									pickupTime={pickupTime}
									onAddressChange={setPickupAddress}
									onDateChange={setPickupDate}
									onTimeChange={setPickupTime}
									onNext={handleNext}
								/>
							)}
							{currentStep === 2 && (
								<OrderConfirmStep
									services={initialServices}
									outlets={initialOutlets}
									selectedOutlet={selectedOutlet}
									quantities={quantities}
									calculateTotal={calculateTotal}
									loading={loading}
									onSubmit={handleSubmit}
								/>
							)}
						</div>

						{/* Back Button */}
						<div className="flex justify-start px-4 max-w-2xl mx-auto">
							<button
								type="button"
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
