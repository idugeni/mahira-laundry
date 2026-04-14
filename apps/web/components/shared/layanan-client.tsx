"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { BiHomeAlt } from "react-icons/bi";
import { GiChelseaBoot, GiRolledCloth, GiWashingMachine } from "react-icons/gi";
import { HiOutlineClock, HiOutlineSparkles } from "react-icons/hi2";
import {
  MdOutlineDryCleaning,
  MdOutlineFlashOn,
  MdOutlineIron,
  MdOutlineLocalLaundryService,
} from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { formatIDR } from "@/lib/utils";

import { getDashboardUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ServiceDetailModal } from "./service-detail-modal";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { useAuth } from "@/hooks/use-auth";
import { Service } from "@/lib/types";

export function LayananClient({ initialServices }: { initialServices: Service[] }) {
  const { user, profile, loading } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const serviceSlug = searchParams.get("s");
    if (serviceSlug) {
      const service = initialServices.find(s => s.id === serviceSlug || s.slug === serviceSlug);
      if (service) {
        setSelectedService(service);
        setIsDetailOpen(true);
      }
    } else {
      setIsDetailOpen(false);
    }
  }, [searchParams, initialServices]);

  const handleServiceClick = (slug: string) => {
    router.push(`/layanan?s=${slug}`, { scroll: false });
  };

  const handleCloseDetail = () => {
    router.push("/layanan", { scroll: false });
  };

  let orderHref = "/register";
  if (user) {
    if (profile?.role === "customer") {
      orderHref = "/customer/order/baru";
    } else {
      orderHref = getDashboardUrl(profile?.role as string);
    }
  }

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("sepatu")) return GiChelseaBoot;
    if (n.includes("setrika")) return MdOutlineIron;
    if (n.includes("express")) return MdOutlineFlashOn;
    if (n.includes("dry")) return MdOutlineDryCleaning;
    if (n.includes("kost")) return RiGraduationCapLine;
    return MdOutlineLocalLaundryService;
  };

  const getServiceStyles = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("sepatu")) return { color: "text-teal-500", bg: "bg-teal-50" };
    if (n.includes("setrika")) return { color: "text-orange-500", bg: "bg-orange-50" };
    if (n.includes("express")) return { color: "text-yellow-500", bg: "bg-yellow-50" };
    if (n.includes("dry")) return { color: "text-purple-500", bg: "bg-purple-50" };
    if (n.includes("kost")) return { color: "text-pink-500", bg: "bg-pink-50" };
    return { color: "text-blue-500", bg: "bg-blue-50" };
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-bold">Memuat layanan...</p>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header content unchanged... skipping for brevity in thought but I will include it in replacement */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-bold mb-6"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <HiOutlineSparkles />
            </span>
            <span>Kualitas Premium</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900"
          >
            Daftar{" "}
            <span className="inline-block text-brand-gradient">Layanan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-500 max-w-xl mx-auto text-lg"
          >
            Pilih layanan yang sesuai dengan kebutuhan perawatan pakaian Anda.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialServices.map((service, i) => {
            const Icon = getServiceIcon(service.name);
            const styles = getServiceStyles(service.name);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => handleServiceClick(service.slug || service.id)}
                className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-brand-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${styles.bg} flex items-center justify-center text-3xl ${styles.color} mb-8 shadow-inner`}
                >
                  {service.icon ? (
                    <span className="shrink-0">{service.icon}</span>
                  ) : (
                    <Icon />
                  )}
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-3 grayscale group-hover:grayscale-0 transition-all">
                  {service.name}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-xl font-black text-brand-primary">
                    {formatIDR(service.price)}
                    <span className="text-xs text-slate-400 font-medium">
                      /{service.unit}
                    </span>
                  </span>
                  <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
                    <span className="w-5 h-5 flex items-center justify-center">
                      <HiOutlineArrowRight />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            href={orderHref}
            className="inline-flex px-10 py-4 bg-brand-primary text-white rounded-full font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1"
          >
            {user ? "Pesan Laundry Sekarang" : "Daftar & Pesan"}
          </Link>
        </motion.div>
      </div>

      <ServiceDetailModal 
        service={selectedService} 
        isOpen={isDetailOpen} 
        onClose={handleCloseDetail} 
      />
    </div>
  );
}
