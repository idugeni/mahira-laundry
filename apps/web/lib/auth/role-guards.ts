import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export async function protectPage(allowedRoles: readonly UserRole[]) {
	const profile = await getUserProfile();

	if (!profile) {
		redirect("/login");
	}

	if (!allowedRoles.includes(profile.role as UserRole)) {
		// Redirect based on current role if accessing wrong area
		switch (profile.role) {
			case "superadmin":
				redirect("/admin");
			case "manager":
				redirect("/manager");
			case "kasir":
				redirect("/kasir");
			case "kurir":
				redirect("/kurir");
			default:
				redirect("/customer");
		}
	}

	return profile;
}
