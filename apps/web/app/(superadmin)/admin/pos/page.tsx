import { POSClient } from "@/components/kasir/pos-client";
import { PRIMARY_OUTLET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function IntegratedPOSPage() {
	const supabase = await createClient();

	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch user's profile to get outlet_id, role, and full_name
	const { data: profile } = await supabase
		.from("profiles")
		.select("outlet_id, role, full_name")
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

	return (
		<div className="space-y-8 pb-20">
			<div>
				<h1 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
					Superadmin <span className="text-brand-gradient">POS</span>
				</h1>
				<p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
					Terminal Kasir — Outlet: {finalOutletId.split("-")[0]}
				</p>
			</div>
			<POSClient
				initialServices={services || []}
				outletId={finalOutletId}
				cashierName={profile?.full_name || "Admin"}
			/>
		</div>
	);
}
