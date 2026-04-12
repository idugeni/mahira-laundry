import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Layanan",
  description: "Kelola daftar layanan, harga, dan durasi pengerjaan di Mahira Laundry.",
};

import { formatIDR } from "@/lib/utils";

export default function ManagerLayananPage() {
  const services = [
    { name: "Cuci Lipat Reguler", price: 7000, unit: "kg", active: true },
    { name: "Cuci Setrika Reguler", price: 10000, unit: "kg", active: true },
    { name: "Express Cuci Setrika", price: 15000, unit: "kg", active: true },
    { name: "Dry Cleaning", price: 25000, unit: "item", active: true },
    { name: "Cuci Sepatu", price: 35000, unit: "pasang", active: true },
    { name: "Paket Kost Mingguan", price: 8000, unit: "kg", active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Kelola Layanan
        </h1>
        <button className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold">
          + Tambah Layanan
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Layanan
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Harga
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Unit
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.name}
                className="border-t border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {service.name}
                </td>
                <td className="px-4 py-3 text-sm text-brand-primary font-semibold">
                  {formatIDR(service.price)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  /{service.unit}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${service.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {service.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs text-brand-primary hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
