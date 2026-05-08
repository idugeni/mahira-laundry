"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminAvatarProps {
	fullName?: string | null;
	avatarUrl?: string | null;
	className?: string;
	defaultInitials?: string;
}

function getInitials(fullName?: string | null, defaultInitials: string = "??"): string {
	if (!fullName) return defaultInitials;
	const parts = fullName.trim().split(/\s+/);
	if (parts.length === 1) return (parts[0]?.charAt(0) ?? "?").toUpperCase();
	return (
		((parts[0]?.charAt(0) ?? "") + (parts[1]?.charAt(0) ?? "")).toUpperCase() || defaultInitials
	);
}

export function AdminAvatar({ fullName, avatarUrl, className }: AdminAvatarProps) {
	// Cache-bust only after client hydration to avoid server/client srcSet mismatch
	const [cacheBust, setCacheBust] = useState(false);

	useEffect(() => {
		setCacheBust(true);
	}, []);

	const src = (() => {
		if (!avatarUrl) return undefined;

		// If it's already an absolute URL (starts with http)
		if (avatarUrl.startsWith("http")) {
			// Only cache-bust Supabase URLs that don't have query params yet
			const isSupabase = avatarUrl.includes("supabase.co");
			if (isSupabase && cacheBust && !avatarUrl.includes("?")) {
				return `${avatarUrl}?t=${Date.now().toString(36)}`;
			}
			return avatarUrl;
		}

		// If it's a relative path from Supabase storage
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		if (supabaseUrl && !avatarUrl.startsWith("/")) {
			const baseUrl = `${supabaseUrl}/storage/v1/object/public/avatars/`;
			const fullUrl = `${baseUrl}${avatarUrl}`;
			return cacheBust ? `${fullUrl}?t=${Date.now().toString(36)}` : fullUrl;
		}

		return avatarUrl;
	})();

	return (
		<Avatar className={className}>
			{src && (
				<Image
					src={src}
					alt={fullName ?? "Avatar"}
					fill
					sizes="(max-width: 768px) 32px, 36px"
					className="object-cover object-top"
				/>
			)}
			<AvatarFallback className="bg-slate-900 text-white font-black text-xs">
				{getInitials(fullName)}
			</AvatarFallback>
		</Avatar>
	);
}
