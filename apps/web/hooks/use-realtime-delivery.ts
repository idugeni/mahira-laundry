"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface DeliveryLocation {
  id: string;
  orderId: string;
  courierId: string;
  currentLat: number;
  currentLng: number;
  status: string;
}

export function useRealtimeDelivery(orderId?: string) {
  const [delivery, setDelivery] = useState<DeliveryLocation | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!orderId) return;

    const fetchDelivery = async () => {
      const { data } = await supabase
        .from("delivery")
        .select("*")
        .eq("order_id", orderId)
        .single();
      if (data) setDelivery(data as unknown as DeliveryLocation);
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
        (payload) => {
          setDelivery(payload.new as unknown as DeliveryLocation);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, supabase.from, supabase.channel, supabase.removeChannel]);

  return delivery;
}
