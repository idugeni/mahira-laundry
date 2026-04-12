import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Voucher",
  description: "Buat dan kelola voucher diskon untuk pelanggan Mahira Laundry.",
};

export default function VoucherPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Voucher & Promo
        </h1>
        <button className="px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold">
          + Buat Voucher
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            code: "MAHIRA10",
            type: "10%",
            desc: "Diskon 10% pelanggan baru",
            used: 45,
            limit: 100,
            active: true,
          },
          {
            code: "KOSTHEMAT",
            type: "Rp 5.000",
            desc: "Potongan paket kost",
            used: 89,
            limit: 200,
            active: true,
          },
          {
            code: "GRATISANTAR",
            type: "Free Ongkir",
            desc: "Gratis ongkir Salemba-Menteng",
            used: 30,
            limit: 50,
            active: true,
          },
          {
            code: "RAMADHAN25",
            type: "25%",
            desc: "Diskon Ramadhan semua cabang",
            used: 120,
            limit: 500,
            active: true,
          },
        ].map((v) => (
          <div
            key={v.code}
            className="bg-white rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-brand-primary">
                {v.code}
              </span>
              <span className="text-xs bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-semibold">
                {v.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Digunakan: {v.used}/{v.limit}
              </span>
              <button className="text-brand-primary hover:underline">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
