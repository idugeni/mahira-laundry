"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HiOutlineCamera, HiOutlineCheckBadge } from "react-icons/hi2";

interface Profile {
	full_name: string;
	email: string | null;
	loyalty_tier: string;
	loyalty_points: number;
	avatar_url?: string | null;
}

interface ProfilInfoCardProps {
	profile: Profile;
	loading: boolean;
	onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilInfoCard({
	profile,
	loading,
	onAvatarChange,
}: ProfilInfoCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.1 }}
			className="lg:col-span-1"
		>
			<div className="bg-white rounded-[2.5rem] p-8 shadow-sm text-center relative overflow-hidden group">
				<div className="absolute top-0 left-0 w-full h-24 bg-brand-gradient opacity-10" />

				<div className="relative mt-4 mb-6 group/avatar">
					<div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto text-4xl border-4 border-white overflow-hidden relative">
						<Image
							src={
								profile.avatar_url ||
								`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=0f2a1e&color=fff&size=128`
							}
							alt={profile.full_name}
							width={96}
							height={96}
							className="w-full h-full object-cover"
						/>
						<label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
							<span className="text-white text-xl">
								<HiOutlineCamera />
							</span>
							<input
								type="file"
								className="hidden"
								accept="image/*"
								onChange={onAvatarChange}
								disabled={loading}
							/>
						</label>
					</div>
					<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
						<span className="flex items-center justify-center text-sm">
							<HiOutlineCheckBadge />
						</span>
					</div>
				</div>

				<h2 className="text-xl font-black text-slate-900 leading-tight">
					{profile.full_name}
				</h2>
				<p className="text-sm text-slate-400 font-medium mt-1">
					{profile.email}
				</p>

				<div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">
							Tier
						</span>
						<span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-black uppercase tracking-widest">
							{profile.loyalty_tier}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">
							Poin
						</span>
						<span className="text-lg font-black text-slate-900">
							{profile.loyalty_points}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
