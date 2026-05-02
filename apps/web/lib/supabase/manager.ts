import { createClient } from "./auth";

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
			.gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
	]);

	const todayRevenue =
		revenueRes.data?.reduce((sum, order) => sum + (order.final_total || 0), 0) || 0;

	return {
		activeOrders: activeOrdersRes.count || 0,
		activeStaff: staffRes.count || 0,
		todayRevenue,
		rating: "5.0",
	};
}

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
