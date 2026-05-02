"use client";

import type { ReactNode } from "react";
import { PaginationControls, usePagination } from "@/components/shared/common/pagination-controls";

interface PaginatedGridProps<T> {
	items: T[];
	defaultPageSize?: number;
	pageSizeOptions?: number[];
	renderItem: (item: T) => ReactNode;
	className?: string;
	gridClassName?: string;
	emptyState?: ReactNode;
}

export function PaginatedGrid<T extends { id?: string }>({
	items,
	defaultPageSize = 12,
	pageSizeOptions,
	renderItem,
	className,
	gridClassName,
	emptyState,
}: PaginatedGridProps<T>) {
	const {
		currentPage,
		totalPages,
		totalItems,
		paginatedItems,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePagination(items, defaultPageSize);

	if (items.length === 0) {
		return emptyState ? emptyState : null;
	}

	return (
		<div className={className}>
			<div className={gridClassName}>
				{paginatedItems.map((item, i) => (
					<div key={item.id ?? i}>{renderItem(item)}</div>
				))}
			</div>

			<PaginationControls
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				totalItems={totalItems}
				itemsPerPage={pageSize}
				onPageSizeChange={setPageSize}
				pageSizeOptions={pageSizeOptions}
			/>
		</div>
	);
}
