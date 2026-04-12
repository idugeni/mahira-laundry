import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keuangan",
  description: "Laporan keuangan dan ringkasan finansial seluruh cabang Mahira Laundry.",
};

import { formatIDR } from "@/lib/utils";

export default function KeuanganPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Laporan Keuangan
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">
            📄 Export PDF
          </button>
          <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">
            📊 Export Excel
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="text-sm text-muted-foreground">Total Pendapatan</div>
          <div className="text-3xl font-bold font-[family-name:var(--font-heading)] text-brand-primary mt-1">
            {formatIDR(29500000)}
          </div>
          <div className="text-xs text-green-600 mt-1">
            +15% dari bulan lalu
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
          <div className="text-3xl font-bold font-[family-name:var(--font-heading)] mt-1">
            {formatIDR(12800000)}
          </div>
          <div className="text-xs text-red-600 mt-1">+8% dari bulan lalu</div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="text-sm text-muted-foreground">Laba Bersih</div>
          <div className="text-3xl font-bold font-[family-name:var(--font-heading)] text-green-600 mt-1">
            {formatIDR(16700000)}
          </div>
          <div className="text-xs text-green-600 mt-1">Margin 56.6%</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
          P&L Statement
        </h2>
        <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
          📊 Chart P&L akan ditampilkan di sini
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
          Rekonsiliasi Midtrans
        </h2>
        <div className="text-center py-8 text-muted-foreground text-sm">
          Data rekonsiliasi pembayaran ditampilkan di sini setelah integrasi
          Midtrans aktif.
        </div>
      </div>
    </div>
  );
}
