import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Antrian Order",
  description: "Dashboard antrian pesanan kasir Mahira Laundry. Kelola dan proses order pelanggan.",
};

const columns = [
  {
    id: "pending",
    label: "Pending",
    color: "bg-yellow-500",
    orders: ["MHR-20260412-0004", "MHR-20260412-0005"],
  },
  {
    id: "washing",
    label: "Cuci",
    color: "bg-cyan-500",
    orders: ["MHR-20260412-0002", "MHR-20260412-0003"],
  },
  {
    id: "ironing",
    label: "Setrika",
    color: "bg-purple-500",
    orders: ["MHR-20260412-0001"],
  },
  { id: "ready", label: "Siap", color: "bg-green-500", orders: [] },
  { id: "completed", label: "Selesai", color: "bg-emerald-500", orders: [] },
];

export default function AntrianPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Kanban Antrian
      </h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-64">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${col.color}`} />
              <span className="font-semibold text-sm">{col.label}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {col.orders.length}
              </span>
            </div>
            <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-xl p-2">
              {col.orders.map((order) => (
                <div
                  key={order}
                  className="bg-white rounded-lg p-3 border border-border shadow-sm hover:shadow-md transition-shadow cursor-grab"
                >
                  <div className="font-mono text-xs font-bold">{order}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Cuci Setrika • 3kg
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pelanggan: John Doe
                  </div>
                </div>
              ))}
              {col.orders.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-8">
                  Kosong
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
