import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";
import { redis } from "@/lib/upstash/redis";

const CACHE_KEY = "mahira:ga4:realtime" as const;
const CACHE_TTL_S = 60 as const;

interface CachedRealtimeData {
	activeUsers: number;
	eventCount: number;
	deviceBreakdown: Array<{
		device: string;
		city: string;
		users: number;
	}>;
	topPages: Array<{
		page: string;
		users: number;
	}>;
	timestamp: string;
}

const analyticsClient = new BetaAnalyticsDataClient({
	credentials: {
		client_email: process.env.GOOGLE_CLIENT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	},
});

const propertyId = process.env.GA_PROPERTY_ID;

export async function GET() {
	if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !propertyId) {
		return NextResponse.json(
			{ error: "Google Analytics credentials not configured" },
			{ status: 500 },
		);
	}

	// ── Edge cache: share one GA4 call across all users for 60 s ──
	if (redis) {
		const cached = await redis.get<CachedRealtimeData>(CACHE_KEY);
		if (cached) {
			return NextResponse.json(cached, {
				headers: {
					"x-cache": "HIT",
					"cache-control": "public, s-maxage=60",
				},
			});
		}
	}

	try {
		// ── Device + City breakdown ──
		const [response] = await analyticsClient.runRealtimeReport({
			property: `properties/${propertyId}`,
			dimensions: [{ name: "deviceCategory" }, { name: "city" }],
			metrics: [{ name: "activeUsers" }, { name: "eventCount" }],
		});

		const activeUsers =
			response.rows?.reduce((acc, row) => {
				return acc + Number(row.metricValues?.[0]?.value || 0);
			}, 0) || 0;

		const eventCount =
			response.rows?.reduce((acc, row) => {
				return acc + Number(row.metricValues?.[1]?.value || 0);
			}, 0) || 0;

		const deviceBreakdown =
			response.rows?.map((row) => ({
				device: row.dimensionValues?.[0]?.value,
				city: row.dimensionValues?.[1]?.value,
				users: Number(row.metricValues?.[0]?.value || 0),
			})) || [];

		// ── Top active pages ──
		const [pagesResponse] = await analyticsClient.runRealtimeReport({
			property: `properties/${propertyId}`,
			dimensions: [{ name: "unifiedScreenName" }],
			metrics: [{ name: "activeUsers" }],
		});

		const topPages =
			pagesResponse.rows?.map((row) => ({
				page: row.dimensionValues?.[0]?.value || "/",
				users: Number(row.metricValues?.[0]?.value || 0),
			})) || [];

		const payload = {
			activeUsers,
			eventCount,
			deviceBreakdown,
			topPages,
			timestamp: new Date().toISOString(),
		};

		// Store in Redis for 60 s so subsequent requests skip the GA4 call
		if (redis) {
			await redis.set(CACHE_KEY, JSON.stringify(payload), { ex: CACHE_TTL_S });
		}

		return NextResponse.json(payload, {
			headers: {
				"x-cache": "MISS",
				"cache-control": "public, s-maxage=60",
			},
		});
	} catch (err: unknown) {
		const errorMessage = err instanceof Error ? err.message : "Failed to fetch realtime analytics";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
