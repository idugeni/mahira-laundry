import type { Metadata } from "next";
import { TrackingClient } from "@/components/public/tracking-client";

export const metadata: Metadata = {
	title: "Lacak Pesanan | Mahira Laundry",
	description: "Lacak status pesanan laundry Anda secara real-time.",
	openGraph: {
		title: "Lacak Pesanan | Mahira Laundry",
		description:
			"Pantau status cucian Anda secara real-time dari jemput hingga antar.",
		images: [
			{
				url: "/og/lacak.png",
				width: 1200,
				height: 630,
				alt: "Lacak Status Pesanan Mahira Laundry",
			},
		],
	},
};

export default function LacakPage() {
	return (
		<div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900">
						Lacak <span className="text-brand-primary">Pesanan</span>
					</h1>
					<p className="text-slate-500 mt-2">
						Masukkan Nomor Pesanan atau ID dari struk Anda
					</p>
				</div>
				<TrackingClient />
			</div>
		</div>
	);
}
