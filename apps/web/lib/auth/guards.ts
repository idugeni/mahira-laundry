import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export const STAFF_ROLES = ["kasir", "kurir", "manager", "superadmin"] as const;
export const MANAGER_ROLES = ["manager", "superadmin"] as const;
export const SUPERADMIN_ROLES = ["superadmin"] as const;

type RoleTuple = readonly UserRole[];
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface AuthProfile {
	role: UserRole;
	outlet_id?: string | null;
	full_name?: string | null;
}

export interface AuthGuardContext {
	supabase: SupabaseServerClient;
	user: User;
	profile: AuthProfile;
	role: UserRole;
	outletId: string | null;
}

export async function requireUser(): Promise<AuthGuardContext> {
	const supabase = await createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		throw new Error("Unauthorized");
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("role, outlet_id, full_name")
		.eq("id", user.id)
		.single();

	if (profileError || !profile?.role) {
		throw new Error("Profil pengguna tidak ditemukan.");
	}

	const role = profile.role as UserRole;

	return {
		supabase,
		user,
		profile: {
			role,
			outlet_id: profile.outlet_id,
			full_name: profile.full_name,
		},
		role,
		outletId: profile.outlet_id ?? null,
	};
}

export async function requireRole(
	allowedRoles: RoleTuple,
	message = "Akses ditolak.",
): Promise<AuthGuardContext> {
	const context = await requireUser();
	if (!allowedRoles.includes(context.role)) {
		throw new Error(message);
	}

	return context;
}

export function canAccessOutlet(context: AuthGuardContext, outletId: string): boolean {
	return context.role === "superadmin" || context.outletId === outletId;
}

export function requireOutletAccess(context: AuthGuardContext, outletId: string) {
	if (!canAccessOutlet(context, outletId)) {
		throw new Error("Akses outlet ditolak.");
	}
}

export function isStaffRole(role: UserRole | string | null | undefined): boolean {
	if (!role) return false;
	return STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number]);
}
