"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/lib/types";

export function useRealtimeOrders(outletId?: string) {
	const [orders, setOrders] = useState<Order[]>([]);
	const supabase = createClient();

	useEffect(() => {
		// Initial fetch
		const fetchOrders = async () => {
			let query = supabase
				.from("orders")
				.select("*")
				.order("created_at", { ascending: false });
			if (outletId) query = query.eq("outlet_id", outletId);
			const { data } = await query;
			if (data) setOrders(data as unknown as Order[]);
		};

		fetchOrders();

		// Subscribe to realtime
		const channel = supabase
			.channel("orders-realtime")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "orders",
					...(outletId ? { filter: `outlet_id=eq.${outletId}` } : {}),
				},
				(payload: {
					new: Order;
					old: { id: string };
					eventType: "INSERT" | "UPDATE" | "DELETE" | "*";
				}) => {
					if (payload.eventType === "INSERT") {
						setOrders((prev) => [payload.new, ...prev]);
					} else if (payload.eventType === "UPDATE") {
						setOrders((prev) =>
							prev.map((o) => (o.id === payload.new.id ? payload.new : o)),
						);
					} else if (payload.eventType === "DELETE") {
						setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [outletId, supabase.from, supabase.channel, supabase.removeChannel]);

	return orders;
}
