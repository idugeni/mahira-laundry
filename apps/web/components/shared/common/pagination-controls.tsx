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
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	className?: string;
}

export function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage = 10,
	onPageSizeChange,
	pageSizeOptions = [10, 25, 50, 100],
	className,
}: PaginationControlsProps) {
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

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

	const showPagination = totalPages > 1;

	if (!showPagination && !onPageSizeChange) return null;

	// Page navigation buttons (shared between mobile and desktop)
	const pageNavButtons = showPagination ? (
		<div className="flex items-center gap-1.5">
			{/* First page */}
			<Button
				variant="ghost"
				disabled={currentPage === 1}
				onClick={() => onPageChange(1)}
				className="w-9 h-9 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronsLeft size={14} />
			</Button>

			{/* Previous page */}
			<Button
				variant="ghost"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className="w-9 h-9 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronLeft size={14} />
			</Button>

			{/* Page numbers */}
			<div className="flex items-center gap-1">
				{getVisiblePages().map((page, idx) =>
					page === "..." ? (
						<span
							key={`dots-${idx}`}
							className="w-7 text-center text-slate-300 text-xs font-black"
						>
							···
						</span>
					) : (
						<Button
							key={page}
							variant="ghost"
							onClick={() => onPageChange(page)}
							className={cn(
								"w-9 h-9 p-0 rounded-xl text-xs font-black transition-all",
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
				className="w-9 h-9 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronRight size={14} />
			</Button>

			{/* Last page */}
			<Button
				variant="ghost"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(totalPages)}
				className="w-9 h-9 p-0 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronsRight size={14} />
			</Button>
		</div>
	) : null;

	// Data info text
	const dataInfo =
		totalItems !== undefined ? (
			<p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
				Menampilkan{" "}
				<span className="text-slate-700">
					{totalItems === 0 ? 0 : startItem}–{endItem}
				</span>{" "}
				dari <span className="text-slate-700">{totalItems}</span> data
			</p>
		) : null;

	// Rows-per-page selector
	const rowsSelector = onPageSizeChange ? (
		<div className="flex items-center gap-2">
			<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
				Tampilkan:
			</span>
			<div className="flex items-center gap-1">
				{pageSizeOptions.map((size) => (
					<button
						key={size}
						type="button"
						onClick={() => {
							onPageSizeChange(size);
							onPageChange(1);
						}}
						className={cn(
							"h-8 px-2.5 rounded-lg text-[10px] font-black transition-all",
							itemsPerPage === size
								? "bg-slate-900 text-white shadow-lg"
								: "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
						)}
					>
						{size}
					</button>
				))}
			</div>
		</div>
	) : null;

	return (
		<div className={cn("pt-6", className)}>
			{/* Mobile layout: two rows */}
			<div className="sm:hidden flex flex-col gap-3">
				{/* Row 1: data info (left) + rows selector (right) */}
				{(dataInfo || rowsSelector) && (
					<div className="flex items-center justify-between gap-2">
						<div>{dataInfo}</div>
						<div>{rowsSelector}</div>
					</div>
				)}
				{/* Row 2: centered page navigation */}
				{pageNavButtons && (
					<div className="flex justify-center">{pageNavButtons}</div>
				)}
			</div>

			{/* Desktop layout: three-column grid */}
			<div className="hidden sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">
				{/* Left: data info */}
				<div className="flex items-center">{dataInfo}</div>
				{/* Center: page navigation */}
				<div className="flex justify-center">{pageNavButtons}</div>
				{/* Right: rows-per-page selector */}
				<div className="flex justify-end">{rowsSelector}</div>
			</div>
		</div>
	);
}

/** Hook for client-side pagination with page size control */
export function usePagination<T>(items: T[], defaultPageSize = 10) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(defaultPageSize);

	const totalPages = Math.ceil(items.length / pageSize);
	const paginatedItems = items.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(1);
	};

	return {
		currentPage,
		totalPages,
		totalItems: items.length,
		paginatedItems,
		setCurrentPage,
		pageSize,
		setPageSize: handlePageSizeChange,
		itemsPerPage: pageSize,
	};
}
