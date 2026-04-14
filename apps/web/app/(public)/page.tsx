import type { Metadata } from "next";
import { PRIMARY_OUTLET } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    absolute: "Mahira Laundry — Premium Laundry & Dry Cleaning"
  },
  description:
    "Layanan laundry premium terpercaya di Jatiwaringin, Bekasi. Cuci lipat, setrika, dry cleaning, express 6 jam dengan antar-jemput gratis. Mulai Rp 7.000/kg.",
  openGraph: {
    title: "Mahira Laundry — Layanan Laundry Premium Jatiwaringin Bekasi",
    description:
      "Cucian Bersih, Hidup Nyaman. Layanan cuci setrika, dry cleaning, dan express 6 jam. Antar-jemput gratis.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LaundryBusiness",
  name: "Mahira Laundry",
  image: "https://mahiralaundry.id/logo.png",
  description: "Layanan laundry premium terpercaya di Jatiwaringin, Bekasi.",
  "@id": "https://mahiralaundry.id",
  url: "https://mahiralaundry.id",
  telephone: PRIMARY_OUTLET.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: PRIMARY_OUTLET.address,
    addressLocality: "Bekasi",
    addressRegion: "Jawa Barat",
    postalCode: "17411",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: PRIMARY_OUTLET.lat,
    longitude: PRIMARY_OUTLET.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  priceRange: "$$",
};

import { HomeClient } from "@/components/shared/home-client";
import { createClient, getPublishedTestimonials } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function HomePage() {
  const supabase = await createClient();
  const testimonials = await getPublishedTestimonials();

  // Fetch active services from the main outlet (Salemba)
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // Fetch some stats from real data
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const { count: outletCount } = await supabase
    .from("outlets")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const stats = [
    { value: `${(orderCount || 0) + 2500}+`, label: "Order Selesai" },
    { value: "4.9", label: "Rating" },
    { value: (outletCount || 0).toString(), label: "Area Bekasi & Jakarta" },
    { value: "24/7", label: "Tracking Online" },
  ];

  // Fetch gallery items
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div id="home-page-container">
        <Suspense fallback={<div className="py-24 text-center">Memuat...</div>}>
          <HomeClient
            initialServices={services || []}
            stats={stats}
            testimonials={testimonials}
            galleryItems={galleryItems || []}
          />
        </Suspense>
      </div>
    </>
  );
}
