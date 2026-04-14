import type { Metadata } from "next";
import { getStaffManagementList, getOutletsWithStats } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { RegisterStaffModal } from "@/components/shared/register-staff-modal";

export const metadata: Metadata = {
  title: "Manajemen Pegawai",
  description: "Kelola dan pantau seluruh staf Mahira Laundry Group.",
};

export const dynamic = "force-dynamic";

export default async function PegawaiPage() {
  // Fetch both staff and outlets for the modal
  const [staff, outlets] = await Promise.all([
    getStaffManagementList(),
    getOutletsWithStats()
  ]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Manajemen Pegawai
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {staff.length} staf terdaftar di seluruh cabang Mahira Laundry Group.
          </p>
        </div>
        
        {/* Integrating the Modal Component */}
        <RegisterStaffModal 
          outlets={outlets} 
        />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {staff.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              👥
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum ada pegawai</h3>
            <p className="text-sm text-slate-500 mt-1">
              Tambahkan pegawai pertama untuk mulai mengelola operasional.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama & Kontak
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Peran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Outlet Cabang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Terdaftar
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((s: any) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold group-hover:scale-110 transition-transform text-xs uppercase">
                          {s.full_name?.charAt(0) || "👤"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {s.full_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {s.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                          s.role === "manager"
                            ? "bg-indigo-100 text-indigo-700"
                            : s.role === "kasir"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {s.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">🏪</span>
                        <span className="font-semibold text-slate-700 text-xs">
                          {/* @ts-ignore - Supabase nested object name availability */}
                          {s.outlets?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          s.is_active
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {s.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-mono">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors p-2 hover:bg-pink-50 rounded-lg"
                      >
                        Detail →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="text-xs text-slate-500 leading-relaxed">
          <p className="font-bold text-slate-700 mb-1">Tips Manajemen:</p>
          Akun staf yang didaftarkan akan langsung dapat digunakan untuk masuk ke *Panel Kasir* atau *Panel Kurir*. Pastikan email yang digunakan valid untuk pemulihan akun di masa mendatang.
        </div>
      </div>
    </div>
  );
}
