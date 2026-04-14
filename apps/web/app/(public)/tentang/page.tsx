import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Tentang Mahira Laundry — Solusi laundry premium dengan standar kualitas internasional dan antar-jemput profesional.",
  openGraph: {
    title: "Tentang",
    description:
      "Layanan laundry terpercaya dengan komitmen terhadap kebersihan dan kualitas kain Anda.",
  },
};

import { TentangClient } from "@/components/shared/tentang-client";

export default function TentangPage() {
  return <TentangClient />;
}
