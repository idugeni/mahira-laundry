"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import React, { useState } from "react";
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

	// Page number buttons (responsive: fewer on mobile, more on lg)
	const pageNumbers = (() => {
		let ellipsisCount = 0;
		return getVisiblePages().map((page) =>
			page === "..." ? (
				<span
					key={`ellipsis-${++ellipsisCount}`}
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
						"w-8 h-8 md:w-9 md:h-9 p-0 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all",
						currentPage === page
							? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:text-white"
							: "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600",
					)}
				>
					{page}
				</Button>
			),
		);
	})();

	// Page navigation buttons (shared between all layouts)
	const pageNavButtons = showPagination ? (
		<div className="flex items-center gap-1 md:gap-1.5">
			{/* First page */}
			<Button
				variant="ghost"
				disabled={currentPage === 1}
				onClick={() => onPageChange(1)}
				className="w-8 h-8 md:w-9 md:h-9 p-0 rounded-lg md:rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronsLeft size={13} className="md:w-3.5 md:h-3.5" />
			</Button>

			{/* Previous page */}
			<Button
				variant="ghost"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className="w-8 h-8 md:w-9 md:h-9 p-0 rounded-lg md:rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronLeft size={13} className="md:w-3.5 md:h-3.5" />
			</Button>

			{/* Page numbers */}
			<div className="flex items-center gap-0.5 md:gap-1">{pageNumbers}</div>

			{/* Next page */}
			<Button
				variant="ghost"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				className="w-8 h-8 md:w-9 md:h-9 p-0 rounded-lg md:rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronRight size={13} className="md:w-3.5 md:h-3.5" />
			</Button>

			{/* Last page */}
			<Button
				variant="ghost"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(totalPages)}
				className="w-8 h-8 md:w-9 md:h-9 p-0 rounded-lg md:rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 transition-all"
			>
				<ChevronsRight size={13} className="md:w-3.5 md:h-3.5" />
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
			{/* Mobile layout: stacked rows */}
			<div className="flex flex-col gap-3 md:hidden">
				{(dataInfo || rowsSelector) && (
					<div className="flex items-center justify-between gap-2">
						<div>{dataInfo}</div>
						<div>{rowsSelector}</div>
					</div>
				)}
				{pageNavButtons && (
					<div className="flex justify-center">{pageNavButtons}</div>
				)}
			</div>

			{/* md layout: compact three-column grid */}
			<div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-4 lg:hidden">
				<div className="flex items-center">{dataInfo}</div>
				<div className="flex justify-center">{pageNavButtons}</div>
				<div className="flex justify-end">{rowsSelector}</div>
			</div>

			{/* lg layout: spacious three-column grid with more breathing room */}
			<div className="hidden lg:grid lg:grid-cols-3 lg:items-center lg:gap-6">
				<div className="flex items-center">{dataInfo}</div>
				<div className="flex justify-center">{pageNavButtons}</div>
				<div className="flex justify-end">{rowsSelector}</div>
			</div>
		</div>
	);
}

/** Hook for client-side pagination with page size control */
export function usePagination<T>(items: T[], defaultPageSize = 10) {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(defaultPageSize);

	const totalPages = Math.ceil(items.length / pageSize) || 0;

	// Reset currentPage if it's out of bounds after items change
	React.useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [totalPages, currentPage]);

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
