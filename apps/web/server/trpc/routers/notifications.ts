import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { protectedProcedure, router } from "../proxy";

export const notificationsRouter = router({
	list: protectedProcedure
		.input(
			z.object({
				page: z.number().default(1),
				pageSize: z.number().default(20),
			}),
		)
		.query(async ({ ctx, input }) => {
			const supabase = await createClient();
			const { data, count } = await supabase
				.from("notifications")
				.select("*", { count: "exact" })
				.eq("user_id", ctx.userId)
				.order("created_at", { ascending: false })
				.range(
					(input.page - 1) * input.pageSize,
					input.page * input.pageSize - 1,
				);
			return { data: data || [], total: count || 0 };
		}),

	markRead: protectedProcedure
		.input(z.string().uuid())
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { error } = await supabase
				.from("notifications")
				.update({ is_read: true, read_at: new Date().toISOString() })
				.eq("id", input);
			if (error) throw error;
			return { success: true };
		}),

	markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
		const supabase = await createClient();
		const { error } = await supabase
			.from("notifications")
			.update({ is_read: true, read_at: new Date().toISOString() })
			.eq("user_id", ctx.userId)
			.eq("is_read", false);
		if (error) throw error;
		return { success: true };
	}),
});
