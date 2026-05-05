import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserRole } from "@/lib/types";

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
		month: "long",
		year: "numeric",
	}).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
	const result = new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date(date));

	return `${result.replace(/\./g, ":")} WIB`;
}

export function formatRelativeTime(date: string | Date): string {
	const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
	const diff = (new Date(date).getTime() - Date.now()) / 1000;
	if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), "seconds");
	if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), "minutes");
	if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), "hours");
	return rtf.format(Math.round(diff / 86400), "days");
}

export function getDashboardUrl(role?: UserRole | string | null): string {
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
		default:
			return "/customer";
	}
}

export function formatPhoneForWhatsApp(phone: string): string {
	if (!phone) return "";

	// Remove all non-digit characters
	let cleaned = phone.replace(/\D/g, "");

	// If input is too short, return as is (not a valid phone number)
	if (cleaned.length < 5) return cleaned;

	// Handle international '00' prefix (e.g., 0062 -> 62)
	if (cleaned.startsWith("0062")) {
		cleaned = cleaned.substring(2);
	}

	// Handle case where user types "0812..."
	if (cleaned.startsWith("0")) {
		cleaned = `62${cleaned.substring(1)}`;
	}

	// Handle case where user types "+62 0812..." which becomes "620812..."
	if (cleaned.startsWith("620")) {
		cleaned = `62${cleaned.substring(3)}`;
	}

	// Handle case where user types "812..." (without 0 or 62)
	// Indonesian mobile numbers are typically 9-13 digits after the prefix
	if (cleaned.startsWith("8") && cleaned.length >= 9 && cleaned.length <= 13) {
		cleaned = `62${cleaned}`;
	}

	return cleaned;
}
