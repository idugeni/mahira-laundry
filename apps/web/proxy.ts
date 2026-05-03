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

const publicPaths = [
	"/",
	"/layanan",
	"/paket-usaha",
	"/galeri",
	"/faq",
	"/tentang",
	"/lokasi",
	"/lacak",
	"/cari",
	"/privacy",
	"/terms",
	"/cookies",
	"/sitemap",
	"/sitemap.xml",
	"/robots.txt",
	"/llms.txt",
];

const protectedPaths = ["/customer", "/admin", "/manager", "/kasir", "/kurir"];
const authPaths = ["/login", "/register", "/lupa-password"];

function isPathMatch(pathname: string, paths: readonly string[]) {
	return paths.some((path) => (path === "/" ? pathname === "/" : pathname.startsWith(path)));
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const userAgent = request.headers.get("user-agent") || "";

	// 1. DETEKSI BOT & CRAWLER (Penting untuk OG Image & Vercel Preview)
	// Menambahkan pengecekan bot agar Facebook, WhatsApp, Twitter, LinkedIn, Telegram, Discord, dan Vercel Screenshot tidak di-redirect ke login
	const isBot =
		/facebookexternalhit|Facebot|Vercelbot|Twitterbot|Twitter|Slackbot|Slackbot-LinkExpanding|WhatsApp|BingPreview|Googlebot|meta-external|facebook|telegram|discord|linkedin|bot|crawler|spider/i.test(
			userAgent,
		);

	const isPublicPath = isPathMatch(pathname, publicPaths);
	const isProtectedPath = isPathMatch(pathname, protectedPaths);
	const isAuthPath = isPathMatch(pathname, authPaths);

	// 2. BYPASS UNTUK PUBLIC & BOT
	// Jika bot atau halaman publik, langsung berikan akses tanpa menyentuh Supabase
	if (isBot || isPublicPath) {
		return NextResponse.next();
	}

	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL || "",
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
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

	// Pastikan menggunakan getUser() bukan getSession() untuk keamanan middleware
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// 3. LOGIKA PROTECTED PATHS
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

	// 4. LOGIKA ROLE PROTECTION
	if (user && isProtectedPath) {
		const protectedRoute = roleProtectedPaths.find(({ path }) => pathname.startsWith(path));

		if (protectedRoute && !protectedRoute.roles.some((role) => role === profileRole)) {
			const dashboardUrl = getDashboardUrl(profileRole);

			const targetUrl = pathname.startsWith(dashboardUrl) ? "/customer" : dashboardUrl;

			if (!pathname.startsWith(targetUrl)) {
				const url = request.nextUrl.clone();
				url.pathname = targetUrl;
				url.search = "";
				return NextResponse.redirect(url);
			}
		}
	}

	// 5. REDIRECT JIKA SUDAH AUTH TAPI AKSES HALAMAN LOGIN
	if (user && isAuthPath) {
		const targetUrl = getDashboardUrl(profileRole);

		const url = request.nextUrl.clone();
		url.pathname = targetUrl;
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
	],
};
