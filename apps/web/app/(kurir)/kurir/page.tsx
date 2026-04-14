import { DeliveryClient } from "@/components/kurir/delivery-client";
import { createClient } from "@/lib/supabase/server";

export default async function TugasPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { data: deliveries } = await supabase
		.from("delivery")
		.select("*, orders(*, profiles(*))")
		.eq("courier_id", user?.id)
		.in("status", ["assigned", "on_the_way"])
		.order("created_at", { ascending: false });

	return (
		<div className="space-y-12 py-8 px-4">
			<div>
				<h1 className="text-4xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
					Peta <span className="inline-block text-brand-gradient">Tugas</span>
				</h1>
				<p className="text-slate-500 font-medium mt-2">
					Kelola penjemputan dan pengantaran laundry secara real-time.
				</p>
			</div>

			{/* Map placeholder */}
			<div className="rounded-[3rem] overflow-hidden border border-slate-100 bg-slate-50 aspect-video lg:aspect-[3/1] flex items-center justify-center relative shadow-2xl shadow-slate-200/50">
				<div className="text-center">
					<span className="text-6xl block mb-6 animate-bounce">📍</span>
					<p className="text-sm font-black text-slate-900 uppercase tracking-widest">
						Google Maps API
					</p>
					<p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
						Monitor Lokasi Tugas Jakarta Pusat
					</p>
				</div>
			</div>

			{/* Job list */}
			<div className="space-y-8">
				<h2 className="text-xl font-black font-[family-name:var(--font-heading)] text-slate-900 flex items-center gap-3">
					Daftar Antrean
					<span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full">
						{deliveries?.length || 0}
					</span>
				</h2>
				<DeliveryClient initialDeliveries={deliveries || []} />
			</div>
		</div>
	);
}
