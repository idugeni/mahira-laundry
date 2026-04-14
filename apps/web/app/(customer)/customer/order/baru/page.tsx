import { OrderClient } from "@/components/shared/order-client";
import { createClient } from "@/lib/supabase/server";

export default async function NewOrderPage() {
	const supabase = await createClient();

	const { data: outlets } = await supabase
		.from("outlets")
		.select("*")
		.eq("is_active", true);

	const { data: services } = await supabase
		.from("services")
		.select("*")
		.eq("is_active", true)
		.order("sort_order", { ascending: true });

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<OrderClient
			initialOutlets={outlets || []}
			initialServices={services || []}
			user={user}
		/>
	);
}
