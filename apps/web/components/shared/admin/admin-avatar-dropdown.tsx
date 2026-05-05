"use client";

import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminAvatar } from "@/components/shared/admin/admin-avatar";
import { cn } from "@/lib/utils";

interface AdminAvatarDropdownProps {
	fullName?: string | null;
	avatarUrl?: string | null;
	panelLabel: string;
	panelBadgeColor: string;
	headerInfo?: string;
	profileHref?: string;
}

export function AdminAvatarDropdown({
	fullName,
	avatarUrl,
	panelLabel,
	panelBadgeColor,
	headerInfo,
	profileHref = "/admin/profil",
}: AdminAvatarDropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		if (open) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	useEffect(() => {
		function handleEsc(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		if (open) document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, [open]);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2.5 lg:rounded-xl lg:px-2 lg:py-1.5 rounded-full hover:bg-slate-50 transition-colors"
			>
				<AdminAvatar
					fullName={fullName}
					avatarUrl={avatarUrl}
					className="h-8 w-8 lg:h-9 lg:w-9 border-2 border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-colors"
				/>
				<div className="hidden lg:block text-left min-w-0">
					<p className="text-xs font-black text-slate-700 truncate max-w-[120px]">
						{fullName ?? "Superadmin"}
					</p>
					<p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
						{headerInfo}
					</p>
				</div>
			</button>

			{open && (
				<div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
					<div className="p-4 border-b border-slate-50 bg-slate-50/50">
						<div className="flex items-center gap-3">
							<AdminAvatar
								fullName={fullName}
								avatarUrl={avatarUrl}
								className="h-11 w-11 border-2 border-white shadow-md"
							/>
							<div className="min-w-0 flex-1">
								<p className="font-black text-slate-900 text-sm truncate">
									{fullName ?? "Superadmin"}
								</p>
								<span
									className={cn(
										"inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mt-1",
										panelBadgeColor,
									)}
								>
									{panelLabel}
								</span>
							</div>
						</div>
						{headerInfo && (
							<p className="text-[10px] font-bold text-slate-400 mt-2 truncate">{headerInfo}</p>
						)}
					</div>

					<div className="p-2">
						<Link
							href={profileHref}
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
						>
							<UserCircle size={16} className="text-slate-400" />
							Profil Akun
						</Link>
					</div>

					<div className="p-2 border-t border-slate-50">
						<form action="/api/auth/signout" method="POST">
							<button
								type="submit"
								className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
							>
								<LogOut
									size={16}
									className="text-slate-400 group-hover:text-red-500 transition-colors"
								/>
								Keluar
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
