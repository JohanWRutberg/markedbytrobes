"use client";

import { SessionProvider } from "next-auth/react";
import { AutoSaveProvider } from "@/contexts/auto-save-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AutoSaveProvider>{children}</AutoSaveProvider>
    </SessionProvider>
  );
}
