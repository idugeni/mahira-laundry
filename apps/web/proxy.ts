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

const publicPaths = ["/", "/layanan", "/paket-usaha", "/galeri", "/faq", "/tentang", "/lokasi", "/lacak", "/cari", "/privacy", "/terms", "/cookies", "/sitemap", "/llms.txt"];
const protectedPaths = ["/customer", "/admin", "/manager", "/kasir", "/kurir"];
const authPaths = ["/login", "/register", "/lupa-password"];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isPublicPath = publicPaths.some(
		(p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)),
	);

	// For public pages, only refresh the session cookie without blocking
	if (isPublicPath) {
		let supabaseResponse = NextResponse.next({ request });

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
						supabaseResponse = NextResponse.next({ request });
						for (const { name, value, options } of cookiesToSet) {
							supabaseResponse.cookies.set(name, value, options);
						}
					},
				},
			},
		);

		// Just refresh the session, don't block or redirect
		await supabase.auth.getUser();
		return supabaseResponse;
	}

	let supabaseResponse = NextResponse.next({ request });

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
					supabaseResponse = NextResponse.next({ request });
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

	const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

	if (!user && isProtectedPath) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", pathname);
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
			pathname.startsWith(path),
		);

		if (protectedRoute && !protectedRoute.roles.some((role) => role === profileRole)) {
			const dashboardUrl = getDashboardUrl(profileRole);
			const targetUrl = pathname.startsWith(dashboardUrl)
				? "/customer"
				: dashboardUrl;
			if (!pathname.startsWith(targetUrl)) {
				const url = request.nextUrl.clone();
				url.pathname = targetUrl;
				url.search = "";
				return NextResponse.redirect(url);
			}
		}
	}

	// Redirect logged in users from auth pages
	const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

	if (user && isAuthPath) {
		const targetUrl = getDashboardUrl(profileRole);

		const url = request.nextUrl.clone();
		url.pathname = targetUrl;
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
