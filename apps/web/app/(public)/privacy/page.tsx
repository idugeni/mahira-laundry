import type { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";

export const metadata: Metadata = {
	title: "Kebijakan Privasi",
	description:
		"Kebijakan Privasi Mahira Laundry - Pelajari bagaimana kami melindungi data dan informasi privasi pelanggan kami.",
};

export default function PrivacyPage() {
	return (
		<LegalLayout
			title="Kebijakan Privasi"
			subtitle="Komitmen Mahira Laundry dalam menjaga, melindungi, dan menghormati privasi setiap data pelanggan kami secara profesional."
			lastUpdated="12 April 2026"
		>
			<section className="space-y-8">
				<div>
					<h2 className="text-2xl">1. Komitmen Privasi Kami</h2>
					<p>
						Di Mahira Laundry, privasi Anda adalah prioritas utama kami.
						Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
						menggunakan, dan melindungi informasi pribadi Anda saat Anda
						menggunakan layanan laundry dan aplikasi kami.
					</p>
				</div>

				<div>
					<h2 className="text-2xl">2. Informasi yang Kami Kumpulkan</h2>
					<p>
						Kami mengumpulkan informasi yang Anda berikan langsung kepada kami,
						termasuk namun tidak terbatas pada:
					</p>
					<ul className="list-disc pl-6 mt-4 space-y-2">
						<li>Nama lengkap dan informasi kontak (No. WhatsApp, Email).</li>
						<li>Alamat penjemputan dan pengantaran laundry.</li>
						<li>Riwayat pesanan dan preferensi layanan.</li>
						<li>
							Informasi perangkat dan akses lokasi untuk fitur peta
							antar-jemput.
						</li>
					</ul>
				</div>

				<div>
					<h2 className="text-2xl">3. Penggunaan Informasi</h2>
					<p>Informasi yang kami kumpulkan digunakan untuk:</p>
					<ul className="list-disc pl-6 mt-4 space-y-2">
						<li>Memproses dan mengelola pesanan laundry Anda.</li>
						<li>Mengoordinasikan layanan antar-jemput dengan kurir kami.</li>
						<li>Mengirimkan notifikasi status pesanan melalui WhatsApp.</li>
						<li>Mengelola saldo poin loyalitas dan reward "Sultan".</li>
						<li>Meningkatkan kualitas layanan dan pengalaman aplikasi kami.</li>
					</ul>
				</div>

				<div>
					<h2 className="text-2xl">4. Keamanan Data</h2>
					<p>
						Kami menggunakan enkripsi standar industri dan protokol keamanan
						modern (Supabase Auth & RLS) untuk melindungi data Anda dari akses
						yang tidak sah. Kami tidak pernah menjual data pribadi Anda kepada
						pihak ketiga untuk tujuan pemasaran.
					</p>
				</div>

				<div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
					<h3 className="text-lg font-bold mb-2">Pertanyaan Hukum?</h3>
					<p className="text-sm">
						Jika Anda memiliki pertanyaan mengenai kebijakan privasi kami,
						silakan hubungi tim legal kami melalui
						<strong> help@mahiralaundry.id</strong>.
					</p>
				</div>
			</section>
		</LegalLayout>
	);
}
