import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { protectedProcedure, router, staffProcedure } from "../proxy";

export const ordersRouter = router({
	list: protectedProcedure
		.input(
			z.object({
				status: z.string().optional(),
				page: z.number().default(1),
				pageSize: z.number().default(10),
			}),
		)
		.query(async ({ ctx, input }) => {
			const supabase = await createClient();
			let query = supabase
				.from("orders")
				.select("*, order_items(*)", { count: "exact" })
				.eq("customer_id", ctx.userId)
				.order("created_at", { ascending: false })
				.range(
					(input.page - 1) * input.pageSize,
					input.page * input.pageSize - 1,
				);

			if (input.status) query = query.eq("status", input.status);

			const { data, count } = await query;
			return { data: data || [], total: count || 0 };
		}),

	getById: protectedProcedure
		.input(z.string().uuid())
		.query(async ({ input }) => {
			const supabase = await createClient();
			const { data } = await supabase
				.from("orders")
				.select("*, order_items(*, services(*)), payments(*), delivery(*)")
				.eq("id", input)
				.single();
			return data;
		}),

	updateStatus: staffProcedure
		.input(
			z.object({
				orderId: z.string().uuid(),
				status: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { error } = await supabase
				.from("orders")
				.update({ status: input.status })
				.eq("id", input.orderId);
			if (error) throw error;
			return { success: true };
		}),
});
