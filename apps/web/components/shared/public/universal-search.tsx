"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

interface UniversalSearchProps {
	variant?: "header" | "hero" | "section";
	placeholder?: string;
	className?: string;
}

export function UniversalSearch({
	variant = "section",
	placeholder = "Cari layanan, galeri, lokasi...",
	className = "",
}: UniversalSearchProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setQuery(searchParams.get("q") || "");
	}, [searchParams]);

	const handleSearch = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (query.trim()) {
			router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
		} else {
			router.push("/cari");
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
						className="w-40 focus:w-64 transition-all duration-500 bg-slate-100 border-none rounded-full py-2 pl-10 pr-10 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20"
					/>
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
						<HiOutlineMagnifyingGlass size={16} />
					</div>
					<AnimatePresence>
						{query && (
							<motion.button
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
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
		<div className={`w-full max-w-2xl mx-auto min-w-0 ${className}`}>
			<form onSubmit={handleSearch} className="relative group">
				<motion.div
					animate={{ opacity: 1 }}
					className={`relative flex items-center bg-white/80 backdrop-blur-xl rounded-2xl border transition-[border-color,box-shadow] duration-500 ease-out ${
						isFocused
							? "border-brand-primary/30 shadow-[0_8px_30px_rgba(219,39,119,0.12)]"
							: "border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-slate-300/60"
					}`}
				>
					<div
						className={`pl-5 md:pl-6 text-lg md:text-xl transition-colors duration-300 ${isFocused ? "text-brand-primary" : "text-slate-400"}`}
					>
						<HiOutlineMagnifyingGlass />
					</div>

					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setTimeout(() => setIsFocused(false), 200)}
						placeholder={placeholder}
						className="flex-1 bg-transparent border-none focus:!outline-hidden focus:!ring-0 focus:!shadow-none focus:!border-none py-4 md:py-5 px-3 md:px-4 text-sm md:text-base font-semibold text-slate-900 placeholder:text-slate-400 min-w-0"
					/>

					<div className="pr-3 md:pr-4 flex items-center gap-2 shrink-0">
						<AnimatePresence>
							{query && (
								<motion.button
									initial={{ opacity: 0, x: 10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
									type="button"
									onClick={clearSearch}
									className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
								>
									<HiOutlineXMark size={16} />
								</motion.button>
							)}
						</AnimatePresence>

						{!query && (
							<div className="hidden md:flex items-center gap-1">
								<kbd className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black border border-slate-200 leading-none">
									⌘
								</kbd>
								<kbd className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black border border-slate-200 leading-none">
									K
								</kbd>
							</div>
						)}

						<motion.button
							type="submit"
							className="px-4 md:px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] md:text-xs shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all uppercase tracking-widest"
						>
							Cari
						</motion.button>
					</div>
				</motion.div>

				<div
					className="grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
					style={{
						gridTemplateRows: isFocused && !query ? "1fr" : "0fr",
						opacity: isFocused && !query ? 1 : 0,
					}}
				>
					<div className="overflow-hidden min-h-0">
						<div className="flex flex-wrap gap-2 pt-4">
							{[
								"Cuci Sepatu",
								"Express 6 Jam",
								"Setrika Saja",
								"Dry Cleaning",
								"Cuci Karpet",
								"Outlet Terdekat",
							].map((tag) => (
								<button
									key={tag}
									type="button"
									onClick={() => {
										setQuery(tag);
										handleSearch();
									}}
									className="px-4 py-2 bg-slate-50 hover:bg-brand-primary/10 text-slate-500 hover:text-brand-primary rounded-xl text-xs font-bold border border-slate-100 hover:border-brand-primary/20 transition-colors duration-200"
								>
									{tag}
								</button>
							))}
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
