"use client";

import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Edit,
	Eye,
	Hash,
	Layout,
	Package,
	Phone,
	Receipt,
	Search,
	SortAsc,
	SortDesc,
	User,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useOptimistic, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { ActionResponse, Order, OrderStatus } from "@/lib/types";
import { formatDate, formatIDR } from "@/lib/utils";

interface AntrianClientProps {
	initialOrders: Order[];
}

const ITEMS_PER_PAGE = 8;

const allStatuses = [
	{
		id: "all",
		label: "Semua",
		color: "bg-slate-500",
		text: "text-slate-500",
		light: "bg-slate-100",
	},
	{
		id: "pending",
		label: "Pending",
		color: "bg-amber-500",
		text: "text-amber-500",
		light: "bg-amber-50",
	},
	{
		id: "confirmed",
		label: "Konfirmasi",
		color: "bg-orange-500",
		text: "text-orange-500",
		light: "bg-orange-50",
	},
	{
		id: "picked_up",
		label: "Diterima",
		color: "bg-blue-500",
		text: "text-blue-500",
		light: "bg-blue-50",
	},
	{
		id: "washing",
		label: "Cuci",
		color: "bg-cyan-500",
		text: "text-cyan-500",
		light: "bg-cyan-50",
	},
	{
		id: "ironing",
		label: "Setrika",
		color: "bg-purple-500",
		text: "text-purple-500",
		light: "bg-purple-50",
	},
	{
		id: "ready",
		label: "Siap",
		color: "bg-emerald-500",
		text: "text-emerald-500",
		light: "bg-emerald-50",
	},
	{
		id: "completed",
		label: "Selesai",
		color: "bg-slate-500",
		text: "text-slate-500",
		light: "bg-slate-100",
	},
	{
		id: "cancelled",
		label: "Batal",
		color: "bg-rose-500",
		text: "text-rose-500",
		light: "bg-rose-50",
	},
];

