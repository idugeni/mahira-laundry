import type { Metadata } from "next";
import { getAllInventory, getUserProfile } from "@/lib/supabase/server";
import { InventoryModal } from "@/components/shared/inventory-modal";

export const metadata: Metadata = {
  title: "Inventori",
  description: "Kelola inventori dan stok barang operasional Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function InventoriPage() {
  const [profile, items] = await Promise.all([
    getUserProfile(),
    getAllInventory()
  ]);

  const outletId = profile?.outlet_id || "";

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
            Inventori Stok
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Menampilkan {items.length} item di gudang saat ini.
          </p>
        </div>
        
        {/* Integrating Add Item Modal */}
        <InventoryModal outletId={outletId} />
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-slate-700">Belum ada item</h3>
          <p className="text-slate-500 text-sm mt-1">
            Data inventori kosong. Silakan tambah item baru.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    SKU / Kategori
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Min. Stok
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const qty = Number(item.quantity) || 0;
                  const min = Number(item.min_stock) || 0;
                  const isLow = qty <= min;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                          {item.name}
                        </p>
                        {item.notes && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                            {item.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                         <p className="text-xs font-mono font-semibold text-slate-500">
                          {item.sku || "—"}
                        </p>
                        {item.category && (
                          <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                            {item.category}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-black ${isLow ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                            {qty}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                        {min} {item.unit}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            isLow
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {isLow ? "⚠️ Rendah" : "✓ Aman"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <InventoryModal 
                             item={item} outletId={outletId} mode="restock"
                             trigger={
                               <button className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors px-3 py-1.5 hover:bg-brand-primary/5 rounded-lg border border-transparent hover:border-brand-primary/20">
                                 Restock
                               </button>
                             }
                          />
                          <InventoryModal 
                             item={item} outletId={outletId} mode="edit"
                             trigger={
                               <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg">
                                 Edit
                               </button>
                             }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
