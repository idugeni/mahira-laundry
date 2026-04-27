import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { protectedProcedure, router } from "@/server/trpc/proxy";

export const loyaltyRouter = router({
	getPoints: protectedProcedure.query(async ({ ctx }) => {
		const supabase = await createClient();
		const { data } = await supabase
			.from("profiles")
			.select("loyalty_points, loyalty_tier")
			.eq("id", ctx.userId)
			.single();
		return data;
	}),

	getHistory: protectedProcedure
		.input(
			z.object({
				page: z.number().default(1),
				pageSize: z.number().default(20),
			}),
		)
		.query(async ({ ctx, input }) => {
			const supabase = await createClient();
			const { data, count } = await supabase
				.from("loyalty")
				.select("*", { count: "exact" })
				.eq("user_id", ctx.userId)
				.order("created_at", { ascending: false })
				.range(
					(input.page - 1) * input.pageSize,
					input.page * input.pageSize - 1,
				);
			return { data: data || [], total: count || 0 };
		}),

	redeem: protectedProcedure
		.input(z.object({ points: z.number().min(1), description: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const supabase = await createClient();
			const { data: profile } = await supabase
				.from("profiles")
				.select("loyalty_points")
				.eq("id", ctx.userId)
				.single();

			if (!profile || profile.loyalty_points < input.points) {
				throw new Error("Poin tidak mencukupi");
			}

			const newBalance = profile.loyalty_points - input.points;

			await supabase.from("loyalty").insert({
				user_id: ctx.userId,
				points: -input.points,
				type: "redeem",
				description: input.description,
				balance_after: newBalance,
			});

			await supabase
				.from("profiles")
				.update({ loyalty_points: newBalance })
				.eq("id", ctx.userId);

			return { success: true, newBalance };
		}),
});
