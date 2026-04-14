"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

export type OutletInput = {
	id?: string;
	name: string;
	slug: string;
	address: string;
	phone?: string;
	image_url?: string;
	is_active?: boolean;
	is_franchise?: boolean;
	franchise_fee?: number;
};

export async function upsertOutlet(data: OutletInput): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const outletData = {
			name: data.name,
			slug: data.slug,
			address: data.address,
			phone: data.phone,
			image_url: data.image_url,
			is_active: data.is_active ?? true,
			is_franchise: data.is_franchise ?? false,
			franchise_fee: data.franchise_fee ?? 0,
			updated_at: new Date().toISOString(),
		};

		let result;
		if (data.id) {
			// Update
			result = await supabase
				.from("outlets")
				.update(outletData)
				.eq("id", data.id);
		} else {
			// Create
			result = await supabase.from("outlets").insert({
				...outletData,
				operating_hours: {
					weekday: "07:00-21:00",
					weekend: "08:00-20:00",
				},
			});
		}

		if (result.error) throw result.error;

		revalidatePath("/outlet");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		console.error("Outlet action failed:", err);
		return { success: false, error: err.message };
	}
}

export async function deleteOutlet(id: string): Promise<ActionResponse> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("outlets").delete().eq("id", id);
		if (error) throw error;

		revalidatePath("/outlet");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		console.error("Delete outlet failed:", err);
		return { success: false, error: err.message };
	}
}

export async function uploadOutletImage(
	outletId: string,
	formData: FormData,
): Promise<ActionResponse<{ url: string }>> {
	try {
		const supabase = await createClient();
		const file = formData.get("image") as File;
		if (!file) throw new Error("File tidak ditemukan");

		const fileExt = file.name.split(".").pop();
		const filePath = `outlets/${outletId}/${Date.now()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("outlet-images")
			.upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabase.storage.from("outlet-images").getPublicUrl(filePath);

		// If outletId exists, update the db immediately
		if (outletId !== "temp") {
			const { error: updateError } = await supabase
				.from("outlets")
				.update({ image_url: publicUrl })
				.eq("id", outletId);
			if (updateError) throw updateError;
		}

		return { success: true, data: { url: publicUrl } };
	} catch (error) {
		const err = error as Error;
		console.error("Upload image failed:", err);
		return { success: false, error: err.message };
	}
}
