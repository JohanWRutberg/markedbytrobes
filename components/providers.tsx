"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { AutoSaveProvider } from "@/contexts/auto-save-context";
import { useEffect } from "react";

// Component to sync user role to sessionStorage for analytics
function SessionSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.role) {
      // Store user role in sessionStorage for analytics filtering
      sessionStorage.setItem("userRole", session.user.role);
    } else {
      // Clear user role if logged out
      sessionStorage.removeItem("userRole");
    }
  }, [session, status]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync>
        <AutoSaveProvider>{children}</AutoSaveProvider>
      </SessionSync>
    </SessionProvider>
  );
}
