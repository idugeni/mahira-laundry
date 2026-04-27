import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { managerProcedure, router } from "@/server/trpc/proxy";

export const analyticsRouter = router({
	dashboard: managerProcedure
		.input(
			z.object({
				outletId: z.string().uuid(),
				period: z.enum(["day", "week", "month"]).default("week"),
			}),
		)
		.query(async ({ input }) => {
			const supabase = await createClient();

			const { count: totalOrders } = await supabase
				.from("orders")
				.select("*", { count: "exact", head: true })
				.eq("outlet_id", input.outletId);

			const { data: revenueData } = await supabase
				.from("orders")
				.select("total, created_at")
				.eq("outlet_id", input.outletId)
				.eq("status", "completed");

			const totalRevenue =
				revenueData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

			const { count: totalCustomers } = await supabase
				.from("orders")
				.select("customer_id", { count: "exact", head: true })
				.eq("outlet_id", input.outletId);

			const { data: reviews } = await supabase
				.from("reviews")
				.select("rating")
				.eq("outlet_id", input.outletId);

			const avgRating = reviews?.length
				? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
				: 0;

			return {
				totalOrders: totalOrders || 0,
				totalRevenue,
				totalCustomers: totalCustomers || 0,
				avgRating: Math.round(avgRating * 10) / 10,
				revenueData: revenueData || [],
			};
		}),

	topServices: managerProcedure
		.input(z.object({ outletId: z.string().uuid() }))
		.query(async ({ input }) => {
			const supabase = await createClient();
			const { data } = await supabase
				.from("order_items")
				.select("service_name, quantity")
				.in(
					"order_id",
					(
						await supabase
							.from("orders")
							.select("id")
							.eq("outlet_id", input.outletId)
					).data?.map((o) => o.id) || [],
				);

			const serviceMap = new Map<string, number>();
			data?.forEach((item) => {
				const current = serviceMap.get(item.service_name) || 0;
				serviceMap.set(item.service_name, current + Number(item.quantity));
			});

			return Array.from(serviceMap.entries())
				.map(([name, total]) => ({ name, total }))
				.sort((a, b) => b.total - a.total)
				.slice(0, 10);
		}),
});
