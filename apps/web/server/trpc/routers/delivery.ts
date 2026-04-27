import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { router, staffProcedure } from "@/server/trpc/proxy";

export const deliveryRouter = router({
	listByKurir: staffProcedure.query(async ({ ctx }) => {
		const supabase = await createClient();
		const { data } = await supabase
			.from("delivery")
			.select(
				"*, orders(order_number, customer_id, profiles(full_name, phone))",
			)
			.eq("courier_id", ctx.userId)
			.in("status", ["assigned", "on_the_way", "arrived"])
			.order("created_at", { ascending: false });
		return data || [];
	}),

	updateLocation: staffProcedure
		.input(
			z.object({
				deliveryId: z.string().uuid(),
				lat: z.number(),
				lng: z.number(),
			}),
		)
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { error } = await supabase
				.from("delivery")
				.update({ current_lat: input.lat, current_lng: input.lng })
				.eq("id", input.deliveryId);
			if (error) throw error;
			return { success: true };
		}),

	complete: staffProcedure
		.input(
			z.object({
				deliveryId: z.string().uuid(),
				photoUrl: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { error } = await supabase
				.from("delivery")
				.update({
					status: "completed",
					delivered_at: new Date().toISOString(),
					photo_proof_url: input.photoUrl,
				})
				.eq("id", input.deliveryId);
			if (error) throw error;
			return { success: true };
		}),
});
