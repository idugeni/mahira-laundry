import type { Metadata } from "next";
import { signIn } from "@/lib/actions/auth";

export const metadata: Metadata = {
	title: "Masuk",
	description:
		"Masuk ke akun Mahira Laundry Anda untuk mengelola pesanan, cek status cucian, dan dapatkan promo eksklusif.",
};

import { Suspense } from "react";
import { AuthClient } from "@/components/shared/auth/auth-client";
import { AuthSkeleton } from "@/components/shared/auth/auth-skeleton";

export default function LoginPage() {
	return (
		<Suspense fallback={<AuthSkeleton />}>
			<AuthClient type="login" action={signIn} />
		</Suspense>
	);
}
