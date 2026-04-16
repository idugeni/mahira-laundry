"use client";

import { format, isSameMonth } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	HiOutlineCheckCircle,
	HiOutlineChevronRight,
	HiOutlineClock,
	HiOutlineCreditCard,
	HiOutlineInbox,
	HiOutlineListBullet,
	HiOutlineMagnifyingGlass,
	HiOutlinePlus,
	HiOutlineSquares2X2,
	HiOutlineTrash,
	HiOutlineXCircle,
} from "react-icons/hi2";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteOrder } from "@/lib/actions/orders";
import { formatIDR } from "@/lib/utils";

interface Order {
	id: string;
	order_number: string;
	status: string;
	total: number;
	created_at: string;
	order_items: { service_name: string; quantity: number }[];
}

interface OrderListClientProps {
	orders: Order[];
}

const statusMap: Record<
	string,
	{ label: string; color: string; icon: React.ReactNode }
> = {
	pending: {
		label: "Menunggu",
		color: "bg-amber-50 text-amber-600 border-amber-100",
		icon: <HiOutlineClock />,
	},
	confirmed: {
		label: "Dikonfirmasi",
		color: "bg-blue-50 text-blue-600 border-blue-100",
		icon: <HiOutlineCheckCircle />,
	},
	washing: {
		label: "Dicuci",
		color: "bg-indigo-50 text-indigo-600 border-indigo-100",
		icon: <HiOutlineCheckCircle />,
	},
	ironing: {
		label: "Disetrika",
		color: "bg-purple-50 text-purple-600 border-purple-100",
		icon: <HiOutlineCheckCircle />,
	},
	ready: {
		label: "Siap Ambil",
		color: "bg-emerald-50 text-emerald-600 border-emerald-100",
		icon: <HiOutlineCheckCircle />,
	},
	completed: {
		label: "Selesai",
		color: "bg-slate-50 text-slate-400 border-slate-100",
		icon: <HiOutlineCheckCircle />,
	},
	cancelled: {
		label: "Batal",
		color: "bg-red-50 text-red-600 border-red-100",
		icon: <HiOutlineXCircle />,
	},
};

