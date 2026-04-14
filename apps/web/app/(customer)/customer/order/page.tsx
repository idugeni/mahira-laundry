import type { Metadata } from "next";
import { OrderListClient } from "@/components/shared/customer/order/order-list-client";
import { getOrders } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Daftar Pesanan",
	description:
		"Pantau status cucian Anda secara real-time di Mahira Laundry Jakarta Salemba.",
};

export default async function OrderPage() {
	const orders = await getOrders();

	// getOrders might return empty array, but if session fails it returns null/empty
	// We check for valid auth in getOrders

	return <OrderListClient orders={orders} />;
}
