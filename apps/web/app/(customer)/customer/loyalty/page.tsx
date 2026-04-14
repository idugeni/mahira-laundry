import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoyaltyClient } from "@/components/shared/loyalty-client";
import {
  getLoyaltyHistory,
  getRewards,
  getUserProfile,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Loyalty & Poin",
  description:
    "Program loyalty pelanggan Mahira Laundry. Kumpulkan poin dari setiap pesanan dan tukarkan dengan hadiah menarik.",
};

export default async function LoyaltyPage() {
  const [profile, history, rewards] = await Promise.all([
    getUserProfile(),
    getLoyaltyHistory(),
    getRewards(),
  ]);

  if (!profile) {
    redirect("/login");
  }

  return (
    <LoyaltyClient profile={profile} history={history} rewards={rewards} />
  );
}
