"use client";

import { createContext, useContext } from "react";
import type { WeddingData } from "./types";

const WeddingContext = createContext<WeddingData | null>(null);

export function WeddingProvider({
  data,
  children,
}: {
  data: WeddingData;
  children: React.ReactNode;
}) {
  return (
    <WeddingContext.Provider value={data}>{children}</WeddingContext.Provider>
  );
}

export function useWedding() {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding must be used within WeddingProvider");
  return ctx;
}
