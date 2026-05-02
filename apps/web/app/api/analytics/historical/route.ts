import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";
import { redis } from "@/lib/upstash/redis";

const CACHE_KEY = "mahira:ga4:historical" as const;
const CACHE_TTL_S = 900 as const; // 15 menit

interface CachedHistoricalData {
	dailyTrend: Array<{
		date: string;
		sessions: number;
		activeUsers: number;
		pageViews: number;
	}>;
	topPages: Array<{
		path: string;
		pageViews: number;
		users: number;
	}>;
	summary: {
		sessions: number;
		activeUsers: number;
		pageViews: number;
		bounceRate: number;
		avgSessionDuration: number;
	};
	period: string;
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

	// ── Edge cache: share one GA4 call across all users for 15 min ──
	if (redis) {
		const cached = await redis.get<CachedHistoricalData>(CACHE_KEY);
		if (cached) {
			return NextResponse.json(cached, {
				headers: {
					"x-cache": "HIT",
					"cache-control": "public, s-maxage=900",
				},
			});
		}
	}

	try {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		const startDate = sevenDaysAgo.toISOString().split("T")[0];
		const today = new Date().toISOString().split("T")[0];

		// ── Daily trend: sessions + activeUsers per day ──
		const [trendResponse] = await analyticsClient.runReport({
			property: `properties/${propertyId}`,
			dateRanges: [{ startDate, endDate: today }],
			dimensions: [{ name: "date" }],
			metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "screenPageViews" }],
			orderBys: [{ dimension: { orderType: "ALPHANUMERIC" }, desc: false }],
		});

		const dailyTrend =
			trendResponse.rows?.map((row) => {
				const dateStr = row.dimensionValues?.[0]?.value || "";
				// GA4 date format: YYYYMMDD → readable
				const formatted = dateStr ? `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}` : "";
				return {
					date: formatted,
					sessions: Number(row.metricValues?.[0]?.value || 0),
					activeUsers: Number(row.metricValues?.[1]?.value || 0),
					pageViews: Number(row.metricValues?.[2]?.value || 0),
				};
			}) || [];

		// ── Top pages ──
		const [pagesResponse] = await analyticsClient.runReport({
			property: `properties/${propertyId}`,
			dateRanges: [{ startDate, endDate: today }],
			dimensions: [{ name: "pagePath" }],
			metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
			orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
			limit: 10,
		});

		const topPages =
			pagesResponse.rows?.map((row) => ({
				path: row.dimensionValues?.[0]?.value || "/",
				pageViews: Number(row.metricValues?.[0]?.value || 0),
				users: Number(row.metricValues?.[1]?.value || 0),
			})) || [];

		// ── Summary stats ──
		const [summaryResponse] = await analyticsClient.runReport({
			property: `properties/${propertyId}`,
			dateRanges: [{ startDate, endDate: today }],
			metrics: [
				{ name: "sessions" },
				{ name: "activeUsers" },
				{ name: "screenPageViews" },
				{ name: "bounceRate" },
				{ name: "averageSessionDuration" },
			],
		});

		const summaryRow = summaryResponse.rows?.[0];
		const summary = {
			sessions: Number(summaryRow?.metricValues?.[0]?.value || 0),
			activeUsers: Number(summaryRow?.metricValues?.[1]?.value || 0),
			pageViews: Number(summaryRow?.metricValues?.[2]?.value || 0),
			bounceRate: Number(summaryRow?.metricValues?.[3]?.value || 0),
			avgSessionDuration: Number(summaryRow?.metricValues?.[4]?.value || 0),
		};

		const payload = {
			dailyTrend,
			topPages,
			summary,
			period: "7d",
		};

		if (redis) {
			await redis.set(CACHE_KEY, JSON.stringify(payload), { ex: CACHE_TTL_S });
		}

		return NextResponse.json(payload, {
			headers: {
				"x-cache": "MISS",
				"cache-control": "public, s-maxage=900",
			},
		});
	} catch (err: unknown) {
		const errorMessage =
			err instanceof Error ? err.message : "Failed to fetch historical analytics";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
