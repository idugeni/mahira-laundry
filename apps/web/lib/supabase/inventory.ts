import { cache } from "@/lib/upstash/cache";
import { createClient } from "@/lib/supabase/auth";

export async function getAllInventory(outletId?: string) {
	const cacheKey = `inventory:${outletId || "all"}`;
	return cache(
		cacheKey,
		async () => {
			const supabase = await createClient();
			let query = supabase.from("inventory").select("*").order("name", { ascending: true });
			if (outletId) query = query.eq("outlet_id", outletId);
			const { data } = await query;
			return data || [];
		},
		60,
	);
}

export async function getAllServices(outletId?: string) {
	const cacheKey = `services:${outletId || "all"}`;
	return cache(
		cacheKey,
		async () => {
			const supabase = await createClient();
			let query = supabase.from("services").select("*").order("sort_order", { ascending: true });
			if (outletId) query = query.eq("outlet_id", outletId);
			const { data } = await query;
			return data || [];
		},
		300,
	);
}

export async function getAllVouchers(outletId?: string) {
	const cacheKey = `vouchers:${outletId || "all"}`;
	return cache(
		cacheKey,
		async () => {
			const supabase = await createClient();
			let query = supabase.from("vouchers").select("*").order("created_at", { ascending: false });
			if (outletId) query = query.or(`outlet_id.eq.${outletId},outlet_id.is.null`);
			const { data } = await query;
			return data || [];
		},
		120,
	);
}
