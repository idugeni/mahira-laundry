"use client";

import Link from "next/link";
import { OUTLET_SALEMBA } from "@/lib/constants";
import { MahiraLogo } from "./mahira-logo";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlineClock } from "react-icons/hi2";
import { motion } from "motion/react";

export function MahiraFooter() {
  return (
    <footer className="bg-brand-primary-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <MahiraLogo size={40} showText={true} />
            <p className="mt-4 text-sm text-white/60 max-w-md">
              Layanan laundry premium terpercaya di Jakarta. Berpengalaman
              menangani berbagai jenis pakaian dan kain dengan teknologi modern.
            </p>
            <div className="mt-8 flex gap-4">
              <motion.a
                whileHover={{ y: -3 }}
                href={`https://wa.me/${OUTLET_SALEMBA.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors"
                title="WhatsApp"
              >
                <span className="w-5 h-5 flex items-center justify-center"><FaWhatsapp /></span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E4405F] transition-colors"
                title="Instagram"
              >
                <span className="w-5 h-5 flex items-center justify-center"><FaInstagram /></span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
                title="Facebook"
              >
                <span className="w-4 h-4 flex items-center justify-center"><FaFacebookF /></span>
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold font-[family-name:var(--font-heading)] mb-6 text-brand-accent">
              Layanan
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-accent" />
                  <span>Cuci Setrika</span>
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-accent" />
                  <span>Dry Cleaning</span>
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-accent" />
                  <span>Express</span>
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-accent" />
                  <span>Paket Kost</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold font-[family-name:var(--font-heading)] mb-6 text-brand-accent">
              Hubungi Kami
            </h4>
            <ul className="space-y-5 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-brand-accent shrink-0"><HiOutlineMapPin /></span>
                <span>{OUTLET_SALEMBA.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-brand-accent shrink-0"><HiOutlinePhone /></span>
                <span>{OUTLET_SALEMBA.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 flex items-center justify-center text-brand-accent shrink-0"><HiOutlineClock /></span>
                <div>
                  <p>Senin–Jumat: {OUTLET_SALEMBA.operatingHours.weekday}</p>
                  <p>Sabtu–Minggu: {OUTLET_SALEMBA.operatingHours.weekend}</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-white/40"
        >
          © {new Date().getFullYear()} Mahira Laundry. Hak cipta dilindungi.
        </motion.div>
      </div>
    </footer>
  );
}
