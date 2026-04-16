"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const MitraSchema = z.object({
	// Owner Info
	fullName: z.string().min(3),
	email: z.string().email(),
	phone: z.string().min(10),
	password: z.string().min(8).optional(),

	// Outlet Info
	outletName: z.string().min(3),
	outletSlug: z
		.string()
		.min(3)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must be lowercase and only contain numbers and hyphens",
		),
	outletAddress: z.string().min(5),
	franchiseFee: z.number().min(0).max(100),
});

export async function registerMitra(formData: any) {
	try {
		const validated = MitraSchema.parse(formData);
		const admin = createAdminClient();

		// 1. Create Outlet first
		const { data: outlet, error: outletError } = await admin
			.from("outlets")
			.insert({
				name: validated.outletName,
				slug: validated.outletSlug,
				address: validated.outletAddress,
				is_franchise: true,
				franchise_fee: validated.franchiseFee,
				operating_hours: {
					weekday: "07:00-21:00",
					weekend: "08:00-20:00",
				},
			})
			.select()
			.single();

		if (outletError) {
			if (outletError.code === "23505")
				throw new Error("Slug outlet sudah digunakan. Coba slug lain.");
			throw outletError;
		}

		// 2. Create Auth User (Manager role)
		const { data: authUser, error: authError } =
			await admin.auth.admin.createUser({
				email: validated.email,
				password: validated.password || "MitraMahira12!@",
				email_confirm: true,
				user_metadata: {
					full_name: validated.fullName,
					role: "manager",
					phone: validated.phone,
				},
			});

		if (authError) {
			// Cleanup: Delete the outlet if user creation fails
			await admin.from("outlets").delete().eq("id", outlet.id);
			throw authError;
		}

		// 3. Update profile with outlet_id
		// Note: Trigger on_auth_user_created already creates the profile entry
		if (authUser.user) {
			const { error: profileError } = await admin
				.from("profiles")
				.update({
					outlet_id: outlet.id,
					role: "manager",
				})
				.eq("id", authUser.user.id);

			if (profileError) {
				console.error("Error linking mitra to outlet:", profileError);
			} else {
				// 4. Send Welcome Notification
				await admin.from("notifications").insert({
					user_id: authUser.user.id,
					type: "system",
					title: "Selamat Datang Mitra Mahira!",
					body: `Selamat bergabung di ekosistem Mahira Laundry. Outlet ${validated.outletName} Anda telah berhasil diinisialisasi.`,
					data: { outlet_id: outlet.id },
				});
			}
		}

		revalidatePath("/franchise");
		revalidatePath("/outlet");
		revalidatePath("/admin/outlet");

		return { success: true, outletId: outlet.id };
	} catch (error: any) {
		console.error("Mitra registration failed:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: error.issues[0].message };
		}
		return {
			success: false,
			error: error.message || "Gagal mendaftarkan mitra baru.",
		};
	}
}
