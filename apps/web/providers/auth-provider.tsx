"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

interface AuthContextType {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
	refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	const fetchProfile = async (userId: string) => {
		const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
		if (error) {
			// Profile fetch failed — user may not have a profile row yet
		}
		setProfile(data as unknown as Profile);
	};

	useEffect(() => {
		let isMounted = true;
		const initAuth = async () => {
			try {
				// Step 1: Get initial session (synchronous from cache if available)
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!isMounted) return;

				// Step 2: Fetch profile if session exists
				if (session?.user) {
					setUser(session.user);
					await fetchProfile(session.user.id);
				}

				// Step 3: Mark initialization complete
				if (isMounted) {
					setLoading(false);
				}
			} catch (error) {
				console.error("Auth initialization error:", error);
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		initAuth();

		// Step 4: Listen for auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			async (_event: string, session: { user: User | null } | null) => {
				if (!isMounted) return;

				if (session?.user) {
					setUser(session.user);
					await fetchProfile(session.user.id);
				} else {
					setUser(null);
					setProfile(null);
				}
				setLoading(false);
			},
		);

		// Cleanup
		return () => {
			isMounted = false;
			subscription.unsubscribe();
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: supabase.auth methods are stable references
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				profile,
				loading,
				refreshProfile: () => (user ? fetchProfile(user.id) : Promise.resolve()),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuthContext = () => useContext(AuthContext);
