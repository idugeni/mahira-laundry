import type { Metadata } from "next";
import { LoyaltyClient } from "@/components/shared/loyalty-client";
import { getUserProfile, getLoyaltyHistory } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Loyalty & Poin",
  description: "Program loyalty pelanggan Mahira Laundry. Kumpulkan poin dari setiap pesanan dan tukarkan dengan hadiah menarik.",
};

export default async function LoyaltyPage() {
  const [profile, history] = await Promise.all([
    getUserProfile(),
    getLoyaltyHistory()
  ]);

  if (!profile) {
    redirect("/login");
  }

  return <LoyaltyClient profile={profile} history={history} />;
}
