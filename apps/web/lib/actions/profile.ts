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
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { error: "Unauthorized" };

	const file = formData.get("avatar") as File;
	if (!file) return { error: "File tidak ditemukan" };

	const fileExt = file.name.split(".").pop();
	const filePath = `${user.id}/avatar.${fileExt}`;

	const { error: uploadError } = await supabase.storage
		.from("avatars")
		.upload(filePath, file, { upsert: true });

	if (uploadError) return { error: uploadError.message };

	const {
		data: { publicUrl },
	} = supabase.storage.from("avatars").getPublicUrl(filePath);

	await supabase
		.from("profiles")
		.update({ avatar_url: publicUrl })
		.eq("id", user.id);

	revalidatePath("/profil");
	return { success: true, url: publicUrl };
}
