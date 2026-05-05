import type { Metadata } from "next";
import { AuthClient } from "@/components/shared/auth/auth-client";
import { signUp } from "@/lib/actions/auth";

export const metadata: Metadata = {
	title: "Daftar",
	description:
		"Buat akun Mahira Laundry gratis dan dapatkan diskon 10% untuk order pertama Anda. Layanan laundry premium di Jakarta.",
};

export default function RegisterPage() {
	return <AuthClient type="register" action={signUp} />;
}
