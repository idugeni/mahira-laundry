import type { Metadata } from "next";
import { signIn } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Mahira Laundry Anda untuk mengelola pesanan, cek status cucian, dan dapatkan promo eksklusif.",
};

import { AuthClient } from "@/components/shared/auth-client";

export default function LoginPage() {
  return <AuthClient type="login" action={signIn} />;
}
