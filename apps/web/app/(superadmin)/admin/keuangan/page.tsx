import type { Metadata } from "next";
import { SuperadminFinanceClient } from "@/components/shared/admin/finance/finance-client";
import {
	getOutletsWithStats,
	getPaymentMethodStats,
	getRecentExpenses,
	getRecentOrders,
	getSuperadminDashboardStats,
	getSuperadminRevenueByMonth,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Laporan Keuangan",
	description:
		"Ringkasan keuangan dan finansial seluruh cabang Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
	const [
		stats,
		revenueData,
		paymentStats,
		recentPaidOrders,
		expenses,
		outletsWithStats,
	] = await Promise.all([
		getSuperadminDashboardStats(),
		getSuperadminRevenueByMonth(6),
		getPaymentMethodStats(),
		getRecentOrders(10),
		getRecentExpenses(50),
		getOutletsWithStats(),
	]);

	const actualExpenses = stats.totalExpenses || 0;
	const netProfit = stats.totalRevenue - actualExpenses;
	const margin =
		stats.totalRevenue > 0
			? ((netProfit / stats.totalRevenue) * 100).toFixed(1)
			: "0";

	const outlets = outletsWithStats.map((o: { id: string; name: string }) => ({
		id: o.id,
		name: o.name,
	}));

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
			outlets={outlets}
		/>
	);
}
