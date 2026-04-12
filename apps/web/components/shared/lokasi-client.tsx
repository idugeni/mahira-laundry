"use client";

import { motion } from "motion/react";
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineClock, HiOutlineChevronRight } from "react-icons/hi2";
import { OUTLET_SALEMBA } from "@/lib/constants";
import { IconType } from "react-icons";

interface Outlet {
  name: string;
  address: string;
  phone: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  links: string;
  color: string;
}

const outlets: Outlet[] = [
  {
    name: "Mahira Laundry Salemba",
    address: "Jl. Salemba Raya No. 28, Paseban, Senen, Jakarta Pusat 10440",
    phone: "021-3456789",
    hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
    links: `https://www.google.com/maps/dir/?api=1&destination=${OUTLET_SALEMBA.lat},${OUTLET_SALEMBA.lng}`,
    color: "bg-brand-primary",
  },
  {
    name: "Mahira Laundry Menteng",
    address: "Jl. Menteng Raya No. 15, Menteng, Jakarta Pusat 10340",
    phone: "021-3456790",
    hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
    links: "https://www.google.com/maps/dir/?api=1&destination=-6.196,106.843",
    color: "bg-blue-500",
  },
  {
    name: "Mahira Laundry Cikini",
    address: "Jl. Cikini Raya No. 42, Cikini, Menteng, Jakarta Pusat 10330",
    phone: "021-3456791",
    hours: { weekday: "07:00-21:00", weekend: "08:00-20:00" },
    links: "https://www.google.com/maps/dir/?api=1&destination=-6.1897,106.8407",
    color: "bg-purple-500",
  },
];

export function LokasiClient() {
  return (
    <div className="py-24 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl lg:text-5xl font-black font-[family-name:var(--font-heading)] text-slate-900"
          >
            Lokasi <span className="inline-block text-brand-gradient">Outlet</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-500 max-w-xl mx-auto text-lg font-medium"
          >
            Temukan kenyamanan layanan Mahira Laundry di dekat Anda.
          </motion.p>
        </div>

        {/* Map embed */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border-8 border-white mb-16 aspect-video lg:aspect-[21/9] relative z-10"
        >
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d${OUTLET_SALEMBA.lng}!3d${OUTLET_SALEMBA.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInNDIuNSJTIDEwNsKwNTEnMjEuMiJF!5e0!3m2!1sid!2sid!4v1`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Mahira Laundry"
            className="grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        {/* Outlet cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {outlets.map((outlet, i) => (
            <motion.div
              key={outlet.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all group"
            >
              <div className="flex items-center gap-2 mb-6 uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">
                <div className={`w-2 h-2 rounded-full ${outlet.color} animate-pulse`} />
                <span>Active Branch</span>
              </div>
              
              <h3 className="font-bold font-[family-name:var(--font-heading)] text-2xl text-slate-900 mb-4 group-hover:text-brand-primary transition-colors">
                {outlet.name}
              </h3>
              
              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">
                {outlet.address}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-brand-primary">
                    <span className="w-4 h-4 flex items-center justify-center"><HiOutlinePhone /></span>
                  </div>
                  <span>{outlet.phone}</span>
                </div>
                <div className="flex items-start gap-4 text-sm font-semibold text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-brand-primary shrink-0">
                    <span className="w-4 h-4 flex items-center justify-center"><HiOutlineClock /></span>
                  </div>
                  <div className="leading-tight">
                    <p>Sen–Jum: <span className="text-slate-400">{outlet.hours.weekday}</span></p>
                    <p className="mt-1">Sab–Min: <span className="text-slate-400">{outlet.hours.weekend}</span></p>
                  </div>
                </div>
              </div>
              
              <a
                href={outlet.links}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-slate-50 group-hover:bg-brand-primary group-hover:text-white transition-all font-bold text-slate-700"
              >
                <span>Petunjuk Arah</span>
                <span className="w-4 h-4 flex items-center justify-center transition-transform group-hover:translate-x-1"><HiOutlineChevronRight /></span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
