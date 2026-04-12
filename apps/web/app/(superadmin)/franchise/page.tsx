import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franchise",
  description: "Dashboard manajemen franchise dan cabang Mahira Laundry.",
};

export default function FranchisePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Franchise Portal
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="text-2xl mb-2">🤝</div>
          <h3 className="font-semibold">Mahira Cikini</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Franchise • Fee 5%
          </p>
          <div className="mt-3 text-sm">
            <span className="text-muted-foreground">Royalty bulan ini:</span>{" "}
            <span className="font-bold text-brand-primary">Rp 360.000</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold font-[family-name:var(--font-heading)] mb-4">
          SOP Digital
        </h2>
        <div className="space-y-2">
          {[
            "Standar Kebersihan",
            "Prosedur Order",
            "Quality Control",
            "Handling Complaint",
          ].map((sop) => (
            <div
              key={sop}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <span className="text-sm">{sop}</span>
              <button className="text-xs text-brand-primary hover:underline">
                Lihat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
