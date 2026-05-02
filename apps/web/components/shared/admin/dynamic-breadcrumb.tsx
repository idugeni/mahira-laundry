"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PATH_LABELS: Record<string, string> = {
	// Admin / Superadmin
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
	"/admin/analytics": "Analytics",
	"/admin/paket-usaha": "Paket Usaha",
	"/admin/paket-usaha/leads": "Leads",
	"/admin/notifikasi": "Notifikasi",
	"/admin/profil": "Profil",
	// Manager
	"/manager": "Dashboard",
	"/manager/analytics": "Analytics",
	"/manager/kelola-layanan": "Kelola Layanan",
	"/manager/voucher": "Voucher",
	"/manager/inventori": "Inventori",
	"/manager/tim": "Tim",
	// Kasir
	"/kasir": "POS Kasir",
	"/kasir/antrian": "Antrian",
	"/kasir/shift": "Shift",
	"/kasir/kasir-order": "Detail Order",
	// Kurir
	"/kurir": "Dashboard",
	"/kurir/tugas": "Peta Tugas",
	// Customer
	"/customer": "Dashboard",
	"/customer/order": "Order",
	"/customer/order/baru": "Buat Order",
	"/customer/loyalty": "Loyalty",
	"/customer/pembayaran": "Pembayaran",
	"/customer/testimonial": "Testimoni",
	"/customer/notifikasi": "Notifikasi",
	"/customer/profil": "Profil",
};

const ROLE_ROOTS: Record<string, string> = {
	"/admin": "/admin",
	"/manager": "/manager",
	"/kasir": "/kasir",
	"/kurir": "/kurir",
	"/customer": "/customer",
};

function getRoleRoot(pathname: string): string {
	const segment = `/${pathname.split("/")[1]}`;
	return ROLE_ROOTS[segment] || "/";
}

interface Crumb {
	href: string;
	label: string;
	isLast: boolean;
}

function buildCrumbs(pathname: string): Crumb[] {
	const normalized = pathname.replace(/\/$/, "") || "/";
	const _root = getRoleRoot(normalized);
	const segments = normalized.split("/").filter(Boolean);
	const crumbs: Crumb[] = [];

	// Build each level
	for (let i = 1; i <= segments.length; i++) {
		const href = `/${segments.slice(0, i).join("/")}`;
		const label = PATH_LABELS[href];
		if (!label) continue;
		crumbs.push({
			href,
			label,
			isLast: href === normalized,
		});
	}

	// If root itself is the current page, ensure it's marked as last
	if (crumbs.length === 1) {
		crumbs[0].isLast = true;
	}

	return crumbs;
}

interface DynamicBreadcrumbProps {
	/** Override the home link (defaults to role root) */
	homeHref?: string;
	/** Compact mode: hide intermediate crumbs on small screens */
	compact?: boolean;
}

export function DynamicBreadcrumb({
	homeHref,
	compact = true,
}: DynamicBreadcrumbProps) {
	const pathname = usePathname();
	const normalized = pathname.replace(/\/$/, "") || "/";
	const root = getRoleRoot(normalized);
	const crumbs = buildCrumbs(normalized);
	const resolvedHome = homeHref || root;

	return (
		<nav
			aria-label="Breadcrumb"
			className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm min-w-0"
		>
			<Link
				href={resolvedHome}
				className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
				aria-label="Home"
			>
				<Home size={14} className="sm:w-[15px] sm:h-[15px] md:w-4 md:h-4" />
			</Link>

			{crumbs.map((crumb) => {
				// In compact mode, hide intermediate (non-last) crumbs on small screens
				const hiddenOnSmall = compact && !crumb.isLast;
				return (
					<span
						key={crumb.href}
						className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 ${
							hiddenOnSmall ? "hidden sm:flex" : "flex"
						}`}
					>
						<ChevronRight
							size={14}
							className="shrink-0 text-slate-300 sm:w-[15px] sm:h-[15px] md:w-4 md:h-4"
						/>
						{crumb.isLast ? (
							<span className="font-bold text-slate-800 tracking-tight truncate">
								{crumb.label}
							</span>
						) : (
							<Link
								href={crumb.href}
								className="text-slate-400 hover:text-slate-600 transition-colors truncate"
							>
								{crumb.label}
							</Link>
						)}
					</span>
				);
			})}
		</nav>
	);
}
