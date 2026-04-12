import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Outlet",
  description: "Manajemen outlet dan cabang Mahira Laundry di seluruh Jakarta.",
};

export default function OutletPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Outlet Management
        </h1>
        <button className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold">
          + Tambah Outlet
        </button>
      </div>
      {/* Map */}
      <div className="rounded-xl bg-muted border border-border aspect-video flex items-center justify-center text-muted-foreground text-sm">
        🗺️ Peta sebaran outlet Jakarta
      </div>
      {/* Outlet cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            name: "Salemba",
            orders: 342,
            revenue: "Rp 12.5M",
            rating: 4.8,
            active: true,
          },
          {
            name: "Menteng",
            orders: 256,
            revenue: "Rp 9.8M",
            rating: 4.7,
            active: true,
          },
          {
            name: "Cikini",
            orders: 189,
            revenue: "Rp 7.2M",
            rating: 4.6,
            active: true,
          },
        ].map((outlet) => (
          <div
            key={outlet.name}
            className="bg-white rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Mahira {outlet.name}</h3>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                Aktif
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="p-2 bg-muted/50 rounded-lg">
                <div className="font-bold">{outlet.orders}</div>
                <div className="text-xs text-muted-foreground">Order</div>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <div className="font-bold">{outlet.revenue}</div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <div className="font-bold">⭐ {outlet.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
