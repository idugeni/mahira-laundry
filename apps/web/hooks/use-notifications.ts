"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppNotification } from "@/lib/types";

export function useNotifications() {
	const [notifications, setNotifications] = useState<AppNotification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const supabase = createClient();

	useEffect(() => {
		const fetchNotifications = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data } = await supabase
				.from("notifications")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(20);

			if (data) {
				const mappedData = data as unknown as AppNotification[];
				setNotifications(mappedData);
				setUnreadCount(mappedData.filter((n) => !n.is_read).length);
			}
		};

		fetchNotifications();

		// Subscribe to new notifications
		const channel = supabase
			.channel("notifications-realtime")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
				},
				(payload: { new: AppNotification }) => {
					const n = payload.new;
					setNotifications((prev) => [n, ...prev]);
					setUnreadCount((prev) => prev + 1);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		supabase.from,
		supabase.channel,
		supabase.auth.getUser,
		supabase.removeChannel,
	]);

	const markAsRead = async (id: string) => {
		await supabase
			.from("notifications")
			.update({ is_read: true, read_at: new Date().toISOString() })
			.eq("id", id);

		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
		);
		setUnreadCount((prev) => Math.max(0, prev - 1));
	};

	return { notifications, unreadCount, markAsRead };
}
