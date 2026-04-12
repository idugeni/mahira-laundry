import type { Metadata } from "next";
import Link from "next/link";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { signUp } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Mahira Laundry gratis dan dapatkan diskon 10% untuk order pertama Anda. Layanan laundry premium di Jakarta.",
};


import { AuthClient } from "@/components/shared/auth-client";

export default function RegisterPage() {
  return <AuthClient type="register" action={signUp} />;
}
