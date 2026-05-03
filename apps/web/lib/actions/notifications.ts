"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, SUPERADMIN_ROLES } from "@/lib/auth/guards";
import type { ActionResponse } from "@/lib/types";

const BroadcastNotificationSchema = z.object({
	title: z.string().min(1).max(160),
	body: z.string().min(1).max(1_000),
	type: z.enum(["promotion", "system"]),
	targetRole: z
		.enum(["customer", "kasir", "kurir", "manager", "superadmin"])
		.optional()
		.or(z.literal("")),
});

const DirectNotificationSchema = z.object({
	userId: z.string().uuid(),
	title: z.string().min(1).max(160),
	body: z.string().min(1).max(1_000),
	type: z.string().min(1).max(80),
});

export async function broadcastNotification(data: {
	title: string;
	body: string;
	type: "promotion" | "system";
	targetRole?: string;
}): Promise<ActionResponse<void>> {
	try {
		const parsed = BroadcastNotificationSchema.parse(data);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengirim notifikasi.",
		);

		let query = supabase.from("profiles").select("id");
		if (parsed.targetRole) {
			query = query.eq("role", parsed.targetRole);
		}

		const { data: users, error: userError } = await query;
		if (userError) throw userError;

		if (!users || users.length === 0) {
			return { success: true };
		}

		const notifications = users.map((u) => ({
			user_id: u.id,
			title: parsed.title,
			body: parsed.body,
			type: parsed.type,
			is_read: false,
		}));

		const { error: insertError } = await supabase.from("notifications").insert(notifications);

		if (insertError) throw insertError;

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}

export async function sendDirectNotification(data: {
	userId: string;
	title: string;
	body: string;
	type: string;
}): Promise<ActionResponse<void>> {
	try {
		const parsed = DirectNotificationSchema.parse(data);
		const { supabase } = await requireRole(
			SUPERADMIN_ROLES,
			"Akses superadmin diperlukan untuk mengirim notifikasi.",
		);
		const { error } = await supabase.from("notifications").insert({
			user_id: parsed.userId,
			title: parsed.title,
			body: parsed.body,
			type: parsed.type,
		});

		if (error) throw error;
		return { success: true };
	} catch (error) {
		const err = error as Error;
		return { success: false, error: err.message };
	}
}
