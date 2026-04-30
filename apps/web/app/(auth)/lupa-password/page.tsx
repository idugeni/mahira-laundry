import type { Metadata } from "next";
import { LupaPasswordClient } from "@/app/(auth)/lupa-password/lupa-password-client";

export const metadata: Metadata = {
	title: "Lupa Password",
	description:
		"Reset password akun Mahira Laundry Anda dengan aman melalui email terdaftar.",
};

export default function LupaPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ success?: string; error?: string }>;
}) {
	return <LupaPasswordClient searchParams={searchParams} />;
}
