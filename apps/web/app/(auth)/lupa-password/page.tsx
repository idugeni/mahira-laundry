import type { Metadata } from "next";
import Link from "next/link";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { resetPassword } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Lupa Password",
  description:
    "Reset password akun Mahira Laundry Anda. Masukkan email untuk menerima link reset password.",
};

export default function LupaPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <MahiraLogo size={44} />
          </Link>
          <h1 className="mt-8 text-2xl font-bold font-[family-name:var(--font-heading)]">
            Lupa Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Masukkan email Anda untuk menerima link reset password
          </p>
        </div>
        <form action={resetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors text-sm"
          >
            Kirim Link Reset
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Ingat password?{" "}
          <Link
            href="/login"
            className="text-brand-primary font-medium hover:underline"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
