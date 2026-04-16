"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PATH_LABELS: Record<string, string> = {
	"/admin": "Dashboard",
	"/admin/pos": "POS Kasir",
	"/admin/antrian": "Antrian",
	"/admin/outlet": "Outlet",
	"/admin/franchise": "Franchise",
	"/admin/pegawai": "Pegawai",
	"/admin/testimonials": "Testimoni",
	"/admin/layanan": "Layanan",
	"/admin/galeri": "Galeri",
	"/admin/keuangan": "Keuangan",
	"/admin/laporan": "Laporan",
	"/admin/profil": "Profil",
};

export function DynamicBreadcrumb() {
	const pathname = usePathname();

	// Normalize: strip trailing slash
	const normalizedPath = pathname.replace(/\/$/, "") || "/admin";

	const label = PATH_LABELS[normalizedPath];
	const isDashboard = normalizedPath === "/admin";

	return (
		<nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
			<Link
				href="/admin"
				className="text-slate-400 hover:text-slate-600 transition-colors"
				aria-label="Dashboard"
			>
				<Home size={14} />
			</Link>
			{!isDashboard && label && (
				<>
					<ChevronRight size={14} className="text-slate-300" />
					<span className="font-bold text-slate-800 tracking-tight">
						{label}
					</span>
				</>
			)}
			{isDashboard && (
				<>
					<ChevronRight size={14} className="text-slate-300" />
					<span className="font-bold text-slate-800 tracking-tight">
						Dashboard
					</span>
				</>
			)}
		</nav>
	);
}
