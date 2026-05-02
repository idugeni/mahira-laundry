import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function handler(request: Request) {
	try {
		const body = await request.json();
		const { orderId, customerId, amount, method } = body;

		if (!orderId || !customerId) {
			return NextResponse.json({ error: "Missing orderId or customerId" }, { status: 400 });
		}

		const supabase = await createClient();

		await supabase.from("notifications").insert({
			user_id: customerId,
			type: "payment",
			title: "Pembayaran Dikonfirmasi",
			body: `Pembayaran untuk pesanan #${orderId} telah dikonfirmasi (${method || "digital payment"}${amount ? ` — Rp ${Number(amount).toLocaleString("id-ID")}` : ""}).`,
			data: { order_id: orderId, amount, method },
		});

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

export const POST = process.env.QSTASH_CURRENT_SIGNING_KEY
	? verifySignatureAppRouter(handler)
	: handler;
