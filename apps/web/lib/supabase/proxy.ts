import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getDashboardUrl } from "@/lib/utils";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: env vars are required and validated at startup
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({
						request,
					});
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Protect authenticated routes
	const protectedPaths = [
		"/customer",
		"/admin",
		"/manager",
		"/kasir",
		"/kurir",
	];
	const isProtectedPath = protectedPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path),
	);

	if (!user && isProtectedPath) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	// Redirect logged in users from auth pages
	const authPaths = ["/login", "/register", "/lupa-password"];
	const isAuthPath = authPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path),
	);

	if (user && isAuthPath) {
		let targetUrl = "/customer";

		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		targetUrl = getDashboardUrl(profile?.role);

		const url = request.nextUrl.clone();
		url.pathname = targetUrl;
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
