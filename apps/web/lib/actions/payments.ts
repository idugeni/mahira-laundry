"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPayment(orderId: string, method: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return { error: "Unauthorized" };

	// Get order total
	const { data: order } = await supabase
		.from("orders")
		.select("total")
		.eq("id", orderId)
		.single();

	if (!order) return { error: "Order tidak ditemukan" };

	const paymentData = {
		order_id: orderId,
		amount: order.total,
		method,
		status: method === "cash" ? "paid" : "pending",
		paid_at: method === "cash" ? new Date().toISOString() : null,
	};

	const { data: payment, error } = await supabase
		.from("payments")
		.insert(paymentData)
		.select()
		.single();

	if (error) return { error: error.message };

	// If cash, update order status to confirmed
	if (method === "cash") {
		await supabase
			.from("orders")
			.update({ status: "confirmed" })
			.eq("id", orderId);
	}

	revalidatePath("/order");
	revalidatePath("/pembayaran");
	return { data: payment };
}

export async function confirmPayment(paymentId: string, transactionId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.from("payments")
		.update({
			status: "paid",
			midtrans_transaction_id: transactionId,
			paid_at: new Date().toISOString(),
		})
		.eq("id", paymentId);

	if (error) return { error: error.message };

	revalidatePath("/pembayaran");
	return { success: true };
}
