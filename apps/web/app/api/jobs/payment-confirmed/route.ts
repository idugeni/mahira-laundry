import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { qstashRoute } from "@/lib/upstash/qstash-route";

const PaymentConfirmedPayloadSchema = z.object({
	orderId: z.string().min(1).max(80),
	customerId: z.string().uuid().optional(),
	amount: z.union([z.string(), z.number()]).optional(),
	method: z.string().max(80).optional(),
	transactionId: z.string().max(120).optional(),
});

const UuidSchema = z.string().uuid();

async function handler(request: Request) {
	try {
		const payload = PaymentConfirmedPayloadSchema.safeParse(await request.json());
		if (!payload.success) {
			return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
		}

		const { orderId, amount, method, transactionId } = payload.data;
		const supabase = createAdminClient();

		let customerId = payload.data.customerId;
		if (!customerId) {
			const orderQuery = supabase.from("orders").select("id, customer_id").limit(1);
			const { data: orders, error: orderError } = UuidSchema.safeParse(orderId).success
				? await orderQuery.eq("id", orderId)
				: await orderQuery.eq("order_number", orderId);

			if (orderError) throw orderError;
			customerId = orders?.[0]?.customer_id;
		}

		if (!customerId) {
			return NextResponse.json({ error: "Order customer not found" }, { status: 404 });
		}

		const paymentUpdate = {
			status: "paid",
			midtrans_transaction_id: transactionId,
			paid_at: new Date().toISOString(),
		};

		if (UuidSchema.safeParse(orderId).success) {
			await supabase.from("payments").update(paymentUpdate).eq("order_id", orderId);
			await supabase.from("orders").update({ status: "confirmed" }).eq("id", orderId);
		} else {
			const { data: order } = await supabase
				.from("orders")
				.select("id")
				.eq("order_number", orderId)
				.single();
			if (order?.id) {
				await supabase.from("payments").update(paymentUpdate).eq("order_id", order.id);
				await supabase.from("orders").update({ status: "confirmed" }).eq("id", order.id);
			}
		}

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

export const POST = qstashRoute(handler);
