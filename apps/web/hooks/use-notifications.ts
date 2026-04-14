"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
        setNotifications(
          data.map(
            (
              n: Record<string, unknown> & {
                id: string;
                type: string;
                is_read: boolean;
              },
            ) => ({
              id: n.id,
              type: n.type,
              title: n.title,
              body: n.body,
              isRead: n.is_read,
              createdAt: n.created_at,
            }),
          ),
        );
        setUnreadCount(
          data.filter(
            (n: Record<string, unknown> & { is_read: boolean }) => !n.is_read,
          ).length,
        );
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
        (payload: {
          new: {
            id: string;
            type: string;
            title: string;
            body: string;
            created_at: string;
            is_read: boolean;
          };
        }) => {
          const n = payload.new;
          const mapped: Notification = {
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body,
            isRead: n.is_read,
            createdAt: n.created_at,
          };
          setNotifications((prev) => [mapped, ...prev]);
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
      prev.map((n: Notification) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAsRead };
}
