import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Point of Sale",
  description: "Sistem POS kasir Mahira Laundry. Buat order, terima pembayaran, dan kelola antrian pelanggan.",
};

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
