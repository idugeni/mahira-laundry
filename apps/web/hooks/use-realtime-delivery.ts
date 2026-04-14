"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Delivery } from "@/lib/types";

export function useRealtimeDelivery(orderId?: string) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!orderId) return;

    const fetchDelivery = async () => {
      const { data } = await supabase
        .from("delivery")
        .select("*")
        .eq("order_id", orderId)
        .single();
      if (data) setDelivery(data as unknown as Delivery);
    };

    fetchDelivery();

    const channel = supabase
      .channel(`delivery-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "delivery",
          filter: `order_id=eq.${orderId}`,
        },
        (payload: { new: Delivery }) => {
          setDelivery(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase.from, supabase.channel, supabase.removeChannel]);

  return delivery;
}
