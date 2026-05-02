import { type Duration, Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// ─── Konstanta ────────────────────────────────────────────────────────────────

/** Prefix namespace untuk semua kunci rate-limit di Redis. */
const NS = "mahira:ratelimit" as const;

/**
 * Durasi timeout (ms) untuk operasi Redis.
 * Jika Redis tidak merespons dalam waktu ini, request diteruskan (fail-open).
 */
const REDIS_TIMEOUT_MS = 3_000;

// ─── Tipe ─────────────────────────────────────────────────────────────────────

type LimitResult = Awaited<ReturnType<Ratelimit["limit"]>>;

type LimiterOpts = Omit<ConstructorParameters<typeof Ratelimit>[0], "redis" | "ephemeralCache">;

// ─── Redis Singleton ──────────────────────────────────────────────────────────

/**
 * Instance Redis dari environment variable.
 * Jika variabel tidak tersedia (misalnya saat testing lokal), bernilai null
 * dan seluruh limiter akan memakai noopLimiter (fail-open).
 */
const redis: Redis | null =
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
		? new Redis({
				url: process.env.UPSTASH_REDIS_REST_URL,
				token: process.env.UPSTASH_REDIS_REST_TOKEN,
			})
		: null;

// ─── Noop Limiter ─────────────────────────────────────────────────────────────

/**
 * Limiter palsu yang selalu mengizinkan request.
 * Dipakai saat koneksi Redis tidak tersedia (development / test).
 * Dengan demikian kode consumer tidak perlu mengecek apakah limiter aktif.
 */
function createNoopLimiter(): Pick<Ratelimit, "limit"> {
	return {
		limit: async () => ({
			success: true,
			pending: Promise.resolve(),
			remaining: Number.MAX_SAFE_INTEGER,
			limit: Number.MAX_SAFE_INTEGER,
			reset: Date.now() + 60_000,
		}),
	};
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Membuat instance Ratelimit dengan Redis jika tersedia,
 * atau noopLimiter jika tidak.
 *
 * - `ephemeralCache` diaktifkan untuk memangkas round-trip Redis
 *   pada identifier yang sama dalam satu window.
 * - `timeout` mencegah Redis yang lambat / down memblokir request;
 *   jika timeout tercapai, request diteruskan (fail-open).
 * - `analytics` mengirim data ke Upstash untuk monitoring di dashboard.
 */
function createLimiter(opts: LimiterOpts): Pick<Ratelimit, "limit"> {
	if (!redis) {
		if (process.env.NODE_ENV === "production") {
			// Redis unavailable — limiter running in noop mode
		}
		return createNoopLimiter();
	}

	return new Ratelimit({
		...opts,
		redis,
		ephemeralCache: new Map(),
		timeout: REDIS_TIMEOUT_MS,
		analytics: true,
	});
}

// ─── Limiter Instances ────────────────────────────────────────────────────────

/**
 * Untuk endpoint publik tanpa autentikasi.
 * Default: 10 req / 10 detik (sliding window).
 * Override via RATE_LIMIT_PUBLIC_REQ dan RATE_LIMIT_PUBLIC_WINDOW_S.
 */
export const publicApiLimiter = createLimiter({
	limiter: Ratelimit.slidingWindow(
		Number(process.env.RATE_LIMIT_PUBLIC_REQ ?? 10),
		`${process.env.RATE_LIMIT_PUBLIC_WINDOW_S ?? 10} s` as Duration,
	),
	prefix: `${NS}:public`,
});

/**
 * Untuk endpoint autentikasi (login, register, reset password).
 * Default: 5 req / 60 detik — lebih ketat untuk mencegah brute-force.
 */
export const authLimiter = createLimiter({
	limiter: Ratelimit.slidingWindow(
		Number(process.env.RATE_LIMIT_AUTH_REQ ?? 5),
		`${process.env.RATE_LIMIT_AUTH_WINDOW_S ?? 60} s` as Duration,
	),
	prefix: `${NS}:auth`,
});

/**
 * Untuk endpoint pengiriman form (kontak, feedback, dll).
 * Default: 3 req / 60 detik — mencegah spam form.
 */
export const formLimiter = createLimiter({
	limiter: Ratelimit.slidingWindow(
		Number(process.env.RATE_LIMIT_FORM_REQ ?? 3),
		`${process.env.RATE_LIMIT_FORM_WINDOW_S ?? 60} s` as Duration,
	),
	prefix: `${NS}:form`,
});

/**
 * Untuk API internal (authenticated users).
 * Default: 30 req / 10 detik — lebih longgar karena sudah terautentikasi.
 */
export const apiLimiter = createLimiter({
	limiter: Ratelimit.slidingWindow(
		Number(process.env.RATE_LIMIT_API_REQ ?? 30),
		`${process.env.RATE_LIMIT_API_WINDOW_S ?? 10} s` as Duration,
	),
	prefix: `${NS}:api`,
});

// ─── Helper Middleware ────────────────────────────────────────────────────────

/**
 * Opsi untuk `applyRateLimit`.
 */
export interface RateLimitOptions {
	/** Identifier unik: biasanya IP address atau user ID. */
	identifier: string;
	/** Instance limiter yang akan dipakai. */
	limiter: Pick<Ratelimit, "limit">;
	/**
	 * Callback opsional yang dipanggil saat limit tercapai.
	 * Berguna untuk logging atau alerting kustom.
	 */
	onLimited?: (result: LimitResult) => void;
}

/**
 * Helper untuk mengaplikasikan rate limit dan mengembalikan NextResponse 429
 * jika limit tercapai. Jika masih dalam batas, mengembalikan `null`
 * sehingga handler dapat melanjutkan eksekusi.
 *
 * @example
 * ```ts
 * const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
 * const limited = await applyRateLimit({ identifier: ip, limiter: authLimiter });
 * if (limited) return limited;
 * ```
 */
export async function applyRateLimit({
	identifier,
	limiter,
	onLimited,
}: RateLimitOptions): Promise<NextResponse | null> {
	let result: LimitResult;

	try {
		result = await limiter.limit(identifier);
	} catch (_err) {
		// Redis error — fail-open agar layanan tidak down total
		return null;
	}

	if (!result.success) {
		onLimited?.(result);

		const retryAfterSec = Math.ceil((result.reset - Date.now()) / 1_000);

		return NextResponse.json(
			{
				error: "Too Many Requests",
				message: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
				retryAfter: retryAfterSec,
			},
			{
				status: 429,
				headers: {
					"Retry-After": String(retryAfterSec),
					"X-RateLimit-Limit": String(result.limit),
					"X-RateLimit-Remaining": String(result.remaining),
					"X-RateLimit-Reset": String(result.reset),
				},
			},
		);
	}

	return null;
}
