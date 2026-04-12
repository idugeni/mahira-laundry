"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { formatIDR } from "@/lib/utils";
import { HiOutlineSparkles, HiOutlineClock } from "react-icons/hi2";
import { MdOutlineLocalLaundryService, MdOutlineIron, MdOutlineFlashOn, MdOutlineDryCleaning } from "react-icons/md";
import { GiChelseaBoot, GiRolledCloth, GiWashingMachine } from "react-icons/gi";
import { RiGraduationCapLine } from "react-icons/ri";
import { BiHomeAlt } from "react-icons/bi";
import { IconType } from "react-icons";

interface Service {
  icon: IconType;
  name: string;
  price: number;
  unit: string;
  duration: string;
  desc: string;
  popular: boolean;
  color: string;
  bg: string;
}

const allServices: Service[] = [
  {
    icon: MdOutlineLocalLaundryService,
    name: "Cuci Lipat Reguler",
    price: 7000,
    unit: "kg",
    duration: "24 jam",
    desc: "Cuci bersih dan dilipat rapi. Cocok untuk pakaian sehari-hari.",
    popular: false,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    icon: MdOutlineIron,
    name: "Cuci Setrika Reguler",
    price: 10000,
    unit: "kg",
    duration: "24 jam",
    desc: "Cuci bersih, disetrika rapi, dan dilipat. Pakaian siap pakai.",
    popular: true,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    icon: MdOutlineFlashOn,
    name: "Express Cuci Setrika",
    price: 15000,
    unit: "kg",
    duration: "6 jam",
    desc: "Layanan kilat, selesai dalam 6 jam. Cocok untuk kebutuhan mendesak.",
    popular: true,
    color: "text-yellow-500",
    bg: "bg-yellow-50"
  },
  {
    icon: MdOutlineDryCleaning,
    name: "Dry Cleaning",
    price: 25000,
    unit: "item",
    duration: "48 jam",
    desc: "Untuk pakaian formal, jas, gaun, dan bahan sensitif.",
    popular: false,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    icon: GiChelseaBoot,
    name: "Cuci Sepatu",
    price: 35000,
    unit: "pasang",
    duration: "48 jam",
    desc: "Deep cleaning sepatu sneakers, kulit, atau kanvas.",
    popular: false,
    color: "text-teal-500",
    bg: "bg-teal-50"
  },
  {
    icon: BiHomeAlt,
    name: "Cuci Karpet",
    price: 20000,
    unit: "meter",
    duration: "72 jam",
    desc: "Cuci karpet segala ukuran dengan mesin khusus.",
    popular: false,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    icon: GiRolledCloth,
    name: "Cuci Bed Cover",
    price: 30000,
    unit: "item",
    duration: "48 jam",
    desc: "Cuci bed cover, sprei, dan selimut tebal.",
    popular: false,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    icon: RiGraduationCapLine,
    name: "Paket Kost",
    price: 8000,
    unit: "kg",
    duration: "48 jam",
    desc: "Paket hemat mahasiswa. Maks 5kg per minggu, cuci setrika.",
    popular: true,
    color: "text-pink-500",
    bg: "bg-pink-50"
  },
  {
    icon: GiWashingMachine,
    name: "Cuci Gordyn",
    price: 15000,
    unit: "meter",
    duration: "72 jam",
    desc: "Cuci gordyn/vitrase segala bahan dan ukuran.",
    popular: false,
    color: "text-slate-500",
    bg: "bg-slate-50"
  },
];

export function LayananClient() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-bold mb-6"
          >
            <span className="w-4 h-4 flex items-center justify-center"><HiOutlineSparkles /></span>
            <span>Kualitas Premium</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900"
          >
            Daftar <span className="inline-block text-brand-gradient">Layanan</span>
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
          {allServices.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-brand-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              {service.popular && (
                <div className="absolute -top-3 right-8 px-4 py-1 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-accent/30 z-10">
                  Populer
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <service.icon />
              </div>
              <h3 className="font-bold font-[family-name:var(--font-heading)] text-xl text-slate-900 group-hover:text-brand-primary transition-colors">
                {service.name}
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed min-h-[40px]">
                {service.desc}
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                <div>
                  <span className="text-brand-primary font-black text-2xl">
                    {formatIDR(service.price)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    /{service.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-100">
                  <span className="w-3.5 h-3.5 flex items-center justify-center"><HiOutlineClock /></span>
                  <span>{service.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
        >
          <Link
            href="/register"
            className="inline-flex px-10 py-4 bg-brand-primary text-white rounded-full font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:-translate-y-1"
          >
            Pesan Sekarang
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
