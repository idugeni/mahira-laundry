"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

export async function upsertMachine(data: {
	id?: string;
	outletId: string;
	name: string;
	type: "washer" | "dryer" | "steamer" | "other";
	status: "available" | "in_use" | "maintenance" | "broken";
	capacityKg?: number;
	brand?: string;
}): Promise<ActionResponse<Record<string, unknown>>> {
	try {
		const supabase = await createClient();

		const machineData = {
			outlet_id: data.outletId,
			name: data.name,
			type: data.type,
			status: data.status,
			capacity_kg: data.capacityKg,
			brand: data.brand,
			updated_at: new Date().toISOString(),
		};

		let result: {
			data: Record<string, unknown> | null;
			error: { message: string } | null;
		};
		if (data.id) {
			result = await supabase
				.from("machines")
				.update(machineData)
				.eq("id", data.id)
				.select()
				.single();
		} else {
			result = await supabase
				.from("machines")
				.insert(machineData)
				.select()
				.single();
		}

		if (result.error) throw result.error;

		revalidatePath("/admin/outlet");
		return { success: true, data: result.data ?? undefined };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function deleteMachine(id: string): Promise<ActionResponse<void>> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("machines").delete().eq("id", id);
		if (error) throw error;
		revalidatePath("/admin/outlet");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
