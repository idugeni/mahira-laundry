"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Outlet } from "@/lib/types";

export function useOutlet() {
	const [outlets, setOutlets] = useState<Outlet[]>([]);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const fetchOutlets = async () => {
			const { data } = await supabase
				.from("outlets")
				.select("id, name, slug")
				.eq("is_active", true)
				.order("name");
			if (data) setOutlets(data as unknown as Outlet[]);
			setLoading(false);
		};

		fetchOutlets();
	}, [supabase.from]);

	return { outlets, loading };
}
