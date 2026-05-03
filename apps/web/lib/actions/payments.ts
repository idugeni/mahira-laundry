"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, STAFF_ROLES } from "@/lib/auth/guards";
import { paymentSchema } from "@/lib/validations/payment.schema";

const ConfirmPaymentSchema = z.object({
	paymentId: z.string().uuid(),
	transactionId: z.string().min(1).max(160),
});

export async function createPayment(orderId: string, method: string) {
	const parsed = paymentSchema.safeParse({ orderId, method });
	if (!parsed.success) return { error: "Data pembayaran tidak valid" };

	const { supabase, role, outletId } = await requireRole(
		STAFF_ROLES,
		"Akses staff diperlukan untuk membuat pembayaran.",
	);

	let orderQuery = supabase.from("orders").select("total, outlet_id").eq("id", parsed.data.orderId);
	if (role === "superadmin") {
		// Superadmin can access any order
	} else if (outletId) {
		orderQuery = orderQuery.eq("outlet_id", outletId);
	} else {
		return { error: "Staff harus memiliki outlet yang ditugaskan." };
	}

	const { data: order } = await orderQuery.single();

	if (!order) return { error: "Order tidak ditemukan" };

	const paymentData = {
		order_id: parsed.data.orderId,
		amount: order.total,
		method: parsed.data.method,
		status: parsed.data.method === "cash" ? "paid" : "pending",
		paid_at: parsed.data.method === "cash" ? new Date().toISOString() : null,
	};

	const { data: payment, error } = await supabase
		.from("payments")
		.insert(paymentData)
		.select()
		.single();

	if (error) return { error: error.message };

	if (parsed.data.method === "cash") {
		await supabase.from("orders").update({ status: "confirmed" }).eq("id", parsed.data.orderId);
	}

	revalidatePath("/order");
	revalidatePath("/pembayaran");
	return { data: payment };
}

export async function confirmPayment(paymentId: string, transactionId: string) {
	const parsed = ConfirmPaymentSchema.safeParse({ paymentId, transactionId });
	if (!parsed.success) return { error: "Data konfirmasi pembayaran tidak valid" };

	const { supabase } = await requireRole(
		STAFF_ROLES,
		"Akses staff diperlukan untuk konfirmasi pembayaran.",
	);

	const { error } = await supabase
		.from("payments")
		.update({
			status: "paid",
			midtrans_transaction_id: parsed.data.transactionId,
			paid_at: new Date().toISOString(),
		})
		.eq("id", parsed.data.paymentId);

	if (error) return { error: error.message };

	revalidatePath("/pembayaran");
	return { success: true };
}
