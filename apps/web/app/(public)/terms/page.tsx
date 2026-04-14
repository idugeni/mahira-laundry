import type { Metadata } from "next";
import { LegalLayout } from "@/components/shared/legal-layout";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan Ketentuan penggunaan layanan Mahira Laundry - Ketentuan layanan, tanggung jawab, dan aturan penggunaan.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Syarat & Ketentuan"
      subtitle="Panduan standar layanan, tanggung jawab, dan aturan penggunaan untuk memastikan pengalaman laundry yang transparan dan memuaskan."
      lastUpdated="12 April 2026"
    >
      <section className="space-y-8">
        <p className="italic text-slate-400">
          Dengan menggunakan layanan Mahira Laundry, baik secara langsung di
          outlet maupun melalui aplikasi, Anda dianggap telah membaca, memahami,
          dan menyetujui seluruh syarat dan ketentuan berikut.
        </p>

        <div>
          <h2 className="text-2xl">1. Standar Layanan</h2>
          <p>
            Mahira Laundry berkomitmen memberikan perawatan terbaik untuk setiap
            potong pakaian. Namun, perlu dipahami bahwa hasil cuci sangat
            bergantung pada kondisi awal kain, noda yang sudah ada, dan
            instruksi perawatan (care label) pada pakaian.
          </p>
        </div>

        <div>
          <h2 className="text-2xl">2. Tanggung Jawab Kerusakan & Kehilangan</h2>
          <p>
            Kami menerapkan kebijakan ganti rugi yang adil jika terbukti terjadi
            kesalahan di pihak kami:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Klaim kerusakan atau kehilangan wajib dilaporkan maksimal 1x24 jam
              setelah barang diterima.
            </li>
            <li>
              Ganti rugi maksimal adalah 10x dari biaya jasa pencucian untuk
              item terkait.
            </li>
            <li>
              Kami tidak bertanggung jawab atas kerusakan item yang tidak
              memiliki label perawatan (label instruksi cuci).
            </li>
            <li>
              Kehilangan barang-barang berharga di dalam saku pakaian bukan
              merupakan tanggung jawab Mahira Laundry.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl">3. Layanan Express & Antar-Jemput</h2>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Layanan Express 6 Jam dihitung sejak barang diterima di outlet dan
              divalidasi pembayarannya.
            </li>
            <li>
              Waktu antar-jemput dapat bervariasi tergantung pada kondisi lalu
              lintas dan volume pesanan.
            </li>
            <li>
              Pembatalan pesanan antar-jemput saat kurir sudah menuju lokasi
              dapat dikenakan biaya administrasi.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl">4. Program Loyalitas "Sultan"</h2>
          <p>
            Poin loyalitas diperoleh dari setiap transaksi yang berhasil. Mahira
            Laundry berhak melakukan penyesuaian nilai poin atau membatalkan
            poin yang diperoleh melalui aktivitas yang melanggar aturan sistem.
          </p>
        </div>

        <div className="p-8 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 border-dashed text-center">
          <p className="text-slate-600 font-medium">
            Semua item yang tidak diambil dalam waktu 30 hari di luar tanggung
            jawab kami.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
