"use client";

import Link from "next/link";
import {
	HiOutlineArchiveBox,
	HiOutlineArrowRight,
	HiOutlineBanknotes,
	HiOutlineGift,
	HiOutlineInbox,
	HiOutlineMapPin,
	HiOutlinePencilSquare,
	HiOutlinePlus,
	HiOutlineShoppingBag,
	HiOutlineStar,
} from "react-icons/hi2";

interface DashboardStats {
	totalOrders: number;
	activeOrders: number;
	loyaltyPoints: number;
	loyaltyTier: string;
}

interface DashboardClientProps {
	stats: DashboardStats;
}

export function DashboardClient({ stats: realStats }: DashboardClientProps) {
	const statsDisplay = [
		{
			label: "Order Aktif",
			value: realStats.activeOrders.toString(),
			icon: HiOutlineShoppingBag,
			color: "text-blue-600",
			bg: "bg-blue-50",
			border: "border-blue-100",
		},
		{
			label: "Poin Loyalty",
			value: realStats.loyaltyPoints.toString(),
			icon: HiOutlineStar,
			color: "text-amber-600",
			bg: "bg-amber-50",
			border: "border-amber-100",
		},
		{
			label: "Total Order",
			value: realStats.totalOrders.toString(),
			icon: HiOutlineArchiveBox,
			color: "text-emerald-600",
			bg: "bg-emerald-50",
			border: "border-emerald-100",
		},
		{
			label: "Tier",
			value:
				realStats.loyaltyTier.charAt(0).toUpperCase() +
				realStats.loyaltyTier.slice(1),
			icon: HiOutlineBanknotes,
			color: "text-purple-600",
			bg: "bg-purple-50",
			border: "border-purple-100",
		},
	];

	const actions = [
		{
			href: "/customer/order/baru",
			label: "Order Baru",
			icon: HiOutlinePlus,
			desc: "Buat pesanan",
			color: "bg-brand-primary text-white",
		},
		{
			href: "/customer/order",
			label: "Lacak Order",
			icon: HiOutlineMapPin,
			desc: "Cek status",
			color: "bg-slate-100 text-slate-600",
		},
		{
			href: "/customer/loyalty",
			label: "Tukar Poin",
			icon: HiOutlineGift,
			desc: "Redeem hadiah",
			color: "bg-slate-100 text-slate-600",
		},
		{
			href: "/customer/profil",
			label: "Profil",
			icon: HiOutlinePencilSquare,
			desc: "Ubah data",
			color: "bg-slate-100 text-slate-600",
		},
	];

	return (
		<div className="space-y-8 pb-10">
			<div className="animate-in fade-in slide-in-from-left-4 duration-500">
				<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
					Ringkasan <span className="text-brand-gradient">Akun</span>
				</h1>
				<p className="text-slate-500 mt-2 font-medium">
					Selamat datang kembali! Berikut status terbaru layanan Anda.
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
				{statsDisplay.map((stat, i) => (
					<div
						key={stat.label}
						className={`animate-in fade-in slide-in-from-bottom-4 bg-white rounded-2xl border ${stat.border} p-4 sm:p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow group`}
						style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
					>
						<div
							className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl mb-4 transition-transform group-hover:-translate-y-0.5`}
						>
							<span className="flex items-center justify-center">
								<stat.icon />
							</span>
						</div>
						<div className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							{stat.value}
						</div>
						<div className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
							{stat.label}
						</div>
					</div>
				))}
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-8 shadow-xs overflow-hidden relative">
				<div className="absolute top-0 right-0 p-10 text-[180px] text-slate-50 pointer-events-none -mr-20 -mt-20">
					<HiOutlinePlus />
				</div>
				<h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-8 text-slate-900 relative z-10">
					Aksi Cepat
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 relative z-10">
					{actions.map((action, i) => (
						<div
							key={action.href}
							className="animate-in fade-in zoom-in-95 duration-500"
							style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: "both" }}
						>
							<Link
								href={action.href}
								className="group flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-brand-primary/20 hover:shadow-lg hover:shadow-slate-100 transition-shadow"
							>
								<div
									className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 transition-shadow ${action.color} group-hover:shadow-lg shadow-brand-primary/20`}
								>
									<span className="text-2xl sm:text-3xl flex items-center justify-center">
										<action.icon />
									</span>
								</div>
								<span className="font-black text-slate-900 text-sm sm:text-base">
									{action.label}
								</span>
								<span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
									{action.desc}
								</span>
							</Link>
						</div>
					))}
				</div>
			</div>

			{/* Recent orders */}
			<div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-8 shadow-xs group">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
					<h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
						Order Terbaru
					</h2>
					<Link
						href="/customer/order"
						className="text-xs font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white flex items-center gap-2 px-5 py-2.5 bg-brand-primary/10 rounded-full w-fit transition-all duration-300"
					>
						Lihat semua
						<span className="flex items-center justify-center ml-1">
							<HiOutlineArrowRight />
						</span>
					</Link>
				</div>
				<div className="text-center py-14 sm:py-16 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
					<div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs mb-6 animate-in fade-in duration-700">
						<span className="text-4xl text-slate-100 flex items-center justify-center">
							<HiOutlineInbox />
						</span>
					</div>
					<p className="font-black text-slate-400 text-lg sm:text-xl">
						Belum ada order.
					</p>
					<p className="text-sm font-medium text-slate-400 mt-2 mb-10 max-w-[240px] mx-auto leading-relaxed">
						Mulai nikmati layanan laundry premium pertama Anda hari ini!
					</p>
					<Link
						href="/customer/order/baru"
						className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-5 font-black text-white shadow-lg shadow-slate-200 transition-colors hover:bg-brand-primary"
					>
						Buat Order Pertama
					</Link>
				</div>
			</div>
		</div>
	);
}
