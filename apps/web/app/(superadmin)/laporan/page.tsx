import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan",
  description: "Laporan lengkap operasional dan performa seluruh cabang Mahira Laundry.",
};

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Laporan & Audit
      </h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            title: "Laporan Harian",
            desc: "Ringkasan order dan pendapatan hari ini",
            icon: "📅",
          },
          {
            title: "Laporan Mingguan",
            desc: "Performa minggu ini vs minggu lalu",
            icon: "📆",
          },
          {
            title: "Laporan Bulanan",
            desc: "Laporan lengkap bulan berjalan",
            icon: "📊",
          },
          {
            title: "Audit Trail",
            desc: "Log semua perubahan data dan akses",
            icon: "🔍",
          },
          {
            title: "Performa Karyawan",
            desc: "Produktivitas dan kehadiran staf",
            icon: "👥",
          },
          {
            title: "Customer Insights",
            desc: "Analisis perilaku pelanggan",
            icon: "🧠",
          },
        ].map((report) => (
          <div
            key={report.title}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{report.icon}</span>
              <div>
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
