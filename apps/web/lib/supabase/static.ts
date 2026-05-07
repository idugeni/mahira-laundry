import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client without cookies for static page generation
 * Use this for sitemap, robots, and other static routes that must be generated at build time
 */
export function createStaticClient() {
	return createClient(
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	);
}
