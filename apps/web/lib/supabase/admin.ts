import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client
 *
 * SANGAT PENTING: Jangan gunakan client ini di komponen sisi Client.
 * Hanya gunakan di Server Actions atau file sisi server untuk operasi
 * yang membutuhkan hak akses penuh (Service Role), seperti manajemen user.
 */
export function createAdminClient() {
	// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

	if (!supabaseServiceKey) {
		throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in env!");
	}

	return createClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
