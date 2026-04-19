"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminAvatarProps {
	fullName?: string | null;
	avatarUrl?: string | null;
	className?: string;
}

function getInitials(fullName?: string | null): string {
	if (!fullName) return "SA";
	const parts = fullName.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function AdminAvatar({
	fullName,
	avatarUrl,
	className,
}: AdminAvatarProps) {
	return (
		<Avatar className={className}>
			{avatarUrl && <AvatarImage src={avatarUrl} alt={fullName ?? "Avatar"} />}
			<AvatarFallback className="bg-slate-900 text-white font-black text-xs">
				{getInitials(fullName)}
			</AvatarFallback>
		</Avatar>
	);
}
