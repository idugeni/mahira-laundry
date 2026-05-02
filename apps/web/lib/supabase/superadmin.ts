import { createClient } from "./auth";

function getDateRanges() {
	const now = new Date();
	const startOfMonth = new Date(
		now.getFullYear(),
		now.getMonth(),
		1,
	).toISOString();
	const startOfLastMonth = new Date(
		now.getFullYear(),
		now.getMonth() - 1,
		1,
	).toISOString();
	const endOfLastMonth = new Date(
		now.getFullYear(),
		now.getMonth(),
		0,
		23,
		59,
		59,
	).toISOString();
	return { startOfMonth, startOfLastMonth, endOfLastMonth };
}

export async function getSuperadminDashboardStats() {
	const supabase = await createClient();
	const { startOfMonth, startOfLastMonth, endOfLastMonth } = getDateRanges();

	const [
		outletsRes,
		ordersThisMonthRes,
		ordersLastMonthRes,
		revenueRes,
		revenueLastMonthRes,
		customersRes,
		activeOrdersRes,
		expensesRes,
	] = await Promise.all([
		supabase
			.from("outlets")
			.select("id", { count: "exact", head: true })
			.eq("is_active", true),
		supabase
			.from("orders")
			.select("id", { count: "exact", head: true })
			.gte("created_at", startOfMonth),
		supabase
			.from("orders")
			.select("id", { count: "exact", head: true })
			.gte("created_at", startOfLastMonth)
			.lte("created_at", endOfLastMonth),
		supabase
			.from("orders")
			.select("total")
			.eq("payment_status", "paid")
			.gte("created_at", startOfMonth),
		supabase
			.from("orders")
			.select("total")
			.eq("payment_status", "paid")
			.gte("created_at", startOfLastMonth)
			.lte("created_at", endOfLastMonth),
		supabase
			.from("profiles")
			.select("id", { count: "exact", head: true })
			.eq("role", "customer"),
		supabase
			.from("orders")
			.select("id", { count: "exact", head: true })
			.not("status", "in", '("completed","cancelled")'),
		supabase.from("expenses").select("amount").gte("created_at", startOfMonth),
	]);

	const totalRevenue =
		revenueRes.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
	const lastMonthRevenue =
		revenueLastMonthRes.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

	const totalExpenses =
		expensesRes.data?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0;
	const ordersThisMonth = ordersThisMonthRes.count || 0;
	const ordersLastMonth = ordersLastMonthRes.count || 0;

	const revenueGrowth =
		lastMonthRevenue > 0
			? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(
					1,
				)
			: "0";
	const ordersGrowth =
		ordersLastMonth > 0
			? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(
					1,
				)
			: "0";

	return {
		totalOutlets: outletsRes.count || 1,
		ordersThisMonth,
		ordersLastMonth,
		totalRevenue,
		lastMonthRevenue,
		totalExpenses,
		revenueGrowth,
		ordersGrowth,
		totalCustomers: customersRes.count || 0,
		activeOrders: activeOrdersRes.count || 0,
	};
}

export async function getRecentExpenses(limit = 10) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("expenses")
		.select(`
      *,
      outlets!expenses_outlet_id_fkey(name),
      profiles!expenses_actor_id_fkey(full_name)
    `)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return [];
	}
	return data || [];
}

export async function getSuperadminRevenueByMonth(months = 6) {
	const supabase = await createClient();
	const since = new Date();
	since.setMonth(since.getMonth() - months);

	const { data } = await supabase
		.from("orders")
		.select("total, created_at")
		.eq("payment_status", "paid")
		.gte("created_at", since.toISOString())
		.order("created_at", { ascending: true });

	const grouped: Record<string, number> = {};
	for (let i = months - 1; i >= 0; i--) {
		const d = new Date();
		d.setMonth(d.getMonth() - i);
		const key = d.toLocaleDateString("id-ID", {
			month: "short",
			year: "2-digit",
		});
		grouped[key] = 0;
	}

	for (const row of data || []) {
		const d = new Date(row.created_at);
		const key = d.toLocaleDateString("id-ID", {
			month: "short",
			year: "2-digit",
		});
		if (grouped[key] !== undefined) {
			grouped[key] += row.total || 0;
		}
	}

	return Object.entries(grouped).map(([month, revenue]) => ({
		month,
		revenue,
	}));
}

