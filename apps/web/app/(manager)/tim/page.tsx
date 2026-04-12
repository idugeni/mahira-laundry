import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Tim",
  description: "Kelola anggota tim dan peran staff di Mahira Laundry.",
};

export default function TimPage() {
  const staff = [
    { name: "Budi Santoso", role: "Kasir", status: "Aktif", shift: "Pagi" },
    { name: "Dewi Lestari", role: "Kasir", status: "Aktif", shift: "Siang" },
    { name: "Ahmad Kurniawan", role: "Kurir", status: "Aktif", shift: "Pagi" },
    { name: "Siti Nurhaliza", role: "Kurir", status: "Aktif", shift: "Siang" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Manajemen Tim
        </h1>
        <button className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold">
          + Tambah Staf
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {staff.map((s) => (
          <div
            key={s.name}
            className="bg-white rounded-xl border border-border p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-lg">
              👤
            </div>
            <div className="flex-1">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-muted-foreground">
                {s.role} • Shift {s.shift}
              </div>
            </div>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
