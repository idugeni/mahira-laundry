import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { managerProcedure, router } from "../proxy";

export const inventoryRouter = router({
	list: managerProcedure
		.input(z.object({ outletId: z.string().uuid() }))
		.query(async ({ input }) => {
			const supabase = await createClient();
			const { data } = await supabase
				.from("inventory")
				.select("*")
				.eq("outlet_id", input.outletId)
				.order("name");
			return data || [];
		}),

	create: managerProcedure
		.input(
			z.object({
				outletId: z.string().uuid(),
				name: z.string(),
				sku: z.string().optional(),
				category: z.string().optional(),
				quantity: z.number(),
				unit: z.string(),
				minStock: z.number().default(0),
				costPerUnit: z.number().default(0),
				supplier: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { data, error } = await supabase
				.from("inventory")
				.insert({
					outlet_id: input.outletId,
					name: input.name,
					sku: input.sku,
					category: input.category,
					quantity: input.quantity,
					unit: input.unit,
					min_stock: input.minStock,
					cost_per_unit: input.costPerUnit,
					supplier: input.supplier,
				})
				.select()
				.single();
			if (error) throw error;
			return data;
		}),

	restock: managerProcedure
		.input(z.object({ id: z.string().uuid(), addQuantity: z.number() }))
		.mutation(async ({ input }) => {
			const supabase = await createClient();
			const { data: item } = await supabase
				.from("inventory")
				.select("quantity")
				.eq("id", input.id)
				.single();
			if (!item) throw new Error("Item tidak ditemukan");

			const { error } = await supabase
				.from("inventory")
				.update({
					quantity: Number(item.quantity) + input.addQuantity,
					last_restocked_at: new Date().toISOString(),
				})
				.eq("id", input.id);
			if (error) throw error;
			return { success: true };
		}),
});
