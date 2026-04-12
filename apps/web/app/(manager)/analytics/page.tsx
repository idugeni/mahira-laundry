import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analitik Bisnis",
  description: "Dashboard analitik dan statistik bisnis Mahira Laundry. Pantau performa dan tren penjualan.",
};

import { formatIDR } from "@/lib/utils";

export default function ManagerDashboardPage() {
  const stats = [
    {
      label: "Pendapatan Bulan Ini",
      value: formatIDR(12500000),
      icon: "💰",
      change: "+12%",
      color: "text-green-600",
    },
    {
      label: "Total Order",
      value: "342",
      icon: "📦",
      change: "+8%",
      color: "text-green-600",
    },
    {
      label: "Pelanggan Aktif",
      value: "156",
      icon: "👥",
      change: "+5%",
      color: "text-green-600",
    },
    {
      label: "Rating Rata-rata",
      value: "4.8",
      icon: "⭐",
      change: "+0.1",
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Analytics & KPI
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium ${stat.color}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold font-[family-name:var(--font-heading)]">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart placeholder */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
          Grafik Pendapatan
        </h2>
        <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
          📊 Recharts LineChart akan ditampilkan di sini
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top services */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
            Layanan Terpopuler
          </h2>
          {[
            "Cuci Setrika",
            "Express",
            "Dry Cleaning",
            "Cuci Lipat",
            "Paket Kost",
          ].map((name, i) => (
            <div
              key={name}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="text-sm">{name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.floor(Math.random() * 100 + 20)} order
              </span>
            </div>
          ))}
        </div>

        {/* Heatmap placeholder */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
            Jam Sibuk Salemba
          </h2>
          <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
            🔥 Heatmap demand akan ditampilkan di sini
          </div>
        </div>
      </div>
    </div>
  );
}
