import { NextResponse } from "next/server";
import { z } from "zod";
import { safeCompare, sha512Hex } from "@/lib/security/signatures";
import { enqueueJob } from "@/lib/upstash/qstash";
import { publicApiLimiter } from "@/lib/upstash/rate-limit";

const MidtransNotificationSchema = z
	.object({
		order_id: z.string().min(1),
		status_code: z.string().min(1),
		gross_amount: z.string().min(1),
		signature_key: z.string().min(1),
		transaction_status: z.string().min(1),
		fraud_status: z.string().optional(),
		payment_type: z.string().optional(),
		transaction_id: z.string().optional(),
	})
	.passthrough();

export async function POST(request: Request) {
	const ip = request.headers.get("x-forwarded-for") ?? "unknown";
	const { success } = await publicApiLimiter.limit(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const payload = MidtransNotificationSchema.safeParse(await request.json());
		if (!payload.success) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}
		const body = payload.data;

		const serverKey = process.env.MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			return NextResponse.json({ error: "Not configured" }, { status: 500 });
		}

		const expectedSignature = sha512Hex(
			`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`,
		);
		if (!safeCompare(body.signature_key, expectedSignature)) {
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const { transaction_status, order_id, fraud_status } = body;

		if (transaction_status === "capture" || transaction_status === "settlement") {
			if (fraud_status === "accept" || !fraud_status) {
				await enqueueJob("/api/jobs/payment-confirmed", {
					orderId: order_id,
					amount: body.gross_amount,
					method: body.payment_type,
					transactionId: body.transaction_id,
				});
			}
		} else if (
			transaction_status === "deny" ||
			transaction_status === "cancel" ||
			transaction_status === "expire"
		) {
		}

		return NextResponse.json({ status: "ok" });
	} catch (_error) {
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
