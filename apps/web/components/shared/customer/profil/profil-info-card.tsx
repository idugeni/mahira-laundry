"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
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
	const fileInputRef = useRef<HTMLInputElement>(null);

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
							className="w-full h-full object-cover object-top"
						/>
					</div>

					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-brand-primary rounded-2xl flex items-center justify-center border-4 border-white shadow-xl z-30 cursor-pointer hover:scale-110 hover:text-brand-accent transition-all group/cam"
					>
						<span className="flex items-center justify-center text-lg group-hover/cam:rotate-12 transition-transform">
							<HiOutlineCamera />
						</span>
					</button>
					<input
						ref={fileInputRef}
						type="file"
						className="sr-only"
						accept="image/*"
						onChange={onAvatarChange}
					/>
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
