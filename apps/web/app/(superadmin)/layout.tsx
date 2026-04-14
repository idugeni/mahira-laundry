import { AdminSidebar } from "@/components/shared/admin-sidebar";

const superadminNav = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/pos", label: "POS Kasir", icon: "💰" },
  { href: "/admin/antrian", label: "Antrian", icon: "📋" },
  { href: "/admin/outlet", label: "Outlet", icon: "🏪" },
  { href: "/admin/franchise", label: "Franchise", icon: "🤝" },
  { href: "/admin/pegawai", label: "Manajemen Pegawai", icon: "👥" },
  { href: "/admin/testimonials", label: "Testimoni", icon: "💬" },
  { href: "/admin/layanan", label: "Kelola Layanan", icon: "🧺" },
  { href: "/admin/galeri", label: "Galeri", icon: "🖼️" },
  { href: "/admin/keuangan", label: "Keuangan", icon: "💰" },
  { href: "/admin/laporan", label: "Laporan & Audit", icon: "📊" },
];

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50/50">
      <AdminSidebar
        navItems={superadminNav}
        panelLabel="Superadmin"
        panelBadgeColor="bg-gradient-to-r from-red-500 to-pink-500 text-white"
        headerInfo="Mahira Laundry Group"
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 lg:h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 mt-14 lg:mt-0 shadow-sm/30">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
              <span className="font-medium text-slate-600">Mahira Laundry</span>
              <span>/</span>
              <span>Panel Superadmin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              🔑 Owner
            </span>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
