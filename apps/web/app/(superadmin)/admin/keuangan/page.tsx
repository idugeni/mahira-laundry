import type { Metadata } from "next";
import {
	getPaymentMethodStats,
	getRecentOrders,
	getSuperadminDashboardStats,
	getSuperadminRevenueByMonth,
	getRecentExpenses,
} from "@/lib/supabase/server";
import { SuperadminFinanceClient } from "@/components/shared/superadmin/finance/superadmin-finance-client";

export const metadata: Metadata = {
	title: "Laporan Keuangan",
	description:
		"Ringkasan keuangan dan finansial seluruh cabang Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
	const [stats, revenueData, paymentStats, recentPaidOrders, expenses] =
		await Promise.all([
			getSuperadminDashboardStats(),
			getSuperadminRevenueByMonth(6),
			getPaymentMethodStats(),
			getRecentOrders(10),
			getRecentExpenses(50),
		]);

	const actualExpenses = stats.totalExpenses || 0;
	const netProfit = stats.totalRevenue - actualExpenses;
	const margin =
		stats.totalRevenue > 0
			? ((netProfit / stats.totalRevenue) * 100).toFixed(1)
			: "0";

	return (
		<SuperadminFinanceClient
			stats={{
				totalRevenue: stats.totalRevenue,
				totalExpenses: actualExpenses,
				netProfit,
				revenueGrowth: stats.revenueGrowth,
				margin,
			}}
			revenueData={revenueData}
			paymentStats={paymentStats}
			recentPaidOrders={recentPaidOrders}
			expenses={expenses || []}
		/>
	);
}
