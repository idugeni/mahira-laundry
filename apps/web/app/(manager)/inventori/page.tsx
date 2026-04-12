import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventori",
  description: "Kelola inventori dan stok barang operasional Mahira Laundry.",
};

export default function InventoriPage() {
  const items = [
    {
      name: "Deterjen Cair Premium",
      sku: "DET-001",
      stock: 50,
      unit: "liter",
      min: 10,
      status: "ok",
    },
    {
      name: "Pewangi Laundry",
      sku: "PWG-001",
      stock: 30,
      unit: "liter",
      min: 5,
      status: "ok",
    },
    {
      name: "Plastik Packing",
      sku: "PLK-001",
      stock: 500,
      unit: "pcs",
      min: 100,
      status: "ok",
    },
    {
      name: "Hanger Kawat",
      sku: "HNG-001",
      stock: 200,
      unit: "pcs",
      min: 50,
      status: "ok",
    },
    {
      name: "Kertas Struk",
      sku: "STR-001",
      stock: 3,
      unit: "roll",
      min: 5,
      status: "low",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Inventori Stok
        </h1>
        <button className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold">
          + Tambah Item
        </button>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Item
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                SKU
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Stok
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Min
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
            {items.map((item) => (
              <tr
                key={item.sku}
                className="border-t border-border hover:bg-muted/30"
              >
                <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                  {item.sku}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.stock} {item.unit}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {item.min}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "low" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {item.status === "low" ? "⚠️ Rendah" : "✓ Aman"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs text-brand-primary hover:underline">
                    Restock
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
