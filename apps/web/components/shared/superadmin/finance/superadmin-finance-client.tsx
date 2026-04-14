"use client";

import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	Banknote,
	BarChart3,
	Building2,
	Calendar,
	CreditCard,
	Download,
	Filter,
	History,
	PieChart as PieChartIcon,
	Receipt,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { ExpenseModal } from "@/components/shared/admin/finance/expense-modal";
import { PaginationControls } from "@/components/shared/common/pagination-controls";
import { StatCard } from "@/components/shared/common/stat-card";
import {
	PaymentPieChart,
	RevenueBarChart,
} from "@/components/shared/superadmin/admin-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCompact, formatDateTime, formatIDR } from "@/lib/utils";

interface FinanceStats {
	totalRevenue: number;
	totalExpenses: number;
	netProfit: number;
	revenueGrowth: string;
	margin: string;
}

interface SuperadminFinanceClientProps {
	stats: FinanceStats;
	revenueData: any[];
	paymentStats: any[];
	recentPaidOrders: any[];
	expenses: any[];
}

export function SuperadminFinanceClient({
	stats,
	revenueData,
	paymentStats,
	recentPaidOrders,
	expenses,
}: SuperadminFinanceClientProps) {
	const [activeTab, setActiveTab] = useState("overview");
	const [expensePage, setExpensePage] = useState(1);
	const [historyPage, setHistoryPage] = useState(1);

	const EXPENSE_PER_PAGE = 8;
	const HISTORY_PER_PAGE = 8;

	const expenseTotalPages = Math.ceil(expenses.length / EXPENSE_PER_PAGE);
	const paginatedExpenses = expenses.slice(
		(expensePage - 1) * EXPENSE_PER_PAGE,
		expensePage * EXPENSE_PER_PAGE,
	);

	const historyTotalPages = Math.ceil(
		recentPaidOrders.length / HISTORY_PER_PAGE,
	);
	const paginatedHistory = recentPaidOrders.slice(
		(historyPage - 1) * HISTORY_PER_PAGE,
		historyPage * HISTORY_PER_PAGE,
	);

	return (
		<div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-none sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 text-white shadow-2xl shadow-slate-900/40 group">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-60" />

				<div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
					<div className="space-y-6">
						<div className="flex items-center gap-3">
							<Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Financial Governance
							</Badge>
							<span className="text-slate-500">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Activity size={14} /> Real-time Cashflow
							</span>
						</div>
						<h1 className="text-4xl lg:text-7xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-none">
							Executive <span className="text-emerald-400 italic">Finance</span>
						</h1>
						<p className="text-slate-400 font-bold text-sm lg:text-lg max-w-2xl leading-relaxed">
							Otoritas keuangan tertinggi Mahira Laundry Group. Monitoring
							profitabilitas, kontrol biaya operasional, dan analisis
							pertumbuhan finansial seluruh cabang.
						</p>
					</div>

					<div className="flex items-center gap-4">
						<ExpenseModal
							outletId="all"
							trigger={
								<Button className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-white rounded-2xl px-12 h-20 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5 flex items-center gap-4">
									<div className="w-10 h-10 rounded-2xl bg-slate-900/5 flex items-center justify-center">
										<Receipt size={24} />
									</div>
									Catat Pengeluaran
								</Button>
							}
						/>
					</div>
				</div>
			</div>

			<Tabs
				defaultValue="overview"
				className="w-full space-y-10"
				onValueChange={setActiveTab}
			>
				<div className="flex flex-wrap items-center justify-between gap-6 px-4 lg:px-0">
					<TabsList className="bg-slate-100 p-1.5 rounded-2xl lg:rounded-[2rem] h-auto flex flex-wrap gap-1.5">
						<TabsTrigger
							value="overview"
							className="rounded-2xl px-8 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<BarChart3 size={16} className="mr-2" /> Overview
						</TabsTrigger>
						<TabsTrigger
							value="cashflow"
							className="rounded-2xl px-8 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<TrendingUp size={16} className="mr-2" /> Cashflow
						</TabsTrigger>
						<TabsTrigger
							value="expenses"
							className="rounded-2xl px-8 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<Wallet size={16} className="mr-2" /> Expenses
						</TabsTrigger>
						<TabsTrigger
							value="history"
							className="rounded-2xl px-8 py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<History size={16} className="mr-2" /> History
						</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2"
						>
							<Calendar size={18} /> April 2026
						</Button>
						<Button className="rounded-2xl h-14 px-8 font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-900/10 transition-all">
							<Download size={18} className="mr-2" /> Export Report
						</Button>
					</div>
				</div>

				<TabsContent
					value="overview"
					className="space-y-10 focus-visible:outline-none"
				>
					{/* KPI Row */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-0 sm:gap-8">
						<div className="group relative bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-b sm:border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
							<div className="flex items-center justify-between mb-8">
								<div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100 transition-transform group-hover:rotate-6">
									<CreditCard size={32} />
								</div>
								<Badge
									className={cn(
										"px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none",
										parseFloat(stats.revenueGrowth) >= 0
											? "bg-emerald-50 text-emerald-600"
											: "bg-rose-50 text-rose-600",
									)}
								>
									{parseFloat(stats.revenueGrowth) >= 0 ? "▲" : "▼"}{" "}
									{Math.abs(parseFloat(stats.revenueGrowth))}%
								</Badge>
							</div>
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
								Total Pendapatan
							</p>
							<h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
								{formatCompact(stats.totalRevenue)}
							</h3>
							<p className="text-xs font-bold text-slate-400">
								{formatIDR(stats.totalRevenue)}
							</p>
						</div>

						<div className="group relative bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-b sm:border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500">
							<div className="flex items-center justify-between mb-8">
								<div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-100 transition-transform group-hover:-rotate-6">
									<Banknote size={32} />
								</div>
								<Badge className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
									Monthly Cost
								</Badge>
							</div>
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
								Biaya Operasional
							</p>
							<h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
								{formatCompact(stats.totalExpenses)}
							</h3>
							<p className="text-xs font-bold text-slate-400">
								{formatIDR(stats.totalExpenses)}
							</p>
						</div>

						<div className="group relative bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-b sm:border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
							<div className="flex items-center justify-between mb-8">
								<div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100 transition-transform group-hover:rotate-6">
									<TrendingUp size={32} />
								</div>
								<Badge className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
									{stats.margin}% Profit Margin
								</Badge>
							</div>
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
								Laba Bersih (Net)
							</p>
							<h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
								{formatCompact(stats.netProfit)}
							</h3>
							<p className="text-xs font-bold text-slate-400">
								{formatIDR(stats.netProfit)}
							</p>
						</div>
					</div>

					<div className="grid lg:grid-cols-5 gap-10">
						{/* Revenue Trend Chart */}
						<div className="lg:col-span-3 bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40">
							<div className="flex items-center justify-between mb-10">
								<div>
									<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
										Tren Pendapatan
									</h2>
									<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
										Snapshot Performa 6 Bulan Terakhir
									</p>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-indigo-500" />
									<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
										Paid Trans.
									</span>
								</div>
							</div>
							<div className="h-72">
								<RevenueBarChart data={revenueData} />
							</div>
						</div>

						{/* Payment Distribution Pie */}
						<div className="lg:col-span-2 bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40">
							<div className="mb-10">
								<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
									Distribusi Bayar
								</h2>
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
									Metode Paling Populer Seluruh Cabang
								</p>
							</div>
							{paymentStats.length > 0 ? (
								<div className="h-72">
									<PaymentPieChart data={paymentStats} />
								</div>
							) : (
								<div className="h-72 flex flex-col items-center justify-center text-slate-300 gap-4">
									<div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
										<CreditCard size={40} />
									</div>
									<p className="text-[10px] font-black uppercase tracking-widest">
										Waiting for data...
									</p>
								</div>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent
					value="expenses"
					className="space-y-10 focus-visible:outline-none"
				>
					<div className="bg-white rounded-none sm:rounded-[3rem] border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
						<div className="p-10 border-b border-slate-50 flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
									Detail Pengeluaran
								</h2>
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
									Audit biaya operasional • {expenses.length} record • Hal{" "}
									{expensePage}/{expenseTotalPages || 1}
								</p>
							</div>
							<Button
								variant="outline"
								className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white shadow-sm flex items-center gap-2"
							>
								<Filter size={16} /> Filter Category
							</Button>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-slate-50/50">
										<th className="px-5 sm:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Deskripsi & Kategori
										</th>
										<th className="px-5 sm:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Unit Cabang
										</th>
										<th className="px-5 sm:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Validator
										</th>
										<th className="px-5 sm:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Waktu Inflow
										</th>
										<th className="px-5 sm:px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
											Nominal
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{paginatedExpenses.map((expense) => (
										<tr
											key={expense.id}
											className="group hover:bg-slate-50/30 transition-colors"
										>
											<td className="px-5 sm:px-10 py-8">
												<div>
													<p className="font-black text-slate-900 uppercase tracking-tight">
														{expense.reason}
													</p>
													<Badge className="mt-2 bg-rose-50 text-rose-600 border-none text-[8px] font-black uppercase tracking-widest px-2 shadow-none">
														{expense.category || "General"}
													</Badge>
												</div>
											</td>
											<td className="px-10 py-8">
												<div className="flex items-center gap-2">
													<Building2 size={16} className="text-slate-300" />
													<p className="text-sm font-bold text-slate-700">
														{expense.outlets?.name || "Global"}
													</p>
												</div>
											</td>
											<td className="px-10 py-8">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px]">
														{expense.profiles?.full_name?.charAt(0)}
													</div>
													<p className="text-xs font-bold text-slate-600">
														{expense.profiles?.full_name}
													</p>
												</div>
											</td>
											<td className="px-10 py-8 text-xs font-bold text-slate-400">
												{formatDateTime(expense.created_at)}
											</td>
											<td className="px-10 py-8 text-right">
												<p className="text-lg font-black text-rose-600">
													-{formatIDR(expense.amount)}
												</p>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="px-10 pb-8">
							<PaginationControls
								currentPage={expensePage}
								totalPages={expenseTotalPages}
								onPageChange={setExpensePage}
								totalItems={expenses.length}
								itemsPerPage={EXPENSE_PER_PAGE}
							/>
						</div>
					</div>
				</TabsContent>

				<TabsContent
					value="history"
					className="space-y-10 focus-visible:outline-none"
				>
					<div className="bg-white rounded-none sm:rounded-[4rem] border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
						<div className="p-10 border-b border-slate-50">
							<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
								Ledger Transaksi Utama
							</h2>
							<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
								{recentPaidOrders.length} transaksi • Hal {historyPage}/
								{historyTotalPages || 1}
							</p>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-slate-50/50">
										<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Order ID
										</th>
										<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Pelanggan
										</th>
										<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
											Verification Status
										</th>
										<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
											Settlement Date
										</th>
										<th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
											Bruto Amount
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{paginatedHistory.map((order) => (
										<tr
											key={order.id}
											className="group hover:bg-slate-50/30 transition-colors"
										>
											<td className="px-10 py-8 font-mono text-xs font-black text-indigo-600 group-hover:scale-105 transition-transform">
												#{order.order_number}
											</td>
											<td className="px-10 py-8">
												<p className="text-sm font-black text-slate-900 uppercase tracking-tight">
													{Array.isArray(order.profiles)
														? order.profiles[0]?.full_name || "—"
														: order.profiles?.full_name || "—"}
												</p>
											</td>
											<td className="px-10 py-8">
												<Badge
													className={cn(
														"px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none shadow-none",
														order.payment_status === "paid"
															? "bg-emerald-50 text-emerald-600"
															: "bg-amber-50 text-amber-600",
													)}
												>
													{order.payment_status === "paid"
														? "✓ Validated & Settled"
														: "⏳ Pending Proc."}
												</Badge>
											</td>
											<td className="px-10 py-8 text-right text-xs font-bold text-slate-400">
												{formatDateTime(order.created_at)}
											</td>
											<td className="px-10 py-8 text-right font-black text-slate-900 text-lg">
												{formatIDR(order.total)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="px-10 pb-8">
							<PaginationControls
								currentPage={historyPage}
								totalPages={historyTotalPages}
								onPageChange={setHistoryPage}
								totalItems={recentPaidOrders.length}
								itemsPerPage={HISTORY_PER_PAGE}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			{/* Reconciliation Notice */}
			<div className="bg-slate-50 rounded-[3rem] p-10 lg:p-14 border border-slate-100 flex flex-col lg:flex-row items-center gap-10 group hover:bg-white hover:border-indigo-100 transition-all duration-500">
				<div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl border border-slate-50 group-hover:rotate-12 transition-transform duration-500">
					🏦
				</div>
				<div className="flex-1 text-center lg:text-left">
					<h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
						Rekonsiliasi Midtrans Audit
					</h3>
					<p className="text-slate-400 font-bold text-sm leading-relaxed max-w-3xl">
						Laporan ini menggabungkan data pencatatan Point of Sales (POS) dan
						verifikasi settlement dari Payment Gateway. Dalam masa transisi,
						beberapa data mungkin memerlukan sinkronisasi manual harian sebelum
						pukul 23:59 WIB.
					</p>
				</div>
				<Button
					variant="outline"
					className="rounded-2xl h-14 px-10 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-900 hover:text-white transition-all"
				>
					Manual Sync Detail
				</Button>
			</div>
		</div>
	);
}
