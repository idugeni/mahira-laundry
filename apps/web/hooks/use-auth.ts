"use client";

import { useAuthContext } from "@/providers/auth-provider";

export function useAuth() {
  const context = useAuthContext();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
