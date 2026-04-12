import type { Metadata } from "next";
import Link from "next/link";
import { formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Layanan Laundry",
  description:
    "Daftar lengkap layanan laundry Mahira Laundry Jakarta Salemba: cuci lipat, cuci setrika, express, dry cleaning, cuci sepatu, dan lainnya.",
  openGraph: {
    title: "Layanan — Mahira Laundry Jakarta",
    description:
      "Layanan laundry premium di Salemba, Jakarta Pusat. Mulai dari Rp 7.000/kg.",
  },
};

const allServices = [
  {
    icon: "🧺",
    name: "Cuci Lipat Reguler",
    price: 7000,
    unit: "kg",
    duration: "24 jam",
    desc: "Cuci bersih dan dilipat rapi. Cocok untuk pakaian sehari-hari.",
    popular: false,
  },
  {
    icon: "👔",
    name: "Cuci Setrika Reguler",
    price: 10000,
    unit: "kg",
    duration: "24 jam",
    desc: "Cuci bersih, disetrika rapi, dan dilipat. Pakaian siap pakai.",
    popular: true,
  },
  {
    icon: "⚡",
    name: "Express Cuci Setrika",
    price: 15000,
    unit: "kg",
    duration: "6 jam",
    desc: "Layanan kilat, selesai dalam 6 jam. Cocok untuk kebutuhan mendesak.",
    popular: true,
  },
  {
    icon: "🧥",
    name: "Dry Cleaning",
    price: 25000,
    unit: "item",
    duration: "48 jam",
    desc: "Untuk pakaian formal, jas, gaun, dan bahan sensitif.",
    popular: false,
  },
  {
    icon: "👟",
    name: "Cuci Sepatu",
    price: 35000,
    unit: "pasang",
    duration: "48 jam",
    desc: "Deep cleaning sepatu sneakers, kulit, atau kanvas.",
    popular: false,
  },
  {
    icon: "🏠",
    name: "Cuci Karpet",
    price: 20000,
    unit: "meter",
    duration: "72 jam",
    desc: "Cuci karpet segala ukuran dengan mesin khusus.",
    popular: false,
  },
  {
    icon: "🛏️",
    name: "Cuci Bed Cover",
    price: 30000,
    unit: "item",
    duration: "48 jam",
    desc: "Cuci bed cover, sprei, dan selimut tebal.",
    popular: false,
  },
  {
    icon: "🎓",
    name: "Paket Kost Mingguan",
    price: 8000,
    unit: "kg",
    duration: "48 jam",
    desc: "Paket hemat mahasiswa. Maks 5kg per minggu, cuci setrika.",
    popular: true,
  },
  {
    icon: "🪟",
    name: "Cuci Gordyn",
    price: 15000,
    unit: "meter",
    duration: "72 jam",
    desc: "Cuci gordyn/vitrase segala bahan dan ukuran.",
    popular: false,
  },
  {
    icon: "♨️",
    name: "Setrika Saja",
    price: 6000,
    unit: "kg",
    duration: "12 jam",
    desc: "Layanan setrika tanpa cuci. Pakaian rapi dan siap pakai.",
    popular: false,
  },
];

import { LayananClient } from "@/components/shared/layanan-client";

export default function LayananPage() {
  return <LayananClient />;
}
