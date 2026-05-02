export interface CartItem {
	id: string;
	serviceId: string;
	name: string;
	qty: number;
	price: number;
	unit: string;
	notes: string;
	isManual?: boolean;
}

export interface ReceiptData {
	orderId: string;
	orderNumber: string;
	items: CartItem[];
	total: number;
	paymentMethod: string;
	customerName: string;
	cashierName: string;
	date: string;
	outletId: string;
}
