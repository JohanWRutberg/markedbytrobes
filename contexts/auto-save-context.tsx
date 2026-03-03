"use client";

import React, { createContext, useContext, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface AutoSaveContextType {
  status: SaveStatus;
  setStatus: (status: SaveStatus) => void;
  lastSaved: Date | null;
  setLastSaved: (date: Date) => void;
}

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(
  undefined,
);

export function AutoSaveProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  return (
    <AutoSaveContext.Provider
      value={{ status, setStatus, lastSaved, setLastSaved }}
    >
      {children}
    </AutoSaveContext.Provider>
  );
}

export function useAutoSaveContext() {
  const context = useContext(AutoSaveContext);
  if (context === undefined) {
    // Return default values if used outside provider (e.g., during SSR)
    return {
      status: "idle" as SaveStatus,
      setStatus: () => {},
      lastSaved: null,
      setLastSaved: () => {},
    };
  }
  return context;
}
