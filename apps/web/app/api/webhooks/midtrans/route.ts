import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/upstash/qstash";
import { publicApiLimiter } from "@/lib/upstash/rate-limit";

export async function POST(request: Request) {
	const ip = request.headers.get("x-forwarded-for") ?? "unknown";
	const { success } = await publicApiLimiter.limit(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const body = await request.json();

		const serverKey = process.env.MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			return NextResponse.json({ error: "Not configured" }, { status: 500 });
		}

		const { transaction_status, order_id, fraud_status } = body;

		if (transaction_status === "capture" || transaction_status === "settlement") {
			if (fraud_status === "accept" || !fraud_status) {
				await enqueueJob("/api/jobs/payment-confirmed", {
					orderId: order_id,
					amount: body.gross_amount,
					method: body.payment_type,
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
