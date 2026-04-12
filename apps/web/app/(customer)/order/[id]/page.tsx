import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id}`,
    description: `Detail dan tracking order ${id} di Mahira Laundry.`,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Detail Order
      </h1>
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm text-muted-foreground">Nomor Order</span>
            <div className="font-bold text-lg font-[family-name:var(--font-heading)]">
              MHR-20260412-0001
            </div>
          </div>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-semibold">
            Sedang Dicuci
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-sm">Progress</h3>
          {[
            { status: "Order dibuat", time: "12 Apr 2026, 08:00", done: true },
            { status: "Dikonfirmasi", time: "12 Apr 2026, 08:15", done: true },
            {
              status: "Dijemput kurir",
              time: "12 Apr 2026, 09:00",
              done: true,
            },
            { status: "Sedang dicuci", time: "12 Apr 2026, 10:00", done: true },
            { status: "Disetrika", time: "", done: false },
            { status: "Siap diambil", time: "", done: false },
            { status: "Selesai", time: "", done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-3 h-3 rounded-full mt-1 ${item.done ? "bg-brand-primary" : "bg-border"}`}
              />
              <div>
                <div
                  className={`text-sm ${item.done ? "font-medium" : "text-muted-foreground"}`}
                >
                  {item.status}
                </div>
                {item.time && (
                  <div className="text-xs text-muted-foreground">
                    {item.time}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="border-t border-border pt-4">
          <h3 className="font-semibold text-sm mb-3">Detail Item</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
              <span>Cuci Setrika Reguler (3 kg)</span>
              <span className="font-medium">Rp 30.000</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-brand-primary">Rp 35.000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
