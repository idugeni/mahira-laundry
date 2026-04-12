import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Tentang Mahira Laundry — Layanan laundry premium terpercaya di Jakarta Salemba. Didirikan oleh Indira Maharani dengan visi kebersihan standar internasional.",
  openGraph: {
    title: "Tentang — Mahira Laundry Jakarta",
    description:
      "Layanan laundry premium terpercaya di Jakarta Salemba dengan standar kebersihan internasional.",
  },
};

import { TentangClient } from "@/components/shared/tentang-client";

export default function TentangPage() {
  return <TentangClient />;
}
