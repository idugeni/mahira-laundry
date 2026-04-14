import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number | string | null | undefined) {
  const value = typeof amount === "number" ? amount : Number(amount);

  if (Number.isNaN(value) || amount === null || amount === undefined) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/** Alias for formatIDR — used by admin pages */
export const formatRupiah = formatIDR;

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}Rb`;
  }
  return formatIDR(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
  const diff = (new Date(date).getTime() - Date.now()) / 1000;
  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), "seconds");
  if (Math.abs(diff) < 3600)
    return rtf.format(Math.round(diff / 60), "minutes");
  if (Math.abs(diff) < 86400)
    return rtf.format(Math.round(diff / 3600), "hours");
  return rtf.format(Math.round(diff / 86400), "days");
}

export function getDashboardUrl(role?: string | null): string {
  switch (role) {
    case "superadmin":
    case "admin":
      return "/admin";
    case "manager":
      return "/manager";
    case "kasir":
      return "/kasir";
    case "kurir":
      return "/kurir";
    case "customer":
    default:
      return "/customer";
  }
}


