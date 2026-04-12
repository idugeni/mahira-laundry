import type { Metadata } from "next";
import Link from "next/link";
import { OUTLET_SALEMBA } from "@/lib/constants";
import { HiOutlineSparkles, HiOutlineArrowRight, HiOutlineCheckBadge, HiOutlineMapPin } from "react-icons/hi2";
import { MdOutlineLocalLaundryService, MdOutlineIron, MdOutlineFlashOn, MdOutlineDryCleaning, MdOutlineCheckCircle } from "react-icons/md";
import { GiChelseaBoot } from "react-icons/gi";
import { RiGraduationCapLine } from "react-icons/ri";

export const metadata: Metadata = {
  title: "Mahira Laundry — Jakarta Salemba",
  description:
    "Layanan laundry premium terpercaya di Jakarta Salemba. Cuci lipat, setrika, dry cleaning, express 6 jam dengan antar-jemput gratis. Mulai Rp 7.000/kg.",
  openGraph: {
    title: "Mahira Laundry — Layanan Laundry Premium Jakarta Salemba",
    description:
      "Cucian Bersih, Hidup Nyaman. Layanan cuci setrika, dry cleaning, dan express 6 jam. Antar-jemput gratis.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LaundryBusiness",
  "name": "Mahira Laundry",
  "image": "https://mahiralaundry.id/logo.png",
  "description": "Layanan laundry premium terpercaya di Jakarta Salemba.",
  "@id": "https://mahiralaundry.id",
  "url": "https://mahiralaundry.id",
  "telephone": OUTLET_SALEMBA.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": OUTLET_SALEMBA.address,
    "addressLocality": "Jakarta Pusat",
    "addressRegion": "Jakarta",
    "postalCode": "10440",
    "addressCountry": "ID"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": OUTLET_SALEMBA.lat,
    "longitude": OUTLET_SALEMBA.lng
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:00",
      "closes": "21:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  ],
  "priceRange": "$$"
};

import { HomeClient } from "@/components/shared/home-client";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div id="home-page-container">
        <HomeClient />
      </div>
    </>
  );
}
