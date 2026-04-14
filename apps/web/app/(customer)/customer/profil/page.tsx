import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfilClient } from "@/components/shared/customer/profil/profil-client";
import { getUserProfile } from "@/lib/supabase/server";

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
