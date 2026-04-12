"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useOutlet() {
  const [outlets, setOutlets] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOutlets = async () => {
      const { data } = await supabase
        .from("outlets")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("name");
      if (data) setOutlets(data);
      setLoading(false);
    };

    fetchOutlets();
  }, [supabase.from]);

  return { outlets, loading };
}
