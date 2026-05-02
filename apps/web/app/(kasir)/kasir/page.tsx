import { POSClient } from "@/components/kasir/pos-client";
import { PRIMARY_OUTLET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export default async function POSPage() {
	const supabase = await createClient();

	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: profile } = await supabase
		.from("profiles")
		.select("outlet_id, role")
		.eq("id", user?.id)
		.single();

	let outletId = profile?.outlet_id;

	if (!outletId && profile?.role === "superadmin") {
		const { data: outlet } = await supabase
			.from("outlets")
			.select("id")
			.eq("is_active", true)
			.limit(1)
			.single();
		outletId = outlet?.id;
	}

	const finalOutletId = outletId || PRIMARY_OUTLET.id;

	return <POSClient initialServices={services || []} outletId={finalOutletId} />;
}
