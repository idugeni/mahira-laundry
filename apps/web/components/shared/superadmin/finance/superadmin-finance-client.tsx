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
								<Button className="bg-white text-slate-900 hover:bg-emerald-400 hover:text-white rounded-2xl px-8 sm:px-12 h-16 sm:h-20 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5 flex items-center gap-4">
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
				<div className="flex flex-wrap items-center justify-between gap-4 px-4 lg:px-0">
					<TabsList className="bg-slate-100 p-1.5 rounded-2xl lg:rounded-[2rem] h-auto flex flex-wrap gap-1.5">
						<TabsTrigger
							value="overview"
							className="rounded-2xl px-4 sm:px-8 py-3 sm:py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<BarChart3 size={14} className="mr-1.5" /> Overview
						</TabsTrigger>
						<TabsTrigger
							value="expenses"
							className="rounded-2xl px-4 sm:px-8 py-3 sm:py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<Wallet size={14} className="mr-1.5" /> Expenses
						</TabsTrigger>
						<TabsTrigger
							value="history"
							className="rounded-2xl px-4 sm:px-8 py-3 sm:py-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl shadow-slate-200"
						>
							<History size={14} className="mr-1.5" /> History
						</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							className="rounded-2xl h-12 px-4 sm:px-8 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2"
						>
							<Calendar size={16} />{" "}
							{new Date().toLocaleDateString("id-ID", {
								month: "long",
								year: "numeric",
							})}
						</Button>
						<Button className="rounded-2xl h-12 px-4 sm:px-8 font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-900/10 transition-all">
							<Download size={16} className="mr-1.5" /> Export
						</Button>
					</div>
				</div>

				{/* === OVERVIEW TAB === */}
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
									{stats.margin}% Margin
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

					<div className="grid lg:grid-cols-5 gap-6 sm:gap-10">
						{/* Revenue Trend Chart */}
						<div className="lg:col-span-3 bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40">
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
						<div className="lg:col-span-2 bg-white rounded-none sm:rounded-[3rem] p-6 sm:p-10 border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40">
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
									<div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
										<CreditCard size={40} />
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
					className="space-y-10 focus-visible:outline-none"
				>
					<div className="bg-white rounded-none sm:rounded-[3rem] border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
						<div className="p-6 sm:p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
								className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white shadow-sm flex items-center gap-2 self-start sm:self-auto"
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
								{/* DESKTOP TABLE */}
								<div className="hidden md:block">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="bg-slate-50/50">
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Deskripsi & Kategori
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Unit Cabang
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Validator
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Waktu
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
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
													<td className="px-6 py-6">
														<div>
															<p className="font-black text-slate-900 uppercase tracking-tight text-sm">
																{expense.reason}
															</p>
															<Badge className="mt-1 bg-rose-50 text-rose-600 border-none text-[8px] font-black uppercase tracking-widest px-1.5 shadow-none">
																{expense.category || "General"}
															</Badge>
														</div>
													</td>
													<td className="px-6 py-6">
														<div className="flex items-center gap-2">
															<Building2
																size={14}
																className="text-slate-300 shrink-0"
															/>
															<p className="text-sm font-bold text-slate-700">
																{expense.outlets?.name || "Global"}
															</p>
														</div>
													</td>
													<td className="px-6 py-6">
														<div className="flex items-center gap-2">
															<div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px] shrink-0">
																{expense.profiles?.full_name?.charAt(0) || "?"}
															</div>
															<p className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
																{expense.profiles?.full_name || "—"}
															</p>
														</div>
													</td>
													<td className="px-6 py-6 text-xs font-bold text-slate-400 whitespace-nowrap">
														{formatDateTime(expense.created_at)}
													</td>
													<td className="px-6 py-6 text-right">
														<p className="text-base font-black text-rose-600 whitespace-nowrap">
															-{formatIDR(expense.amount)}
														</p>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* MOBILE CARDS */}
								<div className="md:hidden divide-y divide-slate-100">
									{paginatedExpenses.map((expense) => (
										<div
											key={expense.id}
											className="p-4 hover:bg-slate-50/50 transition-colors"
										>
											<div className="flex items-start justify-between gap-3">
												<div className="flex-1 min-w-0">
													<p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">
														{expense.reason}
													</p>
													<div className="flex items-center gap-2 mt-1 flex-wrap">
														<Badge className="bg-rose-50 text-rose-600 border-none text-[8px] font-black uppercase tracking-widest px-1.5 shadow-none">
															{expense.category || "General"}
														</Badge>
														<span className="text-[10px] text-slate-400 font-bold">
															{expense.outlets?.name || "Global"}
														</span>
													</div>
												</div>
												<p className="font-black text-rose-600 text-sm whitespace-nowrap">
													-{formatIDR(expense.amount)}
												</p>
											</div>
											<div className="flex items-center justify-between mt-2">
												<span className="text-[10px] text-slate-400 font-bold">
													{expense.profiles?.full_name || "—"}
												</span>
												<span className="text-[10px] text-slate-400 font-bold">
													{formatDateTime(expense.created_at)}
												</span>
											</div>
										</div>
									))}
								</div>

								<div className="px-6 pb-6">
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
					className="space-y-10 focus-visible:outline-none"
				>
					<div className="bg-white rounded-none sm:rounded-[4rem] border-y sm:border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
						<div className="p-6 sm:p-10 border-b border-slate-50">
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
								{/* DESKTOP TABLE */}
								<div className="hidden md:block">
									<table className="w-full text-left border-collapse">
										<thead>
											<tr className="bg-slate-50/50">
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Order ID
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Pelanggan
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
													Status Bayar
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
													Tanggal
												</th>
												<th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
													Amount
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-100">
											{paginatedHistory.map((order) => (
												<tr
													key={order.id}
													className="group hover:bg-slate-50/30 transition-colors"
												>
													<td className="px-6 py-6 font-mono text-xs font-black text-indigo-600">
														#{order.order_number}
													</td>
													<td className="px-6 py-6">
														<p className="text-sm font-black text-slate-900 uppercase tracking-tight">
															{Array.isArray(order.profiles)
																? order.profiles[0]?.full_name || "—"
																: order.profiles?.full_name || "—"}
														</p>
													</td>
													<td className="px-6 py-6">
														<Badge
															className={cn(
																"px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none shadow-none",
																order.payment_status === "paid"
																	? "bg-emerald-50 text-emerald-600"
																	: "bg-amber-50 text-amber-600",
															)}
														>
															{order.payment_status === "paid"
																? "✓ Settled"
																: "⏳ Pending"}
														</Badge>
													</td>
													<td className="px-6 py-6 text-right text-xs font-bold text-slate-400 whitespace-nowrap">
														{formatDateTime(order.created_at)}
													</td>
													<td className="px-6 py-6 text-right font-black text-slate-900 text-base whitespace-nowrap">
														{formatIDR(order.total)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* MOBILE CARDS */}
								<div className="md:hidden divide-y divide-slate-100">
									{paginatedHistory.map((order) => (
										<div
											key={order.id}
											className="p-4 hover:bg-slate-50/50 transition-colors"
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="font-mono text-xs font-black text-indigo-600">
														#{order.order_number}
													</p>
													<p className="font-black text-slate-900 text-sm mt-0.5">
														{Array.isArray(order.profiles)
															? order.profiles[0]?.full_name || "—"
															: order.profiles?.full_name || "—"}
													</p>
												</div>
												<p className="font-black text-slate-900 text-sm whitespace-nowrap">
													{formatIDR(order.total)}
												</p>
											</div>
											<div className="flex items-center justify-between mt-2">
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

								<div className="px-6 pb-6">
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
			<div className="bg-slate-50 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 lg:p-14 border border-slate-100 flex flex-col lg:flex-row items-center gap-8 group hover:bg-white hover:border-indigo-100 transition-all duration-500">
				<div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl border border-slate-50 group-hover:rotate-12 transition-transform duration-500 shrink-0">
					🏦
				</div>
				<div className="flex-1 text-center lg:text-left">
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
					className="rounded-2xl h-14 px-8 sm:px-10 font-black text-[10px] uppercase tracking-widest border-slate-100 bg-white hover:bg-slate-900 hover:text-white transition-all shrink-0"
				>
					Manual Sync Detail
				</Button>
			</div>
		</div>
	);
}
