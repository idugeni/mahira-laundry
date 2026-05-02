"use client";

import {
	Activity,
	Banknote,
	BarChart3,
	Building2,
	Calendar,
	CreditCard,
	Download,
	Filter,
	History,
	Receipt,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import {
	PaymentPieChart,
	RevenueBarChart,
} from "@/components/shared/admin/admin-charts";
import { ExpenseModal } from "@/components/shared/admin/finance/expense-modal";
import { IncomeModal } from "@/components/shared/admin/finance/income-modal";
import { PaginationControls } from "@/components/shared/common/pagination-controls";
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

interface RevenueDataPoint {
	month: string;
	revenue: number;
	[key: string]: unknown;
}

interface PaymentStatPoint {
	method: string;
	total: number;
	[key: string]: unknown;
}

interface RecentOrder {
	id: string;
	order_number: string;
	profiles:
		| { full_name: string | null }
		| { full_name: string | null }[]
		| null;
	payment_status: string;
	created_at: string;
	total: number;
}

interface ExpenseRecord {
	id: string;
	reason: string;
	category: string | null;
	amount: number;
	created_at: string;
	outlets: { name: string } | null;
	profiles: { full_name: string | null } | null;
}

interface SuperadminFinanceClientProps {
	stats: FinanceStats;
	revenueData: RevenueDataPoint[];
	paymentStats: PaymentStatPoint[];
	recentPaidOrders: RecentOrder[];
	expenses: ExpenseRecord[];
	outlets: { id: string; name: string }[];
}

export function SuperadminFinanceClient({
	stats,
	revenueData,
	paymentStats,
	recentPaidOrders,
	expenses,
	outlets,
}: SuperadminFinanceClientProps) {
	const [_activeTab, setActiveTab] = useState("overview");
	const [expensePage, setExpensePage] = useState(1);
	const [expensePageSize, setExpensePageSize] = useState(10);
	const [historyPage, setHistoryPage] = useState(1);
	const [historyPageSize, setHistoryPageSize] = useState(10);

	const expenseTotalPages = Math.ceil(expenses.length / expensePageSize);
	const paginatedExpenses = expenses.slice(
		(expensePage - 1) * expensePageSize,
		expensePage * expensePageSize,
	);

	const historyTotalPages = Math.ceil(
		recentPaidOrders.length / historyPageSize,
	);
	const paginatedHistory = recentPaidOrders.slice(
		(historyPage - 1) * historyPageSize,
		historyPage * historyPageSize,
	);

	return (
		<div className="space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* High-End Header */}
			<div className="relative overflow-hidden bg-slate-900 rounded-none sm:rounded-2xl md:rounded-[2rem] p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-slate-900/30 group">
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-60" />

				<div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
					<div className="space-y-5">
						<div className="flex items-center gap-3">
							<Badge className="bg-emerald-500 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
								Financial Governance
							</Badge>
							<span className="text-slate-500">•</span>
							<span className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
								<Activity size={14} /> Real-time Cashflow
							</span>
						</div>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-heading)] leading-tight">
							Executive <span className="text-emerald-400 italic">Finance</span>
						</h1>
						<p className="text-slate-400 font-bold text-sm md:text-lg max-w-2xl leading-relaxed">
							Otoritas keuangan tertinggi Mahira Group. Monitoring
							profitabilitas, kontrol biaya operasional, dan analisis
							pertumbuhan finansial seluruh cabang.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<IncomeModal
							outlets={outlets}
							trigger={
								<Button className="bg-emerald-500 text-white hover:bg-emerald-400 rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2.5">
									<div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
										<TrendingUp size={17} />
									</div>
									Tambah Pemasukan
								</Button>
							}
						/>
						<ExpenseModal
							outletId="all"
							trigger={
								<Button className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-slate-950 rounded-xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-white/5 flex items-center gap-2.5">
									<div className="w-7 h-7 rounded-lg bg-slate-900/5 flex items-center justify-center">
										<Receipt size={17} />
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
				className="w-full space-y-8"
				onValueChange={setActiveTab}
			>
				<div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-0">
					<TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1.5">
						<TabsTrigger
							value="overview"
							className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md shadow-slate-200"
						>
							<BarChart3 size={14} className="mr-1.5" /> Overview
						</TabsTrigger>
						<TabsTrigger
							value="expenses"
							className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md shadow-slate-200"
						>
							<Wallet size={14} className="mr-1.5" /> Expenses
						</TabsTrigger>
						<TabsTrigger
							value="history"
							className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md shadow-slate-200"
						>
							<History size={14} className="mr-1.5" /> History
						</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							className="rounded-xl h-11 px-4 sm:px-5 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-2"
						>
							<Calendar size={16} />{" "}
							{new Date().toLocaleDateString("id-ID", {
								month: "long",
								year: "numeric",
							})}
						</Button>
						<Button className="rounded-xl h-11 px-4 sm:px-5 font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-900/10 transition-colors">
							<Download size={16} className="mr-1.5" /> Export
						</Button>
					</div>
				</div>

				{/* === OVERVIEW TAB === */}
				<TabsContent
					value="overview"
					className="space-y-8 focus-visible:outline-hidden"
				>
					{/* KPI Row */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 sm:gap-6">
						<div className="group relative bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-b sm:border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-shadow duration-300">
							<div className="flex items-center justify-between mb-6">
								<div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-md shadow-indigo-100">
									<CreditCard size={26} />
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
							<h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
								{formatCompact(stats.totalRevenue)}
							</h3>
							<p className="text-xs font-bold text-slate-400">
								{formatIDR(stats.totalRevenue)}
							</p>
						</div>

						<div className="group relative bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-b sm:border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-rose-500/10 transition-shadow duration-300">
							<div className="flex items-center justify-between mb-6">
								<div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-md shadow-rose-100">
									<Banknote size={26} />
								</div>
								<Badge className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
									Monthly Cost
								</Badge>
							</div>
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
								Biaya Operasional
							</p>
							<h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
								{formatCompact(stats.totalExpenses)}
							</h3>
							<p className="text-xs font-bold text-slate-400">
								{formatIDR(stats.totalExpenses)}
							</p>
						</div>

						<div className="group relative bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-b sm:border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-shadow duration-300">
							<div className="flex items-center justify-between mb-6">
								<div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-100">
									<TrendingUp size={26} />
								</div>
								<Badge className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
									{stats.margin}% Margin
								</Badge>
							</div>
							<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
								Laba Bersih (Net)
							</p>
							<h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
								{formatCompact(stats.netProfit)}
							</h3>
							<p className="text-xs font-bold text-slate-400">
								{formatIDR(stats.netProfit)}
							</p>
						</div>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
						{/* Revenue Trend Chart */}
						<div className="md:col-span-1 lg:col-span-3 bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40">
							<div className="flex items-center justify-between mb-10">
								<div>
									<h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
										Tren Pendapatan
									</h2>
									<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
										6 Bulan Terakhir
									</p>
								</div>
							</div>
							<div className="h-64">
								<RevenueBarChart data={revenueData} />
							</div>
						</div>

						{/* Payment Distribution Pie */}
						<div className="md:col-span-1 lg:col-span-2 bg-white rounded-none sm:rounded-2xl p-6 sm:p-8 border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40">
							<div className="mb-8">
								<h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
									Distribusi Bayar
								</h2>
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
									Metode Paling Populer
								</p>
							</div>
							{paymentStats.length > 0 ? (
								<div className="h-64">
									<PaymentPieChart data={paymentStats} />
								</div>
							) : (
								<div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-4">
									<div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
										<CreditCard size={32} />
									</div>
									<p className="text-[10px] font-black uppercase tracking-widest">
										Belum ada data pembayaran
									</p>
								</div>
							)}
						</div>
					</div>
				</TabsContent>

				{/* === EXPENSES TAB === */}
				<TabsContent
					value="expenses"
					className="space-y-8 focus-visible:outline-hidden"
				>
					<div className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden">
						<div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
									Detail Pengeluaran
								</h2>
								<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
									{expenses.length} record total
								</p>
							</div>
							<Button
								variant="outline"
								className="rounded-xl h-11 px-5 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white shadow-xs flex items-center gap-2 self-start sm:self-auto"
							>
								<Filter size={16} /> Filter Category
							</Button>
						</div>

						{expenses.length === 0 ? (
							<div className="py-20 text-center text-slate-300">
								<Receipt size={48} className="mx-auto mb-4 opacity-30" />
								<p className="font-bold text-sm">Belum ada data pengeluaran</p>
							</div>
						) : (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-4 md:p-6 divide-y md:divide-y-0 divide-slate-100">
									{paginatedExpenses.map((expense) => (
										<div
											key={expense.id}
											className="group p-4 md:p-5 md:rounded-2xl md:border border-slate-100 md:shadow-xs hover:md:shadow-lg hover:md:shadow-indigo-500/5 transition-[box-shadow] duration-300"
										>
											{/* Header: Description + Amount */}
											<div className="flex items-start justify-between gap-3 mb-3">
												<div className="flex-1 min-w-0">
													<p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">
														{expense.reason}
													</p>
													<div className="flex items-center gap-2 mt-1.5 flex-wrap">
														<Badge className="bg-rose-50 text-rose-600 border-none text-[8px] font-black uppercase tracking-widest px-1.5 shadow-none">
															{expense.category || "General"}
														</Badge>
														<span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
															<Building2 size={10} />{" "}
															{expense.outlets?.name || "Global"}
														</span>
													</div>
												</div>
												<p className="font-black text-rose-600 text-sm whitespace-nowrap">
													-{formatIDR(expense.amount)}
												</p>
											</div>

											{/* Footer: Validator + Time */}
											<div className="flex items-center justify-between pt-3 border-t border-slate-50">
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[9px] shrink-0">
														{expense.profiles?.full_name?.charAt(0) || "?"}
													</div>
													<span className="text-[10px] font-bold text-slate-500 truncate max-w-[100px]">
														{expense.profiles?.full_name || "—"}
													</span>
												</div>
												<span className="text-[10px] text-slate-400 font-bold">
													{formatDateTime(expense.created_at)}
												</span>
											</div>
										</div>
									))}
								</div>

								<div className="px-4 md:px-6 pb-6">
									<PaginationControls
										currentPage={expensePage}
										totalPages={expenseTotalPages}
										onPageChange={setExpensePage}
										totalItems={expenses.length}
										itemsPerPage={expensePageSize}
										onPageSizeChange={setExpensePageSize}
									/>
								</div>
							</>
						)}
					</div>
				</TabsContent>

				{/* === HISTORY TAB === */}
				<TabsContent
					value="history"
					className="space-y-8 focus-visible:outline-hidden"
				>
					<div className="bg-white rounded-none sm:rounded-2xl border-y sm:border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden">
						<div className="p-6 sm:p-8 border-b border-slate-50">
							<h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
								Ledger Transaksi
							</h2>
							<p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
								{recentPaidOrders.length} transaksi total
							</p>
						</div>

						{recentPaidOrders.length === 0 ? (
							<div className="py-20 text-center text-slate-300">
								<CreditCard size={48} className="mx-auto mb-4 opacity-30" />
								<p className="font-bold text-sm">Belum ada transaksi</p>
							</div>
						) : (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-4 md:p-6 divide-y md:divide-y-0 divide-slate-100">
									{paginatedHistory.map((order) => (
										<div
											key={order.id}
											className="group p-4 md:p-5 md:rounded-2xl md:border border-slate-100 md:shadow-xs hover:md:shadow-lg hover:md:shadow-indigo-500/5 transition-[box-shadow] duration-300"
										>
											{/* Header: Order ID + Amount */}
											<div className="flex items-start justify-between gap-3 mb-3">
												<div className="min-w-0">
													<p className="font-mono text-xs font-black text-indigo-600">
														#{order.order_number}
													</p>
													<p className="font-black text-slate-900 text-sm mt-0.5 truncate">
														{Array.isArray(order.profiles)
															? order.profiles[0]?.full_name || "—"
															: order.profiles?.full_name || "—"}
													</p>
												</div>
												<p className="font-black text-slate-900 text-sm whitespace-nowrap">
													{formatIDR(order.total)}
												</p>
											</div>

											{/* Footer: Status + Time */}
											<div className="flex items-center justify-between pt-3 border-t border-slate-50">
												<Badge
													className={cn(
														"px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none shadow-none",
														order.payment_status === "paid"
															? "bg-emerald-50 text-emerald-600"
															: "bg-amber-50 text-amber-600",
													)}
												>
													{order.payment_status === "paid"
														? "✓ Settled"
														: "⏳ Pending"}
												</Badge>
												<span className="text-[10px] text-slate-400 font-bold">
													{formatDateTime(order.created_at)}
												</span>
											</div>
										</div>
									))}
								</div>

								<div className="px-4 md:px-6 pb-6">
									<PaginationControls
										currentPage={historyPage}
										totalPages={historyTotalPages}
										onPageChange={setHistoryPage}
										totalItems={recentPaidOrders.length}
										itemsPerPage={historyPageSize}
										onPageSizeChange={setHistoryPageSize}
									/>
								</div>
							</>
						)}
					</div>
				</TabsContent>
			</Tabs>

			{/* Reconciliation Notice */}
			<div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-6 group hover:bg-white hover:border-indigo-100 transition-colors duration-300">
				<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-md border border-slate-50 shrink-0">
					🏦
				</div>
				<div className="flex-1 text-center md:text-left">
					<h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
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
					className="rounded-xl h-11 px-5 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-900 hover:text-white shrink-0"
				>
					Manual Sync Detail
				</Button>
			</div>
		</div>
	);
}
