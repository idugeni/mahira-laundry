import type { Metadata } from "next";
import { OUTLET_SALEMBA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Lokasi Outlet",
  description:
    "Temukan outlet Mahira Laundry terdekat di Jakarta Pusat: Salemba, Menteng, dan Cikini. Buka setiap hari dengan layanan antar-jemput.",
  openGraph: {
    title: "Lokasi Outlet — Mahira Laundry Jakarta",
    description:
      "3 outlet Mahira Laundry di Jakarta Pusat. Buka setiap hari 07:00–21:00.",
  },
};

const outlets = [
  {
    name: "Mahira Laundry Salemba",
    address: "Jl. Salemba Raya No. 28, Paseban, Senen, Jakarta Pusat 10440",
    phone: "021-3456789",
    hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
    lat: -6.2115,
    lng: 106.8559,
    color: "bg-brand-primary",
  },
  {
    name: "Mahira Laundry Menteng",
    address: "Jl. Menteng Raya No. 15, Menteng, Jakarta Pusat 10340",
    phone: "021-3456790",
    hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
    lat: -6.196,
    lng: 106.843,
    color: "bg-blue-500",
  },
  {
    name: "Mahira Laundry Cikini",
    address: "Jl. Cikini Raya No. 42, Cikini, Menteng, Jakarta Pusat 10330",
    phone: "021-3456791",
    hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
    lat: -6.1897,
    lng: 106.8407,
    color: "bg-purple-500",
  },
];

import { LokasiClient } from "@/components/shared/lokasi-client";

export default function LokasiPage() {
  return <LokasiClient />;
}
