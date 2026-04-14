import type { Metadata } from "next";
import { signIn } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Mahira Laundry Anda untuk mengelola pesanan, cek status cucian, dan dapatkan promo eksklusif.",
};

import { AuthClient } from "@/components/shared/auth-client";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <AuthClient type="login" action={signIn} />
    </Suspense>
  );
}
