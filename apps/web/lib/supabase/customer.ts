import { createClient } from "./auth";

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
