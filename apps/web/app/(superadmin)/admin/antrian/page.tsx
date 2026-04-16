import { AntrianClient } from "@/components/kasir/antrian-client";
import { PRIMARY_OUTLET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function IntegratedAntrianPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch user's profile to get outlet_id and role
	const { data: profile } = await supabase
		.from("profiles")
		.select("outlet_id, role")
		.eq("id", user?.id)
		.single();

	let outletId = profile?.outlet_id;

	// For superadmin without assigned outlet, pick the first active one
	if (!outletId && profile?.role === "superadmin") {
		const { data: outlet } = await supabase
			.from("outlets")
			.select("id")
			.eq("is_active", true)
			.limit(1)
			.single();
		outletId = outlet?.id;
	}

	// Fallback to primary outlet if still null
	const finalOutletId = outletId || PRIMARY_OUTLET.id;

	const { data: orders } = await supabase
		.from("orders")
		.select("*, customer:profiles!customer_id(full_name), order_items(*)")
		.eq("outlet_id", finalOutletId)
		.neq("status", "cancelled")
		.order("created_at", { ascending: false });

	return (
		<div className="space-y-8 pb-20 overflow-x-hidden">
			<div>
				<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
					Superadmin{" "}
					<span className="inline-block text-brand-gradient">Antrian</span>
				</h1>
				<p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">
					Mengelola Antrian — Outlet: {finalOutletId.split("-")[0]}
				</p>
			</div>
			<AntrianClient initialOrders={orders || []} />
		</div>
	);
}
