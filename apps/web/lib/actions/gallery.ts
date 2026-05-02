"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

export async function addGalleryItem(
	formData: FormData,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const title = formData.get("title") as string;
		const category = formData.get("category") as string;
		const file = formData.get("image") as File;

		if (!file) throw new Error("File gambar wajib diunggah.");

		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
		const filePath = `items/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from("gallery")
			.upload(filePath, file);

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabase.storage.from("gallery").getPublicUrl(filePath);

		const { error: dbError } = await supabase.from("gallery").insert({
			title,
			category,
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

export async function deleteGalleryItem(
	id: string,
	imageUrl: string,
): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const urlParts = imageUrl.split("/");
		const fileName = urlParts[urlParts.length - 1];
		const filePath = `items/${fileName}`;

		const { error: storageError } = await supabase.storage
			.from("gallery")
			.remove([filePath]);

		// Storage cleanup best-effort — don't block DB deletion

		const { error: dbError } = await supabase
			.from("gallery")
			.delete()
			.eq("id", id);

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
		const supabase = await createClient();

		const { error } = await supabase
			.from("gallery")
			.update({ title: data.title, category: data.category })
			.eq("id", id);

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
