"use client";

import { motion } from "motion/react";
import {
	HiOutlineEnvelope,
	HiOutlinePhone,
	HiOutlineUser,
} from "react-icons/hi2";

interface ProfilFormProps {
	profile: {
		full_name: string;
		phone: string | null;
		email: string | null;
	};
	isEditing: boolean;
	loading: boolean;
	onToggleEdit: () => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ProfilForm({
	profile,
	isEditing,
	loading,
	onToggleEdit,
	onSubmit,
}: ProfilFormProps) {
	return (
		<div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
			<div className="flex items-center justify-between mb-8">
				<h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
					<span className="w-8 h-8 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center">
						<HiOutlineUser />
					</span>
					Informasi Pribadi
				</h3>
				<button
					onClick={onToggleEdit}
					className="text-xs font-black uppercase tracking-widest text-brand-primary hover:bg-brand-primary/5 px-4 py-2 rounded-full transition-all"
				>
					{isEditing ? "Batal" : "Ubah"}
				</button>
			</div>

			<form onSubmit={onSubmit} className="space-y-6">
				<div className="grid sm:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label
							htmlFor="full_name"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
						>
							Nama Lengkap
						</label>
						<div className="relative group">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
								<HiOutlineUser />
							</span>
							<input
								id="full_name"
								name="full_name"
								type="text"
								defaultValue={profile.full_name}
								disabled={!isEditing}
								className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 disabled:opacity-60"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="phone"
							className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
						>
							Nomor WhatsApp
						</label>
						<div className="relative group">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">
								<HiOutlinePhone />
							</span>
							<input
								id="phone"
								name="phone"
								type="tel"
								defaultValue={profile.phone || ""}
								disabled={!isEditing}
								placeholder="Belum diatur"
								className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 disabled:opacity-60"
							/>
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="email"
						className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
					>
						Alamat Email
					</label>
					<div className="relative group">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
							<HiOutlineEnvelope />
						</span>
						<input
							id="email"
							type="email"
							value={profile.email || ""}
							disabled
							className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50/10 outline-none font-bold text-slate-400"
						/>
					</div>
				</div>

				{isEditing && (
					<motion.button
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						type="submit"
						disabled={loading}
						className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
					>
						{loading ? "Menyimpan..." : "Simpan Perubahan"}
					</motion.button>
				)}
			</form>
		</div>
	);
}
