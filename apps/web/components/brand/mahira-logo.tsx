"use client";

import { motion } from "motion/react";

interface MahiraLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function MahiraLogo({
  size = 40,
  className = "",
  showText = true,
}: MahiraLogoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#1a6b4a" />
        <path
          d="M12 32V18L18 24L24 16L30 24L36 18V32"
          stroke="#d4a017"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="24" cy="14" r="3" fill="#d4a017" />
        <path
          d="M16 35H32"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="font-[family-name:var(--font-heading)] font-bold text-lg leading-tight tracking-tight">
            <span className="text-brand-primary">Mahira</span>
            <span className="text-brand-accent">Laundry</span>
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Jakarta Salemba
          </span>
        </div>
      )}
    </motion.div>
  );
}
