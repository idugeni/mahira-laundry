import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getDashboardUrl } from "@/lib/utils";

const roleProtectedPaths = [
	{ path: "/admin", roles: ["superadmin"] },
	{ path: "/manager", roles: ["manager"] },
	{ path: "/kasir", roles: ["kasir"] },
	{ path: "/kurir", roles: ["kurir"] },
	{ path: "/customer", roles: ["customer"] },
] as const;

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
	const protectedPaths = ["/customer", "/admin", "/manager", "/kasir", "/kurir"];
	const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	if (!user && isProtectedPath) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	let profileRole: string | null = null;
	if (user) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		profileRole = profile?.role ?? null;
	}

	if (user && isProtectedPath) {
		const protectedRoute = roleProtectedPaths.find(({ path }) =>
			request.nextUrl.pathname.startsWith(path),
		);

		if (protectedRoute && !protectedRoute.roles.some((role) => role === profileRole)) {
			const dashboardUrl = getDashboardUrl(profileRole);
			const targetUrl = request.nextUrl.pathname.startsWith(dashboardUrl)
				? "/customer"
				: dashboardUrl;
			if (!request.nextUrl.pathname.startsWith(targetUrl)) {
				const url = request.nextUrl.clone();
				url.pathname = targetUrl;
				url.search = "";
				return NextResponse.redirect(url);
			}
		}
	}

	// Redirect logged in users from auth pages
	const authPaths = ["/login", "/register", "/lupa-password"];
	const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	if (user && isAuthPath) {
		const targetUrl = getDashboardUrl(profileRole);

		const url = request.nextUrl.clone();
		url.pathname = targetUrl;
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
