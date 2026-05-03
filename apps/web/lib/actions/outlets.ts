"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, SUPERADMIN_ROLES } from "@/lib/auth/guards";
import type { ActionResponse } from "@/lib/types";
import { invalidateCache } from "@/lib/upstash/cache";

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

const OutletInputSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1).max(160),
	slug: z.string().min(1).max(160),
	address: z.string().min(5).max(1_000),
	phone: z.string().max(40).optional(),
	image_url: z.preprocess(
		(value) => (value === "" ? undefined : value),
		z.string().url().optional(),
	),
	is_active: z.boolean().optional(),
	is_franchise: z.boolean().optional(),
	franchise_fee: z.number().nonnegative().max(1_000_000_000).optional(),
});

export async function upsertOutlet(data: OutletInput): Promise<ActionResponse> {
	try {
		const parsed = OutletInputSchema.parse(data);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengelola outlet.",
		);

		const outletData = {
			name: parsed.name,
			slug: parsed.slug,
			address: parsed.address,
			phone: parsed.phone,
			image_url: parsed.image_url,
			is_active: parsed.is_active ?? true,
			is_franchise: parsed.is_franchise ?? false,
			franchise_fee: parsed.franchise_fee ?? 0,
			updated_at: new Date().toISOString(),
		};

		let result: { error: { message: string } | null };
		if (parsed.id) {
			result = await supabase.from("outlets").update(outletData).eq("id", parsed.id);
		} else {
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
		revalidatePath("/admin/outlet");
		await invalidateCache("outlets:*");
		await invalidateCache("vouchers:*");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function deleteOutlet(id: string): Promise<ActionResponse> {
	try {
		const parsedId = z.string().uuid().parse(id);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengelola outlet.",
		);
		const { error } = await supabase.from("outlets").delete().eq("id", parsedId);
		if (error) throw error;

		revalidatePath("/outlet");
		revalidatePath("/admin/outlet");
		await invalidateCache("vouchers:*");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function uploadOutletImage(
	outletId: string,
	formData: FormData,
): Promise<ActionResponse<{ url: string }>> {
	try {
		const parsedOutletId = outletId === "temp" ? outletId : z.string().uuid().parse(outletId);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengelola outlet.",
		);
		const file = formData.get("image") as File;
		if (!file) throw new Error("File tidak ditemukan");
		if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
		if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 5MB.");

		const fileExt = file.name.split(".").pop();
		const filePath = `outlets/${parsedOutletId}/${Date.now()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("outlet-images")
			.upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabase.storage.from("outlet-images").getPublicUrl(filePath);

		if (parsedOutletId !== "temp") {
			const { error: updateError } = await supabase
				.from("outlets")
				.update({ image_url: publicUrl })
				.eq("id", parsedOutletId);
			if (updateError) throw updateError;
		}

		return { success: true, data: { url: publicUrl } };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
