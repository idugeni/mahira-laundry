import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySharedWebhookSecret } from "@/lib/security/signatures";
import { enqueueJob } from "@/lib/upstash/qstash";
import { publicApiLimiter } from "@/lib/upstash/rate-limit";

const WebhookRecordSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
		customer_id: z.string().optional(),
		customer_phone: z.string().optional(),
		customer_name: z.string().optional(),
	})
	.passthrough();

const SupabaseWebhookPayloadSchema = z
	.object({
		type: z.string(),
		table: z.string(),
		record: WebhookRecordSchema.nullable().optional(),
		old_record: WebhookRecordSchema.nullable().optional(),
	})
	.passthrough();

export async function POST(request: Request) {
	const ip = request.headers.get("x-forwarded-for") ?? "unknown";
	const { success } = await publicApiLimiter.limit(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const secret = process.env.SUPABASE_WEBHOOK_SECRET;
		if (!secret) {
			return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
		}

		const rawBody = await request.text();
		if (!verifySharedWebhookSecret(request, rawBody, secret)) {
			return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
		}

		const payload = SupabaseWebhookPayloadSchema.safeParse(JSON.parse(rawBody));
		if (!payload.success) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}

		const { type, table, record, old_record } = payload.data;

		if (table === "orders" && type === "UPDATE") {
			const newStatus = record?.status;
			const oldStatus = old_record?.status;
			if (newStatus !== oldStatus) {
				await enqueueJob("/api/jobs/notify", {
					orderId: record?.id,
					newStatus,
					customerId: record?.customer_id,
					customerPhone: record?.customer_phone,
					customerName: record?.customer_name,
				});
			}
		}

		return NextResponse.json({ status: "ok" });
	} catch (_error) {
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
