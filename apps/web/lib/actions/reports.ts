"use server";

import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/utils";

export type ReportType = "harian" | "mingguan" | "bulanan" | "keuangan";

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
	const reportRows = orders.map((order: any) => ({
		"Order Number": order.order_number,
		Tanggal: new Date(order.created_at).toLocaleDateString("id-ID"),
		Outlet: order.outlets?.name || "N/A",
		Customer: order.profiles?.full_name || "N/A",
		Phone: order.profiles?.phone || "N/A",
		Status: order.status,
		Payment: order.payment_status,
		Total: order.total,
		Items: order.order_items
			?.map((i: any) => `${i.service_name} (${i.quantity} ${i.unit})`)
			.join(", "),
	}));

	// Summary Metrics based on type
	const totalRevenue = orders
		.filter((o: any) => o.payment_status === "paid")
		.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

	const totalExpenses = (expenses || []).reduce(
		(sum: number, e: any) => sum + Number(e.amount || 0),
		0,
	);
	const netProfit = totalRevenue - totalExpenses;

	const totalOrders = orders.length;
	const completedOrders = orders.filter(
		(o: any) => o.status === "completed",
	).length;

	// Aggregate by outlet (Kompleks!)
	const outletStats: Record<string, { count: number; revenue: number }> = {};
	orders.forEach((o: any) => {
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
