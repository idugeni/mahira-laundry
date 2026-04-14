"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResponse } from "@/lib/types";

export async function broadcastNotification(data: {
	title: string;
	body: string;
	type: "promotion" | "system";
	targetRole?: string;
}): Promise<ActionResponse<void>> {
	try {
		const supabase = await createClient();

		// Get target users
		let query = supabase.from("profiles").select("id");
		if (data.targetRole) {
			query = query.eq("role", data.targetRole);
		}

		const { data: users, error: userError } = await query;
		if (userError) throw userError;

		if (!users || users.length === 0) {
			return { success: true };
		}

		// Insert notifications map
		const notifications = users.map((u) => ({
			user_id: u.id,
			title: data.title,
			body: data.body,
			type: data.type,
			is_read: false,
		}));

		const { error: insertError } = await supabase
			.from("notifications")
			.insert(notifications);

		if (insertError) throw insertError;

		revalidatePath("/");
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function sendDirectNotification(data: {
	userId: string;
	title: string;
	body: string;
	type: string;
}): Promise<ActionResponse<void>> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("notifications").insert({
			user_id: data.userId,
			title: data.title,
			body: data.body,
			type: data.type,
		});

		if (error) throw error;
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}
