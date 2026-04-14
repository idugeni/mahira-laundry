import type { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";

export const metadata: Metadata = {
	title: "Kebijakan Cookie",
	description:
		"Informasi mengenai penggunaan cookie dan teknologi pelacakan di platform Mahira Laundry.",
};

export default function CookiesPage() {
	return (
		<LegalLayout
			title="Kebijakan Cookie"
			subtitle="Memahami bagaimana kami menggunakan teknologi untuk meningkatkan pengalaman Anda."
			lastUpdated="12 April 2026"
		>
			<div className="space-y-12">
				<section>
					<h2 className="text-2xl font-black text-slate-900 mb-6 font-[family-name:var(--font-heading)]">
						1. Apa itu Cookie?
					</h2>
					<p className="text-slate-600 leading-relaxed">
						Cookie adalah file teks kecil yang disimpan di perangkat Anda
						(komputer atau perangkat seluler) saat Anda mengunjungi situs web
						kami. Cookie memungkinkan situs web untuk mengenali perangkat Anda
						dan menyimpan informasi tentang preferensi atau aktivitas masa lalu
						Anda.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-black text-slate-900 mb-6 font-[family-name:var(--font-heading)]">
						2. Bagaimana Kami Menggunakan Cookie
					</h2>
					<p className="text-slate-600 leading-relaxed mb-4">
						Kami menggunakan cookie untuk beberapa tujuan berikut:
					</p>
					<ul className="list-disc pl-6 space-y-3 text-slate-600">
						<li>
							<strong>Cookie Esensial:</strong> Diperlukan agar fitur dasar
							situs web dapat berfungsi, seperti login akun dan keamanan
							transaksi.
						</li>
						<li>
							<strong>Cookie Performa:</strong> Membantu kami memahami bagaimana
							pengunjung berinteraksi dengan situs kami (misalnya, halaman mana
							yang paling sering dikunjungi).
						</li>
						<li>
							<strong>Cookie Preferensi:</strong> Mengingat pilihan yang Anda
							buat (seperti bahasa atau lokasi outlet) untuk memberikan
							pengalaman yang lebih personal.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-black text-slate-900 mb-6 font-[family-name:var(--font-heading)]">
						3. Kontrol Cookie Anda
					</h2>
					<p className="text-slate-600 leading-relaxed">
						Anda memiliki hak untuk memutuskan apakah akan menerima atau menolak
						cookie. Anda dapat mengatur atau mengubah kontrol browser web Anda
						untuk menerima atau menghapus cookie. Jika Anda memilih untuk
						menolak cookie, Anda tetap dapat menggunakan situs web kami,
						meskipun akses Anda ke beberapa fungsi dan area mungkin akan
						terbatas.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-black text-slate-900 mb-6 font-[family-name:var(--font-heading)]">
						4. Pembaruan Kebijakan
					</h2>
					<p className="text-slate-600 leading-relaxed">
						Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu
						untuk mencerminkan perubahan pada cookie yang kami gunakan atau
						karena alasan operasional, hukum, atau peraturan lainnya. Silakan
						kunjungi halaman ini secara berkala untuk tetap mendapatkan
						informasi tentang penggunaan cookie kami.
					</p>
				</section>

				<div className="pt-10 border-t border-slate-100 italic text-sm text-slate-400">
					Terakhir diperbarui: 12 April 2026
				</div>
			</div>
		</LegalLayout>
	);
}
