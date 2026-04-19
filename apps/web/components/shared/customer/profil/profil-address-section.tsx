"use client";

import { motion } from "motion/react";
import { HiOutlineMapPin } from "react-icons/hi2";

interface Address {
	id?: string;
	label?: string;
	full_address?: string;
	detail?: string;
	is_primary?: boolean;
}

interface ProfilAddressSectionProps {
	addresses: Address[];
	loading: boolean;
	showAddAddress: boolean;
	newAddr: { label: string; detail: string };
	onShowAddAddress: () => void;
	onHideAddAddress: () => void;
	onNewAddrChange: (addr: { label: string; detail: string }) => void;
	onAddAddress: () => void;
	onDeleteAddress: (index: number) => void;
}

export function ProfilAddressSection({
	addresses,
	loading,
	showAddAddress,
	newAddr,
	onShowAddAddress,
	onHideAddAddress,
	onNewAddrChange,
	onAddAddress,
	onDeleteAddress,
}: ProfilAddressSectionProps) {
	return (
		<div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
			<div className="flex items-center justify-between mb-8">
				<h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
					<span className="w-8 h-8 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center">
						<HiOutlineMapPin />
					</span>
					Alamat Tersimpan
				</h3>
				{!showAddAddress && (
					<button
						type="button"
						onClick={onShowAddAddress}
						className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/5 px-4 py-2 rounded-full transition-all"
					>
						Tambah Baru
					</button>
				)}
			</div>

			<div className="space-y-6">
				{showAddAddress && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="p-8 rounded-[2rem] border-2 border-dashed border-brand-primary/20 bg-brand-primary/5 space-y-4"
					>
						<div className="space-y-2">
							<label
								htmlFor="addr-label"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
							>
								Label Alamat (Contoh: Rumah, Kantor)
							</label>
							<input
								id="addr-label"
								type="text"
								placeholder="Label"
								value={newAddr.label}
								onChange={(e) =>
									onNewAddrChange({ ...newAddr, label: e.target.value })
								}
								className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none font-bold focus:border-brand-primary transition-all"
							/>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="addr-detail"
								className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
							>
								Alamat Lengkap
							</label>
							<textarea
								id="addr-detail"
								placeholder="Jl. Raya No. 123..."
								value={newAddr.detail}
								onChange={(e) =>
									onNewAddrChange({ ...newAddr, detail: e.target.value })
								}
								rows={3}
								className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none font-bold focus:border-brand-primary transition-all resize-none"
							/>
						</div>
						<div className="flex gap-3">
							<button
								type="button"
								onClick={onAddAddress}
								disabled={loading}
								className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-brand-primary/20 transition-all disabled:opacity-50"
							>
								{loading ? "Menambah..." : "Simpan Alamat"}
							</button>
							<button
								type="button"
								onClick={onHideAddAddress}
								className="px-6 py-3 border border-slate-200 text-slate-400 rounded-xl font-bold hover:bg-white transition-all"
							>
								Batal
							</button>
						</div>
					</motion.div>
				)}

				{addresses.length > 0 ? (
					<div className="space-y-4">
						{addresses.map((addr, i) => (
							<div
								key={addr.id ?? `addr-${i}`}
								className="p-6 rounded-3xl bg-slate-50/30 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-brand-primary/5 transition-all"
							>
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl text-slate-300 group-hover:text-brand-primary transition-colors">
										<HiOutlineMapPin />
									</div>
									<div>
										<p className="font-black text-slate-900">
											{addr.label || "Alamat"}
										</p>
										<p className="text-xs text-slate-400 font-medium mt-0.5">
											{addr.detail}
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => onDeleteAddress(i)}
									disabled={loading}
									className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
								>
									Hapus
								</button>
							</div>
						))}
					</div>
				) : (
					!showAddAddress && (
						<div className="text-center py-10 bg-slate-50/50 rounded-[2rem]">
							<p className="text-sm font-bold text-slate-300">
								Belum ada alamat tersimpan.
							</p>
							<button
								type="button"
								onClick={onShowAddAddress}
								className="mt-4 text-xs font-black uppercase tracking-widest text-brand-primary hover:underline"
							>
								Tambah Alamat
							</button>
						</div>
					)
				)}
			</div>
		</div>
	);
}
