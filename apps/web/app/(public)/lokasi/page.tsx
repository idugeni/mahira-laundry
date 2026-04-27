import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Lokasi Outlet",
	description:
		"Temukan outlet kami terdekat dan nikmati layanan laundry premium dengan standar kualitas tinggi di titik-titik strategis.",
	openGraph: {
		title: "Lokasi Outlet",
		description:
			"Jaringan outlet kami yang siap melayani kebutuhan laundry Anda setiap hari.",
		images: [
			{
				url: "/og/lokasi.png",
				width: 1200,
				height: 630,
				alt: "Lokasi Outlet Mahira Laundry",
			},
		],
	},
};

const _outlets = [
	{
		name: "Mahira Laundry Salemba",
		address: "Jl. Salemba Raya No. 28, Paseban, Senen, Jakarta Pusat 10440",
		phone: "021-3456789",
		hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
		lat: -6.2115,
		lng: 106.8559,
		color: "bg-brand-primary",
	},
	{
		name: "Mahira Laundry Menteng",
		address: "Jl. Menteng Raya No. 15, Menteng, Jakarta Pusat 10340",
		phone: "021-3456790",
		hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
		lat: -6.196,
		lng: 106.843,
		color: "bg-blue-500",
	},
	{
		name: "Mahira Laundry Cikini",
		address: "Jl. Cikini Raya No. 42, Cikini, Menteng, Jakarta Pusat 10330",
		phone: "021-3456791",
		hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
		lat: -6.1897,
		lng: 106.8407,
		color: "bg-purple-500",
	},
];

import { LokasiClient } from "@/components/shared/public/lokasi-client";

export default function LokasiPage() {
	return <LokasiClient />;
}
