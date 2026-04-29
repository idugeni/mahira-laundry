import type { Metadata } from "next";
import { OrderListClient } from "@/components/shared/customer/order/order-list-client";
import { getOrders } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Daftar Pesanan",
	description:
		"Pantau status cucian Anda secara real-time di Mahira Laundry Bekasi Jatiwaringin.",
};

export default async function OrderPage() {
	const orders = await getOrders();

	return <OrderListClient orders={orders} />;
}
