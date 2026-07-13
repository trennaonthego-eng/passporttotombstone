"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface ConciergeContextValue {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const ConciergeContext = createContext<ConciergeContextValue | null>(null);

/** Lets any component (e.g. a homepage "Ask the Concierge" card) open the
 * chat widget, not just its own floating launcher button. */
export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const value = useMemo(() => ({ isOpen, setOpen }), [isOpen]);
  return <ConciergeContext.Provider value={value}>{children}</ConciergeContext.Provider>;
}

export function useConcierge() {
  const ctx = useContext(ConciergeContext);
  if (!ctx) throw new Error("useConcierge must be used within ConciergeProvider");
  return ctx;
}
