import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client
 *
 * Menggunakan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — format key baru Supabase.
 * Hanya gunakan di Server Actions atau file sisi server.
 */
export function createAdminClient() {
	// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

	return createClient(supabaseUrl, supabaseKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
