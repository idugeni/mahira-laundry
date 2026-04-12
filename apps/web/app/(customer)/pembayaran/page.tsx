import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembayaran",
  description: "Kelola metode pembayaran dan lihat riwayat transaksi Anda di Mahira Laundry.",
};

export default function PembayaranPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Pembayaran
      </h1>
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
          Riwayat Pembayaran
        </h2>
        <div className="text-center py-8 text-muted-foreground text-sm">
          <span className="text-4xl block mb-2">💳</span>
          Belum ada riwayat pembayaran.
        </div>
      </div>
    </div>
  );
}
