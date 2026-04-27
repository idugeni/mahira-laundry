import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthClient } from "@/components/shared/auth/auth-client";
import { AuthSkeleton } from "@/components/shared/auth/auth-skeleton";
import { signUp } from "@/lib/actions/auth";

export const metadata: Metadata = {
	title: "Daftar",
	description:
		"Buat akun Mahira Laundry gratis dan dapatkan diskon 10% untuk order pertama Anda. Layanan laundry premium di Jakarta.",
};

export default function RegisterPage() {
	return (
		<Suspense fallback={<AuthSkeleton />}>
			<AuthClient type="register" action={signUp} />
		</Suspense>
	);
}
