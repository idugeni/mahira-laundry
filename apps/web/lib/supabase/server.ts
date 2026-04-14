import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
					}
				},
			},
		},
	);
}

export async function getSession() {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
}

export async function getUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

export async function getUserProfile() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	return profile;
}

export async function getDashboardStats() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const [ordersRes, activeOrdersRes, profileRes] = await Promise.all([
		supabase
			.from("orders")
			.select("id", { count: "exact", head: true })
			.eq("customer_id", user.id),
		supabase
			.from("orders")
			.select("id", { count: "exact", head: true })
			.eq("customer_id", user.id)
			.not("status", "in", '("completed","cancelled")'),
		supabase
			.from("profiles")
			.select("loyalty_points, loyalty_tier")
			.eq("id", user.id)
			.single(),
	]);

	return {
		totalOrders: ordersRes.count || 0,
		activeOrders: activeOrdersRes.count || 0,
		loyaltyPoints: profileRes.data?.loyalty_points || 0,
		loyaltyTier: profileRes.data?.loyalty_tier || "bronze",
	};
}

export async function getLoyaltyHistory() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return [];

	const { data: loyalty } = await supabase
		.from("loyalty")
		.select("*, orders(order_number)")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	return loyalty || [];
}

export async function getOrders() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return [];

	const { data: orders } = await supabase
		.from("orders")
		.select("*, order_items(*)")
		.eq("customer_id", user.id)
		.order("created_at", { ascending: false });

	return orders || [];
}

export async function getRewards() {
	const supabase = await createClient();
	const { data: rewards } = await supabase
		.from("rewards")
		.select("*")
		.eq("is_active", true)
		.order("points_cost", { ascending: true });

	return rewards || [];
}

export async function getPublishedTestimonials() {
	const supabase = await createClient();
	const { data: testimonials } = await supabase
		.from("testimonials")
		.select("*, profiles(full_name), guest_name")
		.eq("is_published", true)
		.order("created_at", { ascending: false })
		.limit(10);

	return testimonials || [];
}

export async function getAllTestimonials() {
	const supabase = await createClient();
	const { data: testimonials, error } = await supabase
		.from("testimonials")
		.select("*, profiles(full_name)")
		.order("created_at", { ascending: false });

	if (error) console.error("Error fetching all testimonials:", error);
	return testimonials || [];
}

export async function getSuperadminDashboardStats() {
	const supabase = await createClient();

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
      outlets!outlet_id(name),
      profiles!actor_id(full_name)
    `)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		console.error("Error fetching expenses:", error.message);
		return [];
	}
	return data || [];
}

// Revenue aggregated by month for the past N months
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

	// Group by month
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

// Order count by day for the past N days
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

// Recent orders with customer names
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

// Payment method breakdown
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

// Audit logs with optional filters
export async function getAuditLogs(limit = 50, tableName?: string) {
	const supabase = await createClient();
	let query = supabase
		.from("audit_logs")
		.select("*, profiles(full_name, role)")
		.order("created_at", { ascending: false })
		.limit(limit);

	if (tableName) {
		query = query.eq("table_name", tableName);
	}

	const { data, error } = await query;
	if (error) {
		console.error("Error fetching audit logs:", error);
		return [];
	}
	return data || [];
}

// Outlets with order & revenue stats
export async function getOutletsWithStats() {
	const supabase = await createClient();
	const { data: outlets } = await supabase
		.from("outlets")
		.select("*")
		.order("created_at", { ascending: true });

	if (!outlets?.length) return [];

	const now = new Date();
	const startOfMonth = new Date(
		now.getFullYear(),
		now.getMonth(),
		1,
	).toISOString();

	const statsPromises = outlets.map(async (outlet) => {
		const [ordersRes, revenueRes] = await Promise.all([
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
		]);

		const monthlyRevenue =
			revenueRes.data?.reduce((s, o) => s + (o.total || 0), 0) || 0;

		return {
			...outlet,
			ordersThisMonth: ordersRes.count || 0,
			monthlyRevenue,
		};
	});

	return Promise.all(statsPromises);
}

export async function getManagerDashboardStats() {
	const supabase = await createClient();
	const [activeOrdersRes, staffRes, revenueRes] = await Promise.all([
		supabase
			.from("orders")
			.select("id", { count: "exact", head: true })
			.not("status", "in", '("completed","cancelled")'),
		supabase
			.from("profiles")
			.select("id", { count: "exact", head: true })
			.in("role", ["kasir", "kurir"]),
		supabase
			.from("orders")
			.select("final_total")
			.eq("payment_status", "paid")
			.gte(
				"created_at",
				new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
			),
	]);

	const todayRevenue =
		revenueRes.data?.reduce(
			(sum, order) => sum + (order.final_total || 0),
			0,
		) || 0;

	return {
		activeOrders: activeOrdersRes.count || 0,
		activeStaff: staffRes.count || 0,
		todayRevenue,
		rating: "5.0",
	};
}

// Inventory low-stock items
export async function getLowStockItems(limit = 10) {
	const supabase = await createClient();
	const { data } = await supabase
		.from("inventory")
		.select("*")
		.filter("quantity", "lte", "min_stock")
		.order("quantity", { ascending: true })
		.limit(limit);

	return data || [];
}

// Active vouchers list for manager
export async function getActiveVouchers() {
	const supabase = await createClient();
	const { data } = await supabase
		.from("vouchers")
		.select("*")
		.eq("is_active", true)
		.gte("valid_until", new Date().toISOString())
		.order("created_at", { ascending: false });

	return data || [];
}

// Staff list for manager
export async function getStaffList(outletId?: string) {
	const supabase = await createClient();
	let query = supabase
		.from("profiles")
		.select("id, full_name, role, phone, is_active, created_at, outlet_id")
		.in("role", ["kasir", "kurir", "manager"])
		.order("role", { ascending: true });

	if (outletId) query = query.eq("outlet_id", outletId);

	const { data } = await query;
	return data || [];
}

// All inventory items
export async function getAllInventory(outletId?: string) {
	const supabase = await createClient();
	let query = supabase
		.from("inventory")
		.select("*")
		.order("name", { ascending: true });
	if (outletId) query = query.eq("outlet_id", outletId);
	const { data } = await query;
	return data || [];
}

// All services
export async function getAllServices(outletId?: string) {
	const supabase = await createClient();
	let query = supabase
		.from("services")
		.select("*")
		.order("sort_order", { ascending: true });
	if (outletId) query = query.eq("outlet_id", outletId);
	const { data } = await query;
	return data || [];
}

// All vouchers
export async function getAllVouchers(outletId?: string) {
	const supabase = await createClient();
	// Filter for vouchers bound to this outlet or global vouchers (outlet_id is null)
	let query = supabase
		.from("vouchers")
		.select("*")
		.order("created_at", { ascending: false });
	if (outletId) query = query.or(`outlet_id.eq.${outletId},outlet_id.is.null`);
	const { data } = await query;
	return data || [];
}

// Global staff list for superadmin (with outlet info)
export async function getStaffManagementList() {
	const supabase = await createClient();
	const { data } = await supabase
		.from("profiles")
		.select(`
      id,
      full_name,
      role,
      phone,
      is_active,
      created_at,
      outlet_id,
      outlets!outlet_id (
        name
      )
    `)
		.in("role", ["kasir", "kurir", "manager"])
		.order("created_at", { ascending: false });

	return data || [];
}
