/**
 * mahira-laundry/lib/types/index.ts
 * Centralized Type Definitions for Mahira Laundry
 */

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export type UserRole =
	| "customer"
	| "kasir"
	| "kurir"
	| "manager"
	| "superadmin";

export type OrderStatus =
	| "pending"
	| "confirmed"
	| "picked_up"
	| "washing"
	| "ironing"
	| "ready"
	| "delivering"
	| "completed"
	| "cancelled";

export type PaymentStatus =
	| "unpaid"
	| "pending"
	| "paid"
	| "refunded"
	| "failed";

export type PaymentMethod =
	| "cash"
	| "qris"
	| "bank_transfer"
	| "gopay"
	| "ovo"
	| "dana"
	| "shopeepay";

export type DeliveryType = "pickup" | "delivery" | "both";

export type DeliveryStatus =
	| "assigned"
	| "on_the_way"
	| "arrived"
	| "completed"
	| "failed";

export type ServiceUnit = "kg" | "item" | "pasang" | "meter";

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export type ShiftType = "pagi" | "siang" | "malam";

export type NotificationType =
	| "order_update"
	| "payment"
	| "delivery"
	| "promotion"
	| "system";

export type VoucherType = "percentage" | "fixed_amount" | "free_delivery";

// ─────────────────────────────────────────────
// ENTITY INTERFACES
// ─────────────────────────────────────────────

export interface Outlet {
	id: string;
	name: string;
	slug: string;
	address: string;
	phone?: string | null;
	whatsapp?: string | null;
	email?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	operating_hours?: Record<string, string>;
	is_active: boolean;
	is_franchise: boolean;
	franchise_fee: number;
	image_url?: string | null;
	created_at: string;
	updated_at: string;
}

