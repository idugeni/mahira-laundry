"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, SUPERADMIN_ROLES } from "@/lib/auth/guards";
import type { ActionResponse } from "@/lib/types";

const GalleryMetadataSchema = z.object({
	title: z.string().min(1).max(160),
	category: z.string().min(1).max(80),
});

export async function addGalleryItem(formData: FormData): Promise<ActionResponse> {
	try {
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengelola galeri.",
		);

		const metadata = GalleryMetadataSchema.parse({
			title: formData.get("title"),
			category: formData.get("category"),
		});
		const file = formData.get("image") as File;

		if (!file) throw new Error("File gambar wajib diunggah.");
		if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
		if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 5MB.");

		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
		const filePath = `items/${fileName}`;

		const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabase.storage.from("gallery").getPublicUrl(filePath);

		const { error: dbError } = await supabase.from("gallery").insert({
			title: metadata.title,
			category: metadata.category,
			image_url: publicUrl,
		});

		if (dbError) {
			await supabase.storage.from("gallery").remove([filePath]);
			throw dbError;
		}

		revalidatePath("/", "layout");
		revalidatePath("/galeri");
		revalidatePath("/admin/galeri");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function deleteGalleryItem(id: string, imageUrl: string): Promise<ActionResponse> {
	try {
		const parsedId = z.string().uuid().parse(id);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengelola galeri.",
		);

		const urlParts = imageUrl.split("/");
		const fileName = urlParts[urlParts.length - 1];
		const filePath = `items/${fileName}`;

		await supabase.storage.from("gallery").remove([filePath]);

		// Storage cleanup best-effort — don't block DB deletion

		const { error: dbError } = await supabase.from("gallery").delete().eq("id", parsedId);

		if (dbError) throw dbError;

		revalidatePath("/", "layout");
		revalidatePath("/galeri");
		revalidatePath("/admin/galeri");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function updateGalleryItem(
	id: string,
	data: { title: string; category: string },
): Promise<ActionResponse> {
	try {
		const parsedId = z.string().uuid().parse(id);
		const metadata = GalleryMetadataSchema.parse(data);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengelola galeri.",
		);

		const { error } = await supabase
			.from("gallery")
			.update({ title: metadata.title, category: metadata.category })
			.eq("id", parsedId);

		if (error) throw error;

		revalidatePath("/", "layout");
		revalidatePath("/galeri");
		revalidatePath("/admin/galeri");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
