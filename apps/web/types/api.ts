export type { Database, Json } from "./database";

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	success?: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
