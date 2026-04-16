"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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

export async function upsertService(
	data: ServiceInput,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const serviceData = {
			outlet_id: data.outlet_id,
			name: data.name,
			slug: data.slug,
			description: data.description,
			category: data.category || "kiloan",
			unit: data.unit,
			price: data.price,
			estimated_duration_hours: data.estimated_duration_hours || 24,
			icon: data.icon || "🧺",
			features: data.features || [],
			is_active: data.is_active ?? true,
			is_express: data.is_express ?? false,
			is_featured: data.is_featured ?? false,
			updated_at: new Date().toISOString(),
		};

		let result: { error: { message: string } | null };
		if (data.id) {
			result = await supabase
				.from("services")
				.update(serviceData)
				.eq("id", data.id);
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
		console.error("Service action failed:", err);
		return { success: false, error: err.message };
	}
}

export async function deleteService(id: string): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("services").delete().eq("id", id);
		if (error) throw error;

		revalidatePath("/admin/layanan");
		revalidatePath("/kelola-layanan");
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		console.error("Delete service failed:", err);
		return { success: false, error: err.message };
	}
}
