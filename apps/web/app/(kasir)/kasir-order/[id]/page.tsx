import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Kasir Order ${id}`,
    description: `Detail order kasir ${id} di Mahira Laundry.`,
  };
}

export default async function KasirOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
        Detail Order Kasir
      </h1>
      <div className="bg-white rounded-xl border border-border p-6">
        <p className="text-muted-foreground">
          Detail order dan opsi update status akan ditampilkan di sini.
        </p>
      </div>
    </div>
  );
}
