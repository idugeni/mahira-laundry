import type { Metadata } from "next";
import { getAllServices, getUserProfile } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/utils";
import { ServiceModal } from "@/components/shared/service-modal";

export const metadata: Metadata = {
  title: "Kelola Layanan",
  description:
    "Kelola daftar layanan, harga, dan durasi pengerjaan di Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function ManagerLayananPage() {
  const [profile, services] = await Promise.all([
    getUserProfile(),
    getAllServices()
  ]);

  const outletId = profile?.outlet_id || "";

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900">
            Daftar Layanan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Menampilkan {services.length} layanan yang tersedia di cabang ini.
          </p>
        </div>
        
        {/* Integrating Add Service Modal */}
        <ServiceModal outletId={outletId} />
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center shadow-sm">
          <div className="text-4xl mb-4">🧺</div>
          <h3 className="text-lg font-bold text-slate-700">Belum ada layanan</h3>
          <p className="text-slate-500 text-sm mt-1">
            Anda belum menambahkan layanan apapun ke cabang ini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Layanan
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Durasi
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Profil Layanan
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
                {services.map((service, index) => {
                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                            {service.icon || "🧺"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {service.name}
                            </p>
                            {service.description && (
                              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-brand-primary">
                            {formatIDR(Number(service.price))}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            /{service.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500 font-medium">
                        {service.estimated_duration_hours} Jam
                      </td>
                      <td className="px-5 py-4">
                        {service.is_express ? (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-tighter rounded-md border border-amber-200">
                            ⚡ Express
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-md border border-slate-200">
                            Reguler
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            service.is_active
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-slate-50 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {service.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ServiceModal 
                          service={service} 
                          outletId={outletId}
                          trigger={
                            <button className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors p-2 hover:bg-brand-primary/5 rounded-lg">
                              Edit Detail →
                            </button>
                          } 
                        />
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
