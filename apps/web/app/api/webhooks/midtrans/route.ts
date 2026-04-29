import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const serverKey = process.env.MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			return NextResponse.json({ error: "Not configured" }, { status: 500 });
		}

		const { transaction_status, order_id, fraud_status } = body;

		if (
			transaction_status === "capture" ||
			transaction_status === "settlement"
		) {
			if (fraud_status === "accept" || !fraud_status) {
				console.log(`[Midtrans] Payment confirmed for: ${order_id}`);
			}
		} else if (
			transaction_status === "deny" ||
			transaction_status === "cancel" ||
			transaction_status === "expire"
		) {
			console.log(`[Midtrans] Payment failed for: ${order_id}`);
		}

		return NextResponse.json({ status: "ok" });
	} catch (error) {
		console.error("[Midtrans Webhook] Error:", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
