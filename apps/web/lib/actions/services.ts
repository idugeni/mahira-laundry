"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MANAGER_ROLES, requireRole } from "@/lib/auth/guards";
import type { ActionResponse } from "@/lib/types";

export type ServiceInput = {
	id?: string;
	outlet_id: string;
	name: string;
	slug: string;
	description?: string;
	category?: string;
	unit: string;
	price: number;
	estimated_duration_hours?: number;
	icon?: string;
	features?: string[];
	is_active?: boolean;
	is_express?: boolean;
	is_featured?: boolean;
};

const ServiceInputSchema = z.object({
	id: z.string().uuid().optional(),
	outlet_id: z.string().uuid(),
	name: z.string().min(1).max(120),
	slug: z.string().min(1).max(140),
	description: z.string().max(1_000).optional(),
	category: z.string().max(80).optional(),
	unit: z.enum(["kg", "item", "pasang", "meter"]),
	price: z.number().nonnegative().max(100_000_000),
	estimated_duration_hours: z.number().positive().max(720).optional(),
	icon: z.string().max(16).optional(),
	features: z.array(z.string().max(160)).max(20).optional(),
	is_active: z.boolean().optional(),
	is_express: z.boolean().optional(),
	is_featured: z.boolean().optional(),
});

export async function upsertService(data: ServiceInput): Promise<ActionResponse> {
	try {
		const parsed = ServiceInputSchema.parse(data);
		const { supabase, role, outletId } = await requireRole(
			MANAGER_ROLES,
			"Akses manager diperlukan untuk mengelola layanan.",
		);

		if (role !== "superadmin" && outletId !== parsed.outlet_id) {
			return { success: false, error: "Akses outlet ditolak." };
		}

		const serviceData = {
			outlet_id: parsed.outlet_id,
			name: parsed.name,
			slug: parsed.slug,
			description: parsed.description,
			category: parsed.category || "kiloan",
			unit: parsed.unit,
			price: parsed.price,
			estimated_duration_hours: parsed.estimated_duration_hours || 24,
			icon: parsed.icon || "🧺",
			features: parsed.features || [],
			is_active: parsed.is_active ?? true,
			is_express: parsed.is_express ?? false,
			is_featured: parsed.is_featured ?? false,
			updated_at: new Date().toISOString(),
		};

		let result: { error: { message: string } | null };
		if (parsed.id) {
			result = await supabase.from("services").update(serviceData).eq("id", parsed.id);
		} else {
			result = await supabase.from("services").insert(serviceData);
		}

		if (result.error) throw result.error;

		revalidatePath("/admin/layanan");
		revalidatePath("/kelola-layanan");
		revalidatePath("/manager");
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function deleteService(id: string): Promise<ActionResponse> {
	try {
		const parsedId = z.string().uuid().parse(id);
		const { supabase, role, outletId } = await requireRole(
			MANAGER_ROLES,
			"Akses manager diperlukan untuk mengelola layanan.",
		);
		let query = supabase.from("services").delete().eq("id", parsedId);
		if (role !== "superadmin" && !outletId) {
			return { success: false, error: "Akses outlet ditolak." };
		}
		if (role !== "superadmin" && outletId) {
			query = query.eq("outlet_id", outletId);
		}
		const { error } = await query;
		if (error) throw error;

		revalidatePath("/admin/layanan");
		revalidatePath("/kelola-layanan");
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
