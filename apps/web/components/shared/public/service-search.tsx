"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

interface ServiceSearchProps {
	variant?: "header" | "hero" | "section";
	placeholder?: string;
	className?: string;
}

export function ServiceSearch({
	variant = "section",
	placeholder = "Cari layanan (misal: sepatu, express, karpet)...",
	className = "",
}: ServiceSearchProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Sync with URL params
	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);

	const handleSearch = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (query.trim()) {
			router.push(`/layanan?q=${encodeURIComponent(query.trim())}`);
		} else {
			router.push("/layanan");
		}
	};

	const clearSearch = () => {
		setQuery("");
		inputRef.current?.focus();
	};

	if (variant === "header") {
		return (
			<div className={`relative ${className}`}>
				<div className="relative group">
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setTimeout(() => setIsFocused(false), 200)}
						placeholder="Cari..."
						className="w-40 focus:w-64 transition-all duration-500 bg-slate-100 border-none rounded-full py-2 pl-10 pr-10 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/20"
					/>
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
						<HiOutlineMagnifyingGlass size={16} />
					</div>
					<AnimatePresence>
						{query && (
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								onClick={clearSearch}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
							>
								<HiOutlineXMark size={14} />
							</motion.button>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	}

	return (
		<div className={`w-full max-w-3xl mx-auto max-w-full ${className}`}>
			<form onSubmit={handleSearch} className="relative group">
				<motion.div
					animate={isFocused ? { scale: 1.02, y: -4 } : { scale: 1, y: 0 }}
					className={`relative flex items-center bg-white rounded-[2rem] border-2 transition-all duration-500 shadow-2xl ${
						isFocused
							? "border-brand-primary shadow-brand-primary/20"
							: "border-slate-100 shadow-slate-200/50"
					}`}
				>
					<div
						className={`pl-4 md:pl-8 text-xl md:text-2xl transition-colors duration-300 ${isFocused ? "text-brand-primary" : "text-slate-300"}`}
					>
						<HiOutlineMagnifyingGlass />
					</div>

					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						placeholder={placeholder}
						className="flex-1 bg-transparent border-none focus:ring-0 py-4 md:py-6 px-3 md:px-6 text-base md:text-lg font-bold text-slate-900 placeholder:text-slate-300 min-w-0"
					/>

					<div className="pr-2 md:pr-4 flex items-center gap-1 md:gap-3">
						<AnimatePresence>
							{query && (
								<motion.button
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
									type="button"
									onClick={clearSearch}
									className="p-1 md:p-2 text-slate-400 hover:text-slate-600 transition-colors"
								>
									<HiOutlineXMark size={20} />
								</motion.button>
							)}
						</AnimatePresence>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="px-4 md:px-8 py-2 md:py-3 bg-brand-primary text-white rounded-2xl font-black text-xs md:text-sm shadow-xl shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all uppercase tracking-widest"
						>
							<span className="hidden min-[380px]:inline">Cari</span>
							<span className="min-[380px]:hidden">Go</span>
						</motion.button>
					</div>
				</motion.div>

				{/* Quick Suggestions */}
				<AnimatePresence>
					{isFocused && !query && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute top-full left-0 right-0 mt-4 p-4 md:p-6 bg-white rounded-[2rem] shadow-3xl border border-slate-50 z-50 overflow-hidden"
						>
							<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
								<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
								Layanan Populer
							</p>
							<div className="flex flex-wrap gap-2">
								{[
									"Cuci Sepatu",
									"Express 6 Jam",
									"Setrika Saja",
									"Dry Cleaning",
									"Cuci Karpet",
									"Boneka",
								].map((tag) => (
									<button
										key={tag}
										type="button"
										onClick={() => {
											setQuery(tag);
											handleSearch();
										}}
										className="px-4 py-2 bg-slate-50 hover:bg-brand-primary/10 text-slate-600 hover:text-brand-primary rounded-xl text-xs font-bold border border-slate-100 hover:border-brand-primary/20 transition-all"
									>
										{tag}
									</button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</form>
		</div>
	);
}
