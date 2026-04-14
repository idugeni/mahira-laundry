import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllServices, getUserProfile } from "@/lib/supabase/server";
import { ServiceManager } from "@/components/admin/service-manager";

export const metadata: Metadata = {
  title: "Pusat Layanan",
  description: "Manajemen katalog layanan premium Mahira Laundry Group.",
};

export const dynamic = "force-dynamic";

export default async function SuperadminLayananPage() {
  const [profile, services] = await Promise.all([
    getUserProfile(),
    getAllServices()
  ]);

  // For superadmin, outlet_id might be needed for the upsert action
  // We'll use the profile's outlet_id or a default for global services
  const outletId = profile?.outlet_id || "salemba";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-1 px-4 sm:px-0">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-[family-name:var(--font-heading)]">
          Katalog <span className="text-brand-gradient">Layanan</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Kelola standardisasi harga, durasi, dan jenis layanan di seluruh jaringan Mahira.
        </p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem]" />
          ))}
        </div>
      }>
        <ServiceManager services={services || []} outletId={outletId} />
      </Suspense>
    </div>
  );
}
