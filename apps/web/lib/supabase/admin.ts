import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client
 *
 * Menggunakan secret key baru Supabase (`sb_secret_...`) dan hanya boleh dipakai
 * di Server Actions/file server setelah authorization aplikasi dilakukan.
 */
export function createAdminClient() {
	// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey = process.env.SUPABASE_SECRET_KEY;

	if (!supabaseKey) {
		throw new Error(
			"SUPABASE_SECRET_KEY wajib diset untuk operasi admin Supabase.",
		);
	}

	return createClient(supabaseUrl, supabaseKey, {
		auth: {
			autoRefreshToken: false,
			detectSessionInUrl: false,
			persistSession: false,
		},
	});
}
