"use client";

import { Camera, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateAvatar } from "@/lib/actions/profile";

interface AdminAvatarSectionProps {
	profile: {
		id: string;
		full_name: string;
		avatar_url?: string | null;
	};
}

export function AdminAvatarSection({ profile }: AdminAvatarSectionProps) {
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	async function handleAvatarChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (!file) return;

		setLoading(true);
		const formData = new FormData();
		formData.append("avatar", file);

		try {
			const result = await updateAvatar(formData);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Foto profil admin diperbarui!");
				router.refresh();
			}
		} catch (_err) {
			toast.error("Gagal mengunggah foto profil.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative group/avatar">
			<div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-indigo-500/20 border-4 border-white transition-transform duration-300 group-hover/avatar:-translate-y-0.5 overflow-hidden relative">
				{profile.avatar_url ? (
					<Image
						src={profile.avatar_url}
						alt={profile.full_name}
						fill
						sizes="128px"
						className="object-cover object-top"
					/>
				) : (
					profile.full_name?.charAt(0) || <User size={48} />
				)}

				{loading && (
					<div className="absolute inset-0 bg-indigo-600/60 backdrop-blur-xs flex items-center justify-center z-10">
						<div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
					</div>
				)}
			</div>

			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				disabled={loading}
				className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-indigo-600 cursor-pointer hover:bg-slate-50 transition-colors z-20"
			>
				<Camera size={20} className={loading ? "opacity-20" : ""} />
			</button>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="sr-only"
				onChange={handleAvatarChange}
			/>
		</div>
	);
}
