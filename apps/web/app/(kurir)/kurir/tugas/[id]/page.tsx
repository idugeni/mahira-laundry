import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	return {
		title: `Tugas ${id}`,
		description: `Detail tugas kurir ${id} di Mahira Laundry.`,
	};
}

export default async function TugasDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: _id } = await params;
	return (
		<div className="max-w-2xl space-y-6">
			<h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
				Detail Tugas
			</h1>
			<div className="bg-white rounded-xl border border-border p-6 space-y-4">
				<div className="flex justify-between items-start">
					<div>
						<span className="text-sm text-muted-foreground">Order</span>
						<div className="font-bold font-mono">MHR-20260412-0001</div>
					</div>
					<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
						Pickup
					</span>
				</div>
				<div>
					<span className="text-sm font-medium">Alamat Jemput</span>
					<p className="text-sm text-muted-foreground">
						Jl. Jatiwaringin Raya No. 10, Bekasi
					</p>
				</div>
				<div>
					<span className="text-sm font-medium">Pelanggan</span>
					<p className="text-sm text-muted-foreground">
						Andi Setiawan • 08123456789
					</p>
				</div>
				<div className="flex gap-3 pt-4 border-t border-border">
					<button
						type="button"
						className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium"
					>
						📷 Upload Foto
					</button>
					<button
						type="button"
						className="flex-1 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-medium"
					>
						✅ Selesaikan
					</button>
				</div>
			</div>
		</div>
	);
}
