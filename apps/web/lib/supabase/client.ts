import { createBrowserClient } from "@supabase/ssr";

let supabase: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
	if (supabase) return supabase;

	supabase = createBrowserClient(
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	);

	return supabase;
}
