import {
	BarChart3,
	Building2,
	ChartNoAxesCombined,
	ClipboardList,
	Images,
	Landmark,
	LayoutDashboard,
	MessageSquareText,
	PackageOpen,
	ReceiptText,
	Shirt,
	Store,
	UserCircle,
	UsersRound,
} from "lucide-react";
import { AdminAvatarDropdown } from "@/components/shared/admin/admin-avatar-dropdown";
import { AdminSidebar } from "@/components/shared/admin/admin-sidebar";
import { DynamicBreadcrumb } from "@/components/shared/admin/dynamic-breadcrumb";
import { getInquiryStats, getUserProfile } from "@/lib/supabase/server";

export default async function SuperadminLayout({ children }: { children: React.ReactNode }) {
	const [profile, inquiryStats] = await Promise.all([getUserProfile(), getInquiryStats()]);

	const superadminNav = [
		{ href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
		{ href: "/admin/pos", label: "POS Kasir", icon: <ReceiptText size={17} /> },
		{
			href: "/admin/antrian",
			label: "Antrian",
			icon: <ClipboardList size={17} />,
		},
		{ href: "/admin/outlet", label: "Outlet", icon: <Store size={17} /> },
		{
			href: "/admin/franchise",
			label: "Franchise",
			icon: <Building2 size={17} />,
		},
		{
			href: "/admin/paket-usaha",
			label: "Paket Usaha",
			icon: <PackageOpen size={17} />,
			badge: inquiryStats.new > 0 ? inquiryStats.new : undefined,
		},
		{
			href: "/admin/pegawai",
			label: "Manajemen Pegawai",
			icon: <UsersRound size={17} />,
		},
		{
			href: "/admin/testimonials",
			label: "Testimoni",
			icon: <MessageSquareText size={17} />,
		},
		{
			href: "/admin/layanan",
			label: "Kelola Layanan",
			icon: <Shirt size={17} />,
		},
		{ href: "/admin/galeri", label: "Galeri", icon: <Images size={17} /> },
		{
			href: "/admin/keuangan",
			label: "Keuangan",
			icon: <Landmark size={17} />,
		},
		{
			href: "/admin/laporan",
			label: "Laporan & Audit",
			icon: <BarChart3 size={17} />,
		},
		{
			href: "/admin/analytics",
			label: "Traffic Analytics",
			icon: <ChartNoAxesCombined size={17} />,
		},
		{
			href: "/admin/profil",
			label: "Profil Akun",
			icon: <UserCircle size={17} />,
		},
	];

	return (
		<div className="flex bg-slate-50/50">
			<AdminSidebar
				navItems={superadminNav}
				panelLabel="Superadmin"
				panelBadgeColor="bg-gradient-to-r from-red-500 to-pink-500 text-white"
				headerInfo="Mahira Group"
				profile={profile}
			/>
			<div className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0 min-h-screen">
				{/* Top Header (desktop only) */}
				<header className="hidden md:flex h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md items-center justify-between px-8 sticky top-0 z-30">
					<div className="flex items-center gap-3">
						<DynamicBreadcrumb />
					</div>
					<div className="flex items-center gap-4">
						<AdminAvatarDropdown
							fullName={profile?.full_name}
							avatarUrl={profile?.avatar_url}
							panelLabel="Superadmin"
							panelBadgeColor="bg-gradient-to-r from-red-500 to-pink-500 text-white"
							headerInfo="Mahira Group"
						/>
					</div>
				</header>
				{/* Main Content */}
				<main className="flex-1 p-4 md:p-8 flex items-start justify-center">
					<div className="w-full max-w-7xl">{children}</div>
				</main>
				{/* Dashboard Footer */}
				<footer className="p-4 md:p-6 border-t border-slate-200/80 text-center text-sm text-slate-500 bg-white/50 shrink-0">
					<p>© {new Date().getFullYear()} Mahira Group. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
}
