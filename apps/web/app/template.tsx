"use client";

import { motion, AnimatePresence } from "motion/react";
import { MahiraLogo } from "@/components/brand/mahira-logo";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state setiap kali pathname berubah
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450); // Jeda premium yang pas (tidak terlalu lama, tidak terlalu cepat)

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="p-4 bg-slate-50 rounded-3xl shadow-sm border border-slate-100">
                <MahiraLogo size={64} showText={false} />
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute inset-0 w-1/2 bg-brand-primary"
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                  Mahira Premium
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
}
