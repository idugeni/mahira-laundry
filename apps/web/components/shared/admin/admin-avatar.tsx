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

function getInitials(
	fullName?: string | null,
	defaultInitials: string = "??",
): string {
	if (!fullName) return defaultInitials;
	const parts = fullName.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function AdminAvatar({
	fullName,
	avatarUrl,
	className,
}: AdminAvatarProps) {
	// Cache-bust only after client hydration to avoid server/client srcSet mismatch
	const [cacheBust, setCacheBust] = useState(false);

	useEffect(() => {
		setCacheBust(true);
	}, []);

	const src = avatarUrl
		? cacheBust && !avatarUrl.includes("?")
			? `${avatarUrl}?t=${Date.now().toString(36)}`
			: avatarUrl
		: undefined;

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
