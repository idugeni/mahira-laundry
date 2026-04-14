import type { Metadata } from "next";
import { NotificationClient } from "@/components/shared/customer/notification/notification-client";

export const metadata: Metadata = {
	title: "Notifikasi",
	description:
		"Pusat notifikasi pelanggan Mahira Laundry. Update status cucian, promo, dan pengumuman terbaru.",
};

export default function NotifikasiPage() {
	return <NotificationClient />;
}