export function OrderListClient({ orders }: OrderListClientProps) {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("Semua");
	const [viewMode, setViewMode] = useState<"list" | "grid">("list");

	const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const matchesSearch = order.order_number
				.toLowerCase()
				.includes(search.toLowerCase());
			const isActive = !["completed", "cancelled"].includes(order.status);

			let matchesFilter = true;
			if (filter === "Aktif") matchesFilter = isActive;
			if (filter === "Selesai") matchesFilter = order.status === "completed";
			if (filter === "Batal") matchesFilter = order.status === "cancelled";

			return matchesSearch && matchesFilter;
		});
	}, [orders, search, filter]);

	const stats = useMemo(() => {
		const activeCount = orders.filter(
			(o) => !["completed", "cancelled"].includes(o.status),
		).length;
		const monthlyTotal = orders
			.filter(
				(o) =>
					isSameMonth(new Date(o.created_at), new Date()) &&
					o.status !== "cancelled",
			)
			.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
		return { activeCount, monthlyTotal };
	}, [orders]);

	const handleDelete = async () => {
		if (!orderIdToDelete) return;
		setIsDeleting(true);

		try {
			const res = await deleteOrder(orderIdToDelete);
			if (res.error) {
				toast.error(`Gagal menghapus: ${res.error}`);
			} else {
				toast.success("Pesanan berhasil dihapus.");
			}
		} catch (_err) {
			toast.error("Terjadi kesalahan sistem.");
		} finally {
			setIsDeleting(false);
			setOrderIdToDelete(null);
		}
	};

	return (
		<div className="space-y-10 pb-20">
			<AlertDialog
				open={!!orderIdToDelete}
				onOpenChange={(open: boolean) => !open && setOrderIdToDelete(null)}
			>
				<AlertDialogContent className="rounded-[2.5rem] border-slate-100 p-8">
					<AlertDialogHeader>
						<div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 mx-auto sm:mx-0 shadow-inner">
							<HiOutlineTrash />
						</div>
						<AlertDialogTitle className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Hapus Pesanan?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-500 font-medium text-base">
							Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini{" "}
							<span className="text-red-600 font-bold underline decoration-2 underline-offset-4">
								tidak dapat dibatalkan
							</span>{" "}
							dan data pesanan akan hilang secara permanen.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
						<AlertDialogCancel className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-slate-100 hover:bg-slate-50 active:scale-95 transition-all">
							Batal
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								handleDelete();
							}}
							disabled={isDeleting}
							className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600 shadow-xl shadow-red-100 active:scale-95 transition-all"
						>
							{isDeleting ? "Menghapus..." : "Ya, Hapus Sekarang"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{/* Header & Quick Stats */}
			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 w-full">
				<div>
					<h1 className="text-4xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
						Daftar{" "}
						<span className="inline-block text-brand-gradient">Pesanan</span>
					</h1>
					<p className="text-slate-500 mt-2 font-medium">
						Kelola dan pantau seluruh cucian Anda di satu tempat.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto lg:min-w-[600px]">
					<div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 w-full">
						<div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xl shrink-0">
							<HiOutlineInbox />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								Aktif
							</p>
							<p className="text-xl font-black text-slate-900 leading-none">
								{stats.activeCount}
							</p>
						</div>
					</div>

					<div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 w-full">
						<div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl shrink-0">
							<HiOutlineCreditCard />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								Bulan Ini
							</p>
							<p className="text-xl font-black text-slate-900 leading-none">
								{formatIDR(stats.monthlyTotal)}
							</p>
						</div>
					</div>

					<Link
						href="/customer/order/baru"
						className="px-8 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-4 active:scale-95 group w-full"
					>
						<span className="w-5 h-5 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
							<HiOutlinePlus />
						</span>
						Buat Baruu
					</Link>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex flex-col lg:flex-row gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">
				<div className="flex-1 relative group">
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors text-xl">
						<HiOutlineMagnifyingGlass />
					</span>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Cari Nomor Pesanan..."
						className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 focus:bg-white border-transparent focus:border-brand-primary/20 outline-none transition-all font-bold text-sm text-slate-900"
					/>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
						{["Semua", "Aktif", "Selesai", "Batal"].map((f) => (
							<button
								key={f}
								type="button"
								onClick={() => setFilter(f)}
								className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
									filter === f
										? "bg-white text-slate-900 shadow-sm"
										: "text-slate-400 hover:text-slate-600"
								}`}
							>
								{f}
							</button>
						))}
					</div>

					<div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

					<div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
						<button
							type="button"
							onClick={() => setViewMode("list")}
							className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"}`}
						>
							<span className="text-xl flex items-center justify-center">
								<HiOutlineListBullet />
							</span>
						</button>
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"}`}
						>
							<span className="text-xl flex items-center justify-center">
								<HiOutlineSquares2X2 />
							</span>
						</button>
					</div>
				</div>
			</div>

			{/* List / Grid */}
			<AnimatePresence mode="popLayout">
				{filteredOrders.length > 0 ? (
					<motion.div
						layout
						className={
							viewMode === "grid"
								? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
								: "flex flex-col gap-4"
						}
					>
						{filteredOrders.map((order) => (
							<motion.div
								key={order.id}
								layout
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group overflow-hidden p-6 sm:p-8"
							>
								<div
									className={`flex ${viewMode === "list" ? "flex-col sm:flex-row items-center justify-between" : "flex-col"} gap-6`}
								>
									<div className="flex items-center gap-6 w-full">
										<div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-lg shadow-slate-200">
											<span className="text-[10px] font-black uppercase tracking-tighter opacity-40">
												{format(new Date(order.created_at), "MMM")}
											</span>
											<span className="text-lg font-black leading-none">
												{format(new Date(order.created_at), "dd")}
											</span>
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex items-center flex-wrap gap-2">
												<span className="font-black text-slate-900 text-lg uppercase tracking-tight truncate">
													{order.order_number}
												</span>
												<div
													className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusMap[order.status]?.color || "bg-slate-50 text-slate-400"}`}
												>
													<span className="w-3 h-3 flex items-center justify-center">
														{statusMap[order.status]?.icon}
													</span>
													{statusMap[order.status]?.label || order.status}
												</div>
											</div>
											<div className="flex items-center gap-3 mt-1">
												<p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
													{order.order_items.length} Item •{" "}
													<span className="text-slate-900">
														{formatIDR(order.total)}
													</span>
												</p>
											</div>
										</div>
									</div>

									<div
										className={`flex items-center gap-3 ${viewMode === "grid" ? "mt-4 w-full" : "w-full sm:w-auto"}`}
									>
										{order.status === "pending" && (
											<button
												type="button"
												onClick={() => setOrderIdToDelete(order.id)}
												className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
												title="Hapus Pesanan"
											>
												<span className="text-xl flex items-center justify-center">
													<HiOutlineTrash />
												</span>
											</button>
										)}
										<Link
											href={`/customer/order/${order.id}`}
											className="flex-1 flex items-center justify-between gap-4 px-6 py-4 bg-slate-50 rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-all transition-duration-300"
										>
											<span className="text-[10px] font-black uppercase tracking-widest leading-none">
												Detail Pesanan
											</span>
											<span className="text-xl flex items-center justify-center">
												<HiOutlineChevronRight />
											</span>
										</Link>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-[3rem] border border-slate-100 p-24 shadow-sm text-center"
					>
						<div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-200">
							<span className="text-4xl flex items-center justify-center">
								<HiOutlineInbox />
							</span>
						</div>
						<h3 className="text-2xl font-black text-slate-900 mb-2">
							Tidak ditemukan
						</h3>
						<p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">
							Coba sesuaikan kata kunci pencarian atau filter status Anda.
						</p>
						<button
							type="button"
							onClick={() => {
								setSearch("");
								setFilter("Semua");
							}}
							className="text-brand-primary font-black uppercase tracking-widest text-xs hover:underline"
						>
							Reset Filter
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
