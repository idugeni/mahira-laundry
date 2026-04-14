import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Order Baru",
	description:
		"Buat pesanan laundry baru di Mahira Laundry. Pilih outlet, layanan, dan jadwal pickup yang Anda inginkan.",
};

export default function OrderBaruLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
