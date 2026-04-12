import type { Metadata } from "next";
import { ProfilClient } from "@/components/shared/profil-client";
import { getUserProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola profil dan informasi akun Mahira Laundry Anda.",
};

export default async function ProfilPage() {
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect("/login");
  }

  return <ProfilClient profile={profile} />;
}
