import { NextResponse } from "next/server";
import { publicApiLimiter } from "@/lib/upstash/rate-limit";
import { enqueueJob } from "@/lib/upstash/qstash";

export async function POST(request: Request) {
	const ip = request.headers.get("x-forwarded-for") ?? "unknown";
	const { success } = await publicApiLimiter.limit(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const body = await request.json();
		const { type, table, record, old_record } = body;

		if (table === "orders" && type === "UPDATE") {
			if (record?.status !== old_record?.status) {
				await enqueueJob("/api/jobs/notify", {
					orderId: record.id,
					newStatus: record.status,
					customerId: record.customer_id,
					customerPhone: record.customer_phone,
					customerName: record.customer_name,
				});
			}
		}

		return NextResponse.json({ status: "ok" });
	} catch (error) {
		console.error("[Supabase Webhook] Error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
