import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
					}
				},
			},
		},
	);
}

export async function getSession() {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
}

export async function getUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

export async function getUserProfile() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	return profile;
}
