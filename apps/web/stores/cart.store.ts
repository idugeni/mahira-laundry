import { create } from "zustand";

interface CartItem {
	serviceId: string;
	serviceName: string;
	quantity: number;
	unit: string;
	unitPrice: number;
	isExpress: boolean;
	subtotal: number;
}

interface CartState {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "subtotal">) => void;
	removeItem: (serviceId: string) => void;
	updateQuantity: (serviceId: string, quantity: number) => void;
	clearCart: () => void;
	getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	addItem: (item) => {
		const subtotal =
			item.quantity * item.unitPrice * (item.isExpress ? 1.5 : 1);
		set((state) => {
			const existing = state.items.find((i) => i.serviceId === item.serviceId);
			if (existing) {
				return {
					items: state.items.map((i) =>
						i.serviceId === item.serviceId
							? {
									...i,
									quantity: item.quantity,
									subtotal:
										item.quantity * i.unitPrice * (i.isExpress ? 1.5 : 1),
								}
							: i,
					),
				};
			}
			return { items: [...state.items, { ...item, subtotal }] };
		});
	},
	removeItem: (serviceId) =>
		set((state) => ({
			items: state.items.filter((i) => i.serviceId !== serviceId),
		})),
	updateQuantity: (serviceId, quantity) =>
		set((state) => ({
			items: state.items.map((i) =>
				i.serviceId === serviceId
					? {
							...i,
							quantity,
							subtotal: quantity * i.unitPrice * (i.isExpress ? 1.5 : 1),
						}
					: i,
			),
		})),
	clearCart: () => set({ items: [] }),
	getTotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),
}));
