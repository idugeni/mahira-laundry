import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

// Inisialisasi client Google Analytics Data API
// Pastikan GOOGLE_CLIENT_EMAIL dan GOOGLE_PRIVATE_KEY ada di .env
const analyticsClient = new BetaAnalyticsDataClient({
	credentials: {
		client_email: process.env.GOOGLE_CLIENT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	},
});

const propertyId = process.env.GA_PROPERTY_ID;

export async function GET() {
	if (
		!process.env.GOOGLE_CLIENT_EMAIL ||
		!process.env.GOOGLE_PRIVATE_KEY ||
		!propertyId
	) {
		return NextResponse.json(
			{ error: "Google Analytics credentials not configured" },
			{ status: 500 },
		);
	}

	try {
		// Memanggil Realtime Report
		// Mengambil data pengguna aktif dalam 30 menit terakhir
		const [response] = await analyticsClient.runRealtimeReport({
			property: `properties/${propertyId}`,
			dimensions: [{ name: "deviceCategory" }, { name: "city" }],
			metrics: [{ name: "activeUsers" }, { name: "screenPageViewsPerUser" }],
		});

		// Mapping hasil report
		const activeUsers =
			response.rows?.reduce((acc, row) => {
				return acc + Number(row.metricValues?.[0].value || 0);
			}, 0) || 0;

		const deviceBreakdown =
			response.rows?.map((row) => ({
				device: row.dimensionValues?.[0].value,
				city: row.dimensionValues?.[1].value,
				users: Number(row.metricValues?.[0].value || 0),
			})) || [];

		return NextResponse.json({
			activeUsers,
			deviceBreakdown,
			timestamp: new Date().toISOString(),
		});
	} catch (err: unknown) {
		const errorMessage =
			err instanceof Error ? err.message : "Failed to fetch realtime analytics";
		console.error("GA4 Realtime API Error:", err);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
