import type { Metadata } from "next";
import { getStaffList } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Manajemen Tim",
	description: "Kelola anggota tim dan peran staff di Mahira Laundry.",
};

export const dynamic = "force-dynamic";

export default async function TimPage() {
	const staff = await getStaffList();

	return (
		<div className="space-y-8 animate-fade-in-up">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
						Daftar Tim Cabang
					</h1>
					<p className="text-sm text-slate-500 mt-1">
						Total {staff.length} staf terdaftar dalam sistem.
					</p>
				</div>
				<button className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-sm shadow-pink-500/20 hover:scale-[1.02] hover:shadow-md transition-all">
					+ Tambah Staf Baru
				</button>
			</div>

			{staff.length === 0 ? (
				<div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
					<div className="text-4xl mb-4">👥</div>
					<h3 className="text-lg font-bold text-slate-700">
						Belum ada anggota tim
					</h3>
					<p className="text-slate-500 text-sm mt-1">
						Tambahkan kasir atau kurir ke cabang ini untuk memulai operasional.
					</p>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{staff.map((s) => (
						<div
							key={s.id}
							className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group"
						>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center text-xl border-2 border-white shadow-sm font-bold text-pink-600 group-hover:scale-110 transition-transform">
										{s.full_name?.charAt(0) || "👤"}
									</div>
									<div>
										<h3 className="font-bold text-slate-900 leading-tight">
											{s.full_name}
										</h3>
										<p className="text-sm text-brand-primary font-medium mt-0.5 capitalize flex items-center gap-1.5">
											{s.role === "kasir"
												? "🖥️ "
												: s.role === "kurir"
													? "🛵 "
													: "👑 "}
											{s.role}
										</p>
									</div>
								</div>
							</div>

							<div className="pt-4 border-t border-slate-100 mt-2 space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-500 flex items-center gap-1.5">
										<span className="text-xs">📞</span> Kontak
									</span>
									<span className="font-medium text-slate-700">
										{s.phone || "Belum diatur"}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-500 flex items-center gap-1.5">
										<span className="text-xs">🚦</span> Status
									</span>
									<span
										className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
											s.is_active
												? "bg-emerald-100 text-emerald-700"
												: "bg-slate-100 text-slate-500"
										}`}
									>
										{s.is_active ? "Aktif" : "Nonaktif"}
									</span>
								</div>
							</div>

							<div className="flex gap-2 mt-2">
								<button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
									Lihat Jadwal
								</button>
								<button className="flex-1 py-2 text-xs font-bold text-brand-primary bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors">
									Edit Profil
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
