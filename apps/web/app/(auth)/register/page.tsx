import type { Metadata } from "next";
import { signUp } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Daftar",
  description:
    "Buat akun Mahira Laundry gratis dan dapatkan diskon 10% untuk order pertama Anda. Layanan laundry premium di Jakarta.",
};

import { AuthClient } from "@/components/shared/auth-client";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <AuthClient type="register" action={signUp} />
    </Suspense>
  );
}
