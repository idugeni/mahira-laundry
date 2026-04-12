import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { managerProcedure, publicProcedure, router } from "../proxy";

export const servicesRouter = router({
  list: publicProcedure
    .input(z.object({ outletId: z.string().uuid().optional() }))
    .query(async ({ input }) => {
      const supabase = await createClient();
      let query = supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (input.outletId) query = query.eq("outlet_id", input.outletId);
      const { data } = await query;
      return data || [];
    }),

  create: managerProcedure
    .input(
      z.object({
        outletId: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        unit: z.enum(["kg", "item", "pasang", "meter"]),
        price: z.number(),
        estimatedDurationHours: z.number().default(24),
        icon: z.string().optional(),
        isExpress: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("services")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    }),

  update: managerProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        price: z.number().optional(),
        isActive: z.boolean().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      const supabase = await createClient();
      const { error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      return { success: true };
    }),
});
