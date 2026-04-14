"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalItems?: number;
	itemsPerPage?: number;
	className?: string;
}

export function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	className,
}: PaginationControlsProps) {
	if (totalPages <= 1) return null;

	const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
	const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

	// Generate page numbers to show
	const getVisiblePages = () => {
		const pages: (number | "...")[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible + 2) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push("...");

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) pages.push(i);

			if (currentPage < totalPages - 2) pages.push("...");
			pages.push(totalPages);
		}
		return pages;
	};

	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-center justify-between gap-6 pt-8",
				className,
			)}
		>
			{/* Item counter */}
			{totalItems !== undefined && (
				<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
					Menampilkan{" "}
					<span className="text-slate-700">
						{startItem}–{endItem}
					</span>{" "}
					dari <span className="text-slate-700">{totalItems}</span> data
				</p>
			)}

			{/* Page controls */}
			<div className="flex items-center gap-2">
				{/* First page */}
				<Button
					variant="ghost"
					disabled={currentPage === 1}
					onClick={() => onPageChange(1)}
					className="w-10 h-10 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
				>
					<ChevronsLeft size={16} />
				</Button>

				{/* Previous page */}
				<Button
					variant="ghost"
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="w-10 h-10 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
				>
					<ChevronLeft size={16} />
				</Button>

				{/* Page numbers */}
				<div className="flex items-center gap-1.5 mx-2">
					{getVisiblePages().map((page, idx) =>
						page === "..." ? (
							<span
								key={`dots-${idx}`}
								className="w-8 text-center text-slate-300 text-xs font-black"
							>
								···
							</span>
						) : (
							<Button
								key={page}
								variant="ghost"
								onClick={() => onPageChange(page)}
								className={cn(
									"w-10 h-10 p-0 rounded-xl text-xs font-black transition-all",
									currentPage === page
										? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:text-white"
										: "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600",
								)}
							>
								{page}
							</Button>
						),
					)}
				</div>

				{/* Next page */}
				<Button
					variant="ghost"
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className="w-10 h-10 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
				>
					<ChevronRight size={16} />
				</Button>

				{/* Last page */}
				<Button
					variant="ghost"
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(totalPages)}
					className="w-10 h-10 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
				>
					<ChevronsRight size={16} />
				</Button>
			</div>
		</div>
	);
}

/** Hook for client-side pagination */
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const paginatedItems = items.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	return {
		currentPage,
		totalPages,
		totalItems: items.length,
		paginatedItems,
		setCurrentPage,
		itemsPerPage,
	};
}