export async function getOrdersByDay(days = 14) {
	const supabase = await createClient();
	const since = new Date();
	since.setDate(since.getDate() - days);

	const { data } = await supabase
		.from("orders")
		.select("created_at")
		.gte("created_at", since.toISOString())
		.order("created_at", { ascending: true });

	const grouped: Record<string, number> = {};
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		const key = d.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
		});
		grouped[key] = 0;
	}

	for (const row of data || []) {
		const d = new Date(row.created_at);
		const key = d.toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
		});
		if (grouped[key] !== undefined) {
			grouped[key] += 1;
		}
	}

	return Object.entries(grouped).map(([day, count]) => ({ day, count }));
}

export async function getRecentOrders(limit = 10) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("orders")
		.select(
			"id, order_number, status, payment_status, total, created_at, profiles!customer_id(full_name)",
		)
		.order("created_at", { ascending: false })
		.limit(limit);

	return data || [];
}

export async function getPaymentMethodStats() {
	const supabase = await createClient();
	const { data } = await supabase
		.from("payments")
		.select("method, amount")
		.eq("status", "paid");

	const grouped: Record<string, number> = {};
	for (const row of data || []) {
		const m = row.method || "other";
		grouped[m] = (grouped[m] || 0) + (row.amount || 0);
	}

	return Object.entries(grouped).map(([method, total]) => ({ method, total }));
}

export async function getAuditLogs(limit = 50, tableName?: string) {
	const supabase = await createClient();
	const fetchLimit = Math.min(limit * 3, 200);
	let query = supabase
		.from("audit_logs")
		.select("*, profiles(full_name, role)")
		.order("created_at", { ascending: false })
		.limit(fetchLimit);

	if (tableName) {
		query = query.eq("table_name", tableName);
	}

	const { data, error } = await query;
	if (error) {
		return [];
	}
	if (!data) return [];

	const seenWindows: Map<string, number> = new Map();
	const deduped = [];
	for (const log of data) {
		if (log.record_id === null || log.record_id === undefined) {
			deduped.push(log);
			if (deduped.length >= limit) break;
			continue;
		}
		const key = `${log.user_id}-${log.action}-${log.table_name}-${log.record_id}`;
		const logTime = new Date(log.created_at).getTime();
		const earliest = seenWindows.get(key);
		if (
			earliest !== undefined &&
			Math.abs(logTime - earliest) < 5 * 60 * 1000
		) {
			continue;
		}
		seenWindows.set(key, logTime);
		deduped.push(log);
		if (deduped.length >= limit) break;
	}
	return deduped;
}

export async function getOutletsWithStats() {
	const supabase = await createClient();
	const { data: outlets } = await supabase
		.from("outlets")
		.select("*")
		.order("created_at", { ascending: true });

	if (!outlets?.length) return [];

	const { startOfMonth, startOfLastMonth, endOfLastMonth } = getDateRanges();

	const statsPromises = outlets.map(async (outlet) => {
		const [ordersRes, revenueRes, lastMonthRevenueRes] = await Promise.all([
			supabase
				.from("orders")
				.select("id", { count: "exact", head: true })
				.eq("outlet_id", outlet.id)
				.gte("created_at", startOfMonth),
			supabase
				.from("orders")
				.select("total")
				.eq("outlet_id", outlet.id)
				.eq("payment_status", "paid")
				.gte("created_at", startOfMonth),
			supabase
				.from("orders")
				.select("total")
				.eq("outlet_id", outlet.id)
				.eq("payment_status", "paid")
				.gte("created_at", startOfLastMonth)
				.lte("created_at", endOfLastMonth),
		]);

		const monthlyRevenue =
			revenueRes.data?.reduce((s, o) => s + (o.total || 0), 0) || 0;
		const lastMonthRevenue =
			lastMonthRevenueRes.data?.reduce((s, o) => s + (o.total || 0), 0) || 0;

		return {
			...outlet,
			ordersThisMonth: ordersRes.count || 0,
			monthlyRevenue,
			lastMonthRevenue,
		};
	});

	return Promise.all(statsPromises);
}
