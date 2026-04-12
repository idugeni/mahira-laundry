import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OutletState {
  selectedOutletId: string | null;
  selectedOutletName: string | null;
  setOutlet: (id: string, name: string) => void;
  clearOutlet: () => void;
}

export const useOutletStore = create<OutletState>()(
  persist(
    (set) => ({
      selectedOutletId: null,
      selectedOutletName: null,
      setOutlet: (id, name) =>
        set({ selectedOutletId: id, selectedOutletName: name }),
      clearOutlet: () =>
        set({ selectedOutletId: null, selectedOutletName: null }),
    }),
    { name: "mahira-outlet" },
  ),
);
