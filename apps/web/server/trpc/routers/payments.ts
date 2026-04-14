import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { protectedProcedure, router, staffProcedure } from "../proxy";

export const paymentsRouter = router({
	getByOrder: protectedProcedure
		.input(z.string().uuid())
		.query(async ({ input }) => {
			const supabase = await createClient();
			const { data } = await supabase
				.from("payments")
				.select("*")
				.eq("order_id", input);
			return data || [];
		}),

	create: staffProcedure
		.input(
			z.object({
				orderId: z.string().uuid(),
				amount: z.number(),
				method: z.enum([
					"cash",
					"qris",
					"bank_transfer",
					"gopay",
					"ovo",
					"dana",
					"shopeepay",
				]),
			}),
		)
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { data, error } = await supabase
				.from("payments")
				.insert({
					order_id: input.orderId,
					amount: input.amount,
					method: input.method,
					status: input.method === "cash" ? "paid" : "pending",
					paid_at: input.method === "cash" ? new Date().toISOString() : null,
				})
				.select()
				.single();
			if (error) throw error;
			return data;
		}),
});
