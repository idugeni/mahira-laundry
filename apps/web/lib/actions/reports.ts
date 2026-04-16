"use server";

import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/utils";

export type ReportType = "harian" | "mingguan" | "bulanan" | "keuangan";

type OrderRow = {
	order_number: string;
	created_at: string;
	status: string;
	payment_status: string;
	total: number;
	outlets?: { name?: string } | null;
	profiles?: { full_name?: string; phone?: string } | null;
	order_items?:
		| { service_name?: string; quantity?: number; unit?: string }[]
		| null;
};

type ExpenseRow = {
	amount?: number | string | null;
};

export async function generateReportData(
	type: ReportType,
	dateRange?: { from: string; to: string },
) {
	const supabase = await createClient();

	let start = new Date();
	let end = new Date();

	if (dateRange) {
		start = new Date(dateRange.from);
		end = new Date(dateRange.to);
	} else {
		// Default logic if no range provided
		if (type === "harian") {
			start.setHours(0, 0, 0, 0);
		} else if (type === "mingguan") {
			start.setDate(start.getDate() - 7);
		} else if (type === "bulanan") {
			start.setDate(1);
		}
	}

	const { data: orders, error: ordersError } = await supabase
		.from("orders")
		.select(`
      *,
      profiles!customer_id(full_name, phone),
      outlets(name),
      order_items(*),
      payments(*)
    `)
		.gte("created_at", start.toISOString())
		.lte("created_at", end.toISOString())
		.order("created_at", { ascending: false });

	if (ordersError) throw ordersError;

	// Fetch expenses for the same period
	const { data: expenses, error: expensesError } = await supabase
		.from("expenses")
		.select("*")
		.gte("date", start.toISOString())
		.lte("date", end.toISOString());

	if (expensesError)
		console.error("Could not fetch expenses for report:", expensesError);

	// Process data for export
	const reportRows = (orders as OrderRow[]).map((order) => ({
		"Order Number": order.order_number,
		Tanggal: new Date(order.created_at).toLocaleDateString("id-ID"),
		Outlet: order.outlets?.name || "N/A",
		Customer: order.profiles?.full_name || "N/A",
		Phone: order.profiles?.phone || "N/A",
		Status: order.status,
		Payment: order.payment_status,
		Total: order.total,
		Items: order.order_items
			?.map((i) => `${i.service_name} (${i.quantity} ${i.unit})`)
			.join(", "),
	}));

	// Summary Metrics based on type
	const totalRevenue = (orders as OrderRow[])
		.filter((o) => o.payment_status === "paid")
		.reduce((sum: number, o) => sum + (o.total || 0), 0);

	const totalExpenses = ((expenses || []) as ExpenseRow[]).reduce(
		(sum: number, e) => sum + Number(e.amount || 0),
		0,
	);
	const netProfit = totalRevenue - totalExpenses;

	const totalOrders = orders.length;
	const completedOrders = (orders as OrderRow[]).filter(
		(o) => o.status === "completed",
	).length;

	// Aggregate by outlet (Kompleks!)
	const outletStats: Record<string, { count: number; revenue: number }> = {};
	(orders as OrderRow[]).forEach((o) => {
		const name = o.outlets?.name || "N/A";
		if (!outletStats[name]) outletStats[name] = { count: 0, revenue: 0 };
		outletStats[name].count++;
		if (o.payment_status === "paid") outletStats[name].revenue += o.total || 0;
	});

	return {
		rows: reportRows,
		summary: {
			totalRevenue,
			totalExpenses,
			netProfit,
			formattedRevenue: formatIDR(totalRevenue),
			formattedExpenses: formatIDR(totalExpenses),
			formattedProfit: formatIDR(netProfit),
			totalOrders,
			completedOrders,
			period: `${start.toLocaleDateString("id-ID")} - ${end.toLocaleDateString("id-ID")}`,
			outletStats: Object.entries(outletStats).map(([name, stats]) => ({
				name,
				...stats,
			})),
		},
	};
}
