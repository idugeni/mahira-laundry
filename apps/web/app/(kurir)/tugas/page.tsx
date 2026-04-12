import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Tugas",
  description: "Dashboard tugas pickup dan delivery kurir Mahira Laundry.",
};

export default function TugasPage() {
  const jobs = [
    {
      id: "1",
      order: "MHR-20260412-0001",
      type: "Pickup",
      customer: "Andi Setiawan",
      address: "Jl. Salemba Raya No. 10",
      status: "assigned",
    },
    {
      id: "2",
      order: "MHR-20260412-0002",
      type: "Delivery",
      customer: "Sari Dewi",
      address: "Jl. Menteng Raya No. 25",
      status: "on_the_way",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Peta Tugas
      </h1>

      {/* Map placeholder */}
      <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-video flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <span className="text-5xl block mb-2">🗺️</span>
          <p className="text-sm">Google Maps area Jakarta Pusat</p>
          <p className="text-xs">Menampilkan lokasi pickup & delivery</p>
        </div>
      </div>

      {/* Job list */}
      <h2 className="font-semibold font-[family-name:var(--font-heading)]">
        Tugas Hari Ini
      </h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-border p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${job.type === "Pickup" ? "bg-blue-100" : "bg-green-100"}`}
              >
                {job.type === "Pickup" ? "📥" : "📤"}
              </div>
              <div>
                <div className="font-medium text-sm">
                  {job.order} • {job.type}
                </div>
                <div className="text-xs text-muted-foreground">
                  {job.customer}
                </div>
                <div className="text-xs text-muted-foreground">
                  {job.address}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${job.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted"
              >
                📍 Navigasi
              </a>
              <button className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium">
                ✅ Selesai
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
