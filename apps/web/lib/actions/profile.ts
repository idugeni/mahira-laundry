"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { error: "Unauthorized" };

	const profileData = {
		full_name: formData.get("full_name") as string,
		phone: formData.get("phone") as string,
		addresses: JSON.parse((formData.get("addresses") as string) || "[]"),
		notification_preferences: JSON.parse(
			(formData.get("notification_preferences") as string) || "{}",
		),
	};

	const { error } = await supabase
		.from("profiles")
		.update(profileData)
		.eq("id", user.id);

	if (error) return { error: error.message };

	revalidatePath("/profil");
	return { success: true };
}

export async function updateAvatar(formData: FormData) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return { error: "Unauthorized" };

		const file = formData.get("avatar");
		if (!file || !(file instanceof File)) return { error: "File tidak valid" };

		const fileExt = file.name.split(".").pop();
		const filePath = `${user.id}/avatar.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, { upsert: true });

		if (uploadError) return { error: uploadError.message };

		const {
			data: { publicUrl },
		} = supabase.storage.from("avatars").getPublicUrl(filePath);

		const { error: dbError } = await supabase
			.from("profiles")
			.update({ avatar_url: publicUrl })
			.eq("id", user.id);

		if (dbError) return { error: dbError.message };

		revalidatePath("/profil");
		revalidatePath("/admin/profil");
		revalidatePath("/customer/profil");

		return { success: true, url: publicUrl };
	} catch (error: unknown) {
		console.error("Update Avatar Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Gagal memperbarui foto profil";
		return { error: errorMessage };
	}
}