export function AntrianClient({ initialOrders }: AntrianClientProps) {
	const [activeTab, setActiveTab] = useState("pending");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	// Drag to Scroll State
	const scrollRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeftState] = useState(0);

	const [optimisticOrders, addOptimisticOrder] = useOptimistic(
		initialOrders,
		(state, { id, status }: { id: string; status: OrderStatus }) =>
			state.map((o) => (o.id === id ? { ...o, status } : o)),
	);

	// Drag Handlers
	const handleMouseDown = (e: React.MouseEvent) => {
		if (!scrollRef.current) return;
		setIsDragging(true);
		setStartX(e.pageX - scrollRef.current.offsetLeft);
		setScrollLeftState(scrollRef.current.scrollLeft);
	};

	const handleMouseLeave = () => setIsDragging(false);
	const handleMouseUp = () => setIsDragging(false);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !scrollRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - startX) * 2; // scroll speed
		scrollRef.current.scrollLeft = scrollLeft - walk;
	};

	// Filter & Sort Logic
	const filteredOrders = useMemo(() => {
		let result = optimisticOrders;

		if (activeTab !== "all") {
			result = result.filter((o) => o.status === activeTab);
		}

		if (searchTerm) {
			const lowerSearch = searchTerm.toLowerCase();
			result = result.filter(
				(o) =>
					o.order_number?.toLowerCase().includes(lowerSearch) ||
					o.customer?.full_name?.toLowerCase().includes(lowerSearch),
			);
		}

		result.sort((a, b) => {
			const dateA = new Date(a.created_at).getTime();
			const dateB = new Date(b.created_at).getTime();
			return sortBy === "newest" ? dateB - dateA : dateA - dateB;
		});

		return result;
	}, [optimisticOrders, activeTab, searchTerm, sortBy]);

	// Pagination Logic
	const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
	const paginatedOrders = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredOrders, currentPage]);

	const handleStatusChange = async (id: string, status: string) => {
		const newStatus = status as OrderStatus;
		addOptimisticOrder({ id, status: newStatus });
		try {
			const result: ActionResponse = await updateOrderStatus(id, newStatus);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success(`Order #${id.split("-")[0]} diperbarui`);
			}
		} catch (error: unknown) {
			toast.error((error as Error).message || "Gagal memperbarui status");
		}
	};

	const currentStatusInfo =
		allStatuses.find((s) => s.id === activeTab) || allStatuses[0];

	return (
		<div className="max-w-[1400px] mx-auto space-y-12 pb-32 px-4 lg:px-8">
			<style
				dangerouslySetInnerHTML={{
					__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `,
				}}
			/>

			{/* Premium Dashboard Header */}
			<div className="flex flex-col gap-10 pt-6">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
					<div className="space-y-2">
						<h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase font-[family-name:var(--font-heading)] flex items-center gap-4">
							<span
								className={`w-3 h-12 rounded-full ${currentStatusInfo.color} shadow-lg shadow-current/20`}
							/>
							{currentStatusInfo.label} Antrian
						</h2>
						<p className="text-slate-400 font-semibold text-sm tracking-wide">
							Ditemukan{" "}
							<span className="text-slate-900">{filteredOrders.length}</span>{" "}
							pesanan pada kategori ini
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							onClick={() =>
								setSortBy((prev) => (prev === "newest" ? "oldest" : "newest"))
							}
							className="px-6 py-7 h-auto border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-600 group"
						>
							{sortBy === "newest" ? (
								<SortDesc className="w-5 h-5 group-hover:scale-110 transition-transform" />
							) : (
								<SortAsc className="w-5 h-5 group-hover:scale-110 transition-transform" />
							)}
							<span>
								Urutkan: {sortBy === "newest" ? "Terbaru" : "Terlama"}
							</span>
						</Button>
					</div>
				</div>

				{/* Global Toolbar - Search & Tabs */}
				<div className="space-y-6">
					{/* Search Bar */}
					<div className="relative group/search">
						<Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/search:text-brand-primary transition-colors z-10" />
						<Input
							type="text"
							placeholder="Cari nomor order atau identitas pelanggan..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
							className="w-full pl-16 pr-8 py-8 bg-white rounded-3xl border border-slate-100 text-base font-bold shadow-2xl shadow-slate-200/40 transition-all outline-none focus:ring-8 focus:ring-brand-primary/5 focus:border-brand-primary/20"
						/>
					</div>

					{/* Tab Navigation - Horizontal Drag Scroll */}
					<div className="relative group/tabs">
						<div
							ref={scrollRef}
							onMouseDown={handleMouseDown}
							onMouseLeave={handleMouseLeave}
							onMouseUp={handleMouseUp}
							onMouseMove={handleMouseMove}
							className={`flex items-center gap-2 bg-slate-100/50 p-2 rounded-3xl overflow-x-auto scroll-smooth flex-nowrap border border-white shadow-inner-sm custom-scrollbar touch-pan-x cursor-grab active:cursor-grabbing select-none`}
						>
							{allStatuses.map((status) => {
								const count = optimisticOrders.filter((o) =>
									status.id === "all" ? true : o.status === status.id,
								).length;
								return (
									<button
										key={status.id}
										onPointerDown={(e) => e.stopPropagation()} // Allow clicking tabs while keeping drag on container
										onClick={() => {
											setActiveTab(status.id);
											setCurrentPage(1);
										}}
										className={`px-8 py-3.5 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-3 relative shrink-0 ${
											activeTab === status.id
												? "bg-white text-brand-primary shadow-xl shadow-brand-primary/10 scale-105 z-10"
												: "text-slate-400 hover:text-slate-600 hover:bg-white/40"
										}`}
									>
										<span className="uppercase tracking-[0.2em]">
											{status.label}
										</span>
										{count > 0 && (
											<Badge
												variant={
													activeTab === status.id ? "default" : "secondary"
												}
												className={`text-[10px] px-2 py-0 h-5 min-w-[20px] justify-center ${activeTab === status.id ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-500"}`}
											>
												{count}
											</Badge>
										)}
									</button>
								);
							})}
						</div>
						{/* Visual Fade Edges */}
						<div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none rounded-r-3xl" />
					</div>
				</div>
			</div>

			{/* Main Container */}
			<div className="flex flex-col gap-8">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab + searchTerm + sortBy + currentPage}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="grid grid-cols-1 md:grid-cols-2 gap-8"
					>
						{paginatedOrders.length > 0 ? (
							paginatedOrders.map((order) => {
								const colInfo =
									allStatuses.find((s) => s.id === order.status) ||
									allStatuses[0];
								return (
									<motion.div
										key={order.id}
										layout
										className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 relative group flex flex-col h-full"
									>
										<div className="flex justify-between items-start mb-8">
											<div className="flex flex-col gap-2">
												<div className="flex items-center gap-2 text-brand-primary">
													<Hash className="w-4 h-4" />
													<span className="text-sm font-black tracking-widest">
														{order.order_number}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="w-3 h-3 text-slate-300" />
													<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
														{new Intl.DateTimeFormat("id-ID", {
															day: "numeric",
															month: "long",
															year: "numeric",
														}).format(new Date(order.created_at))}
													</span>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<button
													onClick={() => setSelectedOrder(order)}
													className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-all shadow-sm"
													title="Lihat Detail"
												>
													<Eye size={18} />
												</button>
												<span
													className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${colInfo.light} ${colInfo.text}`}
												>
													{colInfo.label}
												</span>

												<Select
													value={order.status}
													onValueChange={(val: string) =>
														handleStatusChange(order.id, val)
													}
												>
													<SelectTrigger className="w-[140px] h-9 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-brand-primary/20">
														<SelectValue placeholder="Status" />
													</SelectTrigger>
													<SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
														{allStatuses
															.filter((s) => s.id !== "all")
															.map((c) => (
																<SelectItem
																	key={c.id}
																	value={c.id}
																	className="text-[10px] font-bold uppercase tracking-widest py-3 focus:bg-brand-primary/5 focus:text-brand-primary"
																>
																	{c.label}
																</SelectItem>
															))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="flex-1 space-y-6">
											<div className="space-y-3">
												<h4 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">
													{order.order_items?.[0]?.service_name ||
														"Layanan Unknown"}
												</h4>
												{(order.order_items?.length ?? 0) > 1 && (
													<div className="flex items-center gap-2 py-1 px-3 bg-brand-primary/5 rounded-full w-fit">
														<Package className="w-3 h-3 text-brand-primary" />
														<span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
															+{order.order_items?.length! - 1} Item Tambahan
														</span>
													</div>
												)}
											</div>

											{order.order_items?.some((item) => item.notes) && (
												<div className="space-y-3">
													{order.order_items
														.filter((item) => item.notes)
														.map((item, idx) => (
															<div
																key={idx}
																className="bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 flex gap-4"
															>
																<div
																	className={`w-1 h-auto rounded-full ${colInfo.color} opacity-30`}
																/>
																<p className="text-[12px] font-bold text-slate-600 leading-relaxed italic">
																	{item.notes}
																</p>
															</div>
														))}
												</div>
											)}
										</div>

										<div className="mt-12 pt-8 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
											<div className="flex items-center gap-4">
												<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg font-black text-slate-500 border border-white shadow-lg">
													{(order as any).customer?.full_name?.charAt(0) || (
														<User className="w-6 h-6" />
													)}
												</div>
												<div className="flex flex-col">
													<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
														Customer
													</span>
													<span className="text-sm font-black text-slate-800 uppercase tracking-wider">
														{(order as any).customer?.full_name || "Guest User"}
													</span>
												</div>
											</div>

											<div className="text-right flex flex-col gap-1">
												<div className="text-2xl font-black text-slate-900">
													{new Intl.NumberFormat("id-ID", {
														style: "currency",
														currency: "IDR",
														maximumFractionDigits: 0,
													}).format(order.total)}
												</div>
												<div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
													Dibuat Jam{" "}
													{new Intl.DateTimeFormat("id-ID", {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})
														.format(new Date(order.created_at))
														.replace(/\./g, ":")}{" "}
													WIB
												</div>
											</div>
										</div>
									</motion.div>
								);
							})
						) : (
							<div className="col-span-full py-32 flex flex-col items-center justify-center gap-6 opacity-40">
								<div className="p-8 bg-slate-50 rounded-full border-4 border-dashed border-slate-100">
									<Layout className="w-16 h-16 text-slate-200" />
								</div>
								<p className="text-sm font-black text-slate-300 uppercase tracking-[0.5em]">
									Tidak menemukan pesanan
								</p>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-3 pt-12">
					<Button
						type="button"
						variant="outline"
						disabled={currentPage === 1}
						onClick={() => setCurrentPage((prev) => prev - 1)}
						className="p-4 h-auto bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						<ChevronLeft className="w-5 h-5" />
					</Button>

					<div className="flex items-center gap-2">
						{Array.from({ length: totalPages }).map((_, i) => (
							<Button
								key={`page-${i + 1}`}
								type="button"
								variant={currentPage === i + 1 ? "default" : "outline"}
								onClick={() => setCurrentPage(i + 1)}
								className={`w-12 h-12 rounded-2xl text-xs font-black transition-all border-slate-100 ${
									currentPage === i + 1
										? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110"
										: "bg-white text-slate-400 hover:text-slate-600"
								}`}
							>
								{i + 1}
							</Button>
						))}
					</div>

					<Button
						type="button"
						variant="outline"
						disabled={currentPage === totalPages}
						onClick={() => setCurrentPage((prev) => prev + 1)}
						className="p-4 h-auto bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
					>
						<ChevronRight className="w-5 h-5" />
					</Button>
				</div>
			)}
			{/* Premium Detailed Order Modal */}
			<Dialog
				open={!!selectedOrder}
				onOpenChange={(open: boolean) => !open && setSelectedOrder(null)}
			>
				<DialogContent className="max-w-2xl p-0 bg-white rounded-[3rem] overflow-hidden border-none shadow-2xl">
					{selectedOrder && (
						<div className="flex flex-col max-h-[90vh]">
							<DialogHeader className="sr-only">
								<DialogTitle>
									Order Detail #{selectedOrder.order_number}
								</DialogTitle>
								<DialogDescription>
									Rincian pesanan pelanggan Mahira Laundry
								</DialogDescription>
							</DialogHeader>

							{/* Visual Modal Header */}
							<div className="p-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 relative overflow-hidden shrink-0">
								<div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

								<div className="relative flex justify-between items-start">
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
												Order Detail
											</span>
											<span className="text-slate-300 font-bold text-sm">
												/
											</span>
											<span className="text-slate-400 font-bold text-sm uppercase tracking-widest italic">
												#{selectedOrder.order_number}
											</span>
										</div>
										<h2 className="text-3xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
											{selectedOrder.customer?.full_name || "Pelanggan Guest"}
										</h2>
									</div>

									<button
										type="button"
										onClick={() => setSelectedOrder(null)}
										className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:rotate-90 transition-all duration-300"
									>
										<X size={20} />
									</button>
								</div>
							</div>

							{/* Modal Content */}
							<div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar text-left">
								{/* Customer Contact Card */}
								<div className="grid grid-cols-2 gap-6">
									<div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
										<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-slate-50">
											<Phone size={20} />
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
												WhatsApp
											</span>
											<span className="text-sm font-bold text-slate-700">
												{selectedOrder.customer?.phone || "—"}
											</span>
										</div>
									</div>
									<div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
										<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-slate-50">
											<Calendar size={20} />
										</div>
										<div className="flex flex-col">
											<span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
												Tanggal Order
											</span>
											<span className="text-sm font-bold text-slate-700">
												{formatDate(selectedOrder.created_at)}
											</span>
										</div>
									</div>
								</div>

								{/* Service Items */}
								<div className="space-y-4">
									<div className="flex items-center justify-between px-1">
										<h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
											Rincian Layanan
										</h3>
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
											<span className="text-[10px] font-black text-brand-primary uppercase tracking-widest italic">
												{selectedOrder.status.replace("_", " ")}
											</span>
										</div>
									</div>

									<div className="space-y-3">
										{selectedOrder.order_items?.map((item) => (
											<div
												key={item.id}
												className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between hover:border-brand-primary/20 transition-all"
											>
												<div className="flex items-center gap-5">
													<div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
														<Package size={20} />
													</div>
													<div className="flex flex-col">
														<span className="text-sm font-black text-slate-800 uppercase tracking-wide">
															{item.services?.name ||
																item.service_name ||
																"Custom Service"}
														</span>
														<span className="text-[10px] font-bold text-slate-400">
															{item.quantity} {item.services?.unit || "kg"}
														</span>
													</div>
												</div>
												<div className="text-right">
													<span className="text-sm font-black text-slate-900">
														{formatIDR((item.unit_price || 0) * item.quantity)}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Additional Notes */}
								{selectedOrder.notes && (
									<div className="space-y-3">
										<h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
											Catatan Tambahan
										</h3>
										<div className="p-6 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-[2rem] text-sm font-bold text-slate-600 leading-relaxed italic">
											"{selectedOrder.notes}"
										</div>
									</div>
								)}
							</div>

							{/* Modal Footer */}
							<div className="p-10 border-t border-slate-50 bg-slate-50/50 flex items-center gap-4 shrink-0">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										toast.info("Fitur Edit Pesanan segera hadir.");
									}}
									className="flex-1 flex items-center justify-center gap-3 h-auto py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all active:scale-[0.98]"
								>
									<Edit size={18} /> Edit Pesanan
								</Button>
								<div className="flex-[1.5] flex items-center justify-between px-8 py-4 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20">
									<div className="flex flex-col">
										<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
											Total Tagihan
										</span>
										<span className="text-lg font-black text-white">
											{formatIDR(selectedOrder.total)}
										</span>
									</div>
									<div
										className={`p-2 rounded-xl bg-white/10 flex items-center justify-center ${selectedOrder.status === "completed" ? "text-emerald-400" : "text-amber-400"}`}
									>
										<Receipt size={24} />
									</div>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
