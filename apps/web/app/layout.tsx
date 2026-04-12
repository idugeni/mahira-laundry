import type { Metadata } from "next";
import { Geist, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Mahira Laundry — Jakarta Salemba",
    template: "%s | Mahira Laundry",
  },
  description:
    "Layanan laundry premium terpercaya di Jakarta Salemba. Cuci, setrika, dry cleaning berkualitas tinggi dengan pickup & delivery.",
  keywords: [
    "laundry",
    "jakarta",
    "salemba",
    "cuci",
    "setrika",
    "dry cleaning",
    "mahira",
  ],
  openGraph: {
    title: "Mahira Laundry — Jakarta Salemba",
    description: "Layanan laundry premium terpercaya di Jakarta Salemba.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-body)]">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
