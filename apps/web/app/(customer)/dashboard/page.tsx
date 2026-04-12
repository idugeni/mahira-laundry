import type { Metadata } from "next";
import { DashboardClient } from "@/components/shared/dashboard-client";
import { getDashboardStats } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard pelanggan Mahira Laundry. Kelola pesanan, cek poin loyalty, dan pantau status cucian Anda.",
};

export default async function CustomerDashboard() {
  const stats = await getDashboardStats();
  
  if (!stats) {
    redirect("/login");
  }

  return <DashboardClient stats={stats} />;
}