export interface Profile {
	id: string;
	full_name: string;
	phone?: string | null;
	email?: string | null;
	avatar_url?: string | null;
	role: UserRole;
	outlet_id?: string | null;
	loyalty_tier: LoyaltyTier;
	loyalty_points: number;
	referral_code?: string | null;
	referred_by?: string | null;
	addresses?: Record<string, unknown>[];
	notification_preferences?: {
		whatsapp: boolean;
		email: boolean;
		push: boolean;
	};
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Service {
	id: string;
	outlet_id: string;
	name: string;
	slug: string;
	description?: string | null;
	category?: string | null;
	unit: ServiceUnit;
	price: number;
	estimated_duration_hours: number;
	icon?: string | null;
	sort_order: number;
	is_active: boolean;
	is_express: boolean;
	express_multiplier: number;
	created_at: string;
	updated_at: string;
	features?: string[];
	is_featured?: boolean;
}

export interface Order {
	id: string;
	order_number: string;
	customer_id: string;
	outlet_id: string;
	status: OrderStatus;
	pickup_address?: string | null;
	pickup_lat?: number | null;
	pickup_lng?: number | null;
	delivery_address?: string | null;
	delivery_lat?: number | null;
	delivery_lng?: number | null;
	delivery_type: DeliveryType;
	delivery_fee: number;
	subtotal: number;
	discount: number;
	voucher_id?: string | null;
	total: number;
	notes?: string | null;
	estimated_completion?: string | null;
	completed_at?: string | null;
	cancelled_at?: string | null;
	cancel_reason?: string | null;
	kasir_id?: string | null;
	washer_id?: string | null;
	ironer_id?: string | null;
	qc_id?: string | null;
	created_at: string;
	updated_at: string;
	order_items?: OrderItem[];
	customer?: Profile;
	outlet?: Outlet;
}

export interface OrderItem {
	id: string;
	order_id: string;
	service_id: string;
	service_name: string;
	quantity: number;
	unit: ServiceUnit;
	unit_price: number;
	is_express: boolean;
	subtotal: number;
	notes?: string | null;
	services?: Service;
	created_at: string;
}

export interface Delivery {
	id: string;
	order_id: string;
	courier_id: string;
	status: DeliveryStatus;
	current_lat?: number | null;
	current_lng?: number | null;
	estimated_arrival?: string | null;
	completed_at?: string | null;
	created_at: string;
	updated_at: string;
}

export interface Payment {
	id: string;
	order_id: string;
	amount: number;
	method: PaymentMethod;
	status: PaymentStatus;
	midtrans_transaction_id?: string | null;
	midtrans_order_id?: string | null;
	midtrans_snap_token?: string | null;
	payment_url?: string | null;
	paid_at?: string | null;
	expired_at?: string | null;
	metadata?: Record<string, unknown>;
	created_at: string;
	updated_at: string;
}

export interface InventoryItem {
	id: string;
	outlet_id: string;
	name: string;
	sku?: string | null;
	category?: string | null;
	quantity: number;
	unit: string;
	min_stock: number;
	cost_per_unit: number;
	supplier?: string | null;
	last_restocked_at?: string | null;
	notes?: string | null;
	created_at: string;
	updated_at: string;
}

export interface GalleryItem {
	id: string;
	title: string;
	description?: string | null;
	image_url: string;
	category?: string | null;
	is_active: boolean;
	sort_order: number;
	created_at: string;
}

export interface AppNotification {
	id: string;
	user_id: string;
	type: NotificationType;
	title: string;
	body: string;
	metadata?: Record<string, unknown>;
	is_read: boolean;
	read_at?: string | null;
	created_at: string;
}

export interface Testimonial {
	id: string;
	customer_id: string;
	content: string;
	rating: number;
	is_published: boolean;
	created_at: string;
	profiles?: {
		full_name: string;
		avatar_url?: string | null;
	};
}

// ─────────────────────────────────────────────
// RESPONSE TYPES
// ─────────────────────────────────────────────

export interface ActionResponse<T = void> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// ─────────────────────────────────────────────
// PAKET USAHA LAUNDRY
// ─────────────────────────────────────────────

export type InquiryStatus =
	| "new"
	| "contacted"
	| "negotiating"
	| "converted"
	| "rejected";

export type PackageTier = "Starter" | "Standard" | "Premium" | "Custom";

export interface PackageItem {
	name: string;
	quantity?: number;
	spec?: string;
}

export interface BusinessPackage {
	id: string;
	name: string;
	tier: PackageTier;
	description?: string | null;
	price: number;
	promo_price?: number | null;
	promo_expires_at?: string | null;
	items: PackageItem[];
	training_duration_days?: number | null;
	support_coverage?: string | null;
	estimated_roi?: string | null;
	image_url?: string | null;
	is_featured: boolean;
	is_active: boolean;
	sort_order: number;
	created_at: string;
	updated_at: string;
}

export interface BusinessPackageInquiry {
	id: string;
	package_id?: string | null;
	package_name: string;
	full_name: string;
	phone: string;
	email: string;
	city: string;
	budget_range?: string | null;
	message?: string | null;
	status: InquiryStatus;
	converted_outlet_id?: string | null;
	created_at: string;
	updated_at: string;
}

export interface InquiryLog {
	id: string;
	inquiry_id: string;
	changed_by: string;
	old_status?: string | null;
	new_status: string;
	note?: string | null;
	created_at: string;
}

export interface InquiryStats {
	total: number;
	new: number;
	negotiating: number;
	converted: number;
}

export interface CreatePackageInput {
	name: string;
	tier: PackageTier;
	description?: string;
	price: number;
	promo_price?: number | null;
	promo_expires_at?: string | null;
	items: PackageItem[];
	training_duration_days?: number | null;
	support_coverage?: string | null;
	estimated_roi?: string | null;
	image_url?: string | null;
	is_featured?: boolean;
	is_active?: boolean;
	sort_order?: number;
}

export type UpdatePackageInput = Partial<CreatePackageInput>;

export interface SubmitInquiryInput {
	package_id?: string;
	package_name: string;
	full_name: string;
	phone: string;
	email: string;
	city: string;
	budget_range?: string;
	message?: string;
}

export interface InquiryFilters {
	status?: InquiryStatus;
	package_id?: string;
	package_name?: string;
	date_from?: string;
	date_to?: string;
}
