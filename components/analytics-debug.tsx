"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * Development component to show if Google Analytics tracking is active
 * Only shows in development mode
 * Usage: Add <AnalyticsDebug /> anywhere in your app during development
 */
export function AnalyticsDebug() {
  const [isTracking, setIsTracking] = useState<boolean | null>(null);
  const { data: session } = useSession();
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!isDev) return;

    const checkTracking = () => {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const userRole = sessionStorage.getItem("userRole");
      const isAdmin = userRole === "ADMIN";
      const hasGtag = typeof window.gtag !== "undefined";

      const shouldTrack =
        !isLocalhost &&
        !isAdmin &&
        hasGtag &&
        process.env.NODE_ENV === "production";
      setIsTracking(shouldTrack);
    };

    checkTracking();
    const interval = setInterval(checkTracking, 1000);
    return () => clearInterval(interval);
  }, [isDev, session]);

  // Only show in development
  if (!isDev || isTracking === null) return null;

  return (
    <div
      className="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-sm font-mono z-50"
      style={{
        backgroundColor: isTracking ? "#10b981" : "#ef4444",
        color: "white",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: isTracking ? "#fff" : "#fca5a5",
          }}
        />
        <span>GA Tracking: {isTracking ? "ON" : "OFF"}</span>
      </div>
      {!isTracking && (
        <div className="text-xs mt-1 opacity-80">
          {session?.user?.role === "ADMIN" && "Admin user"}
          {process.env.NODE_ENV === "development" && " • Dev mode"}
        </div>
      )}
    </div>
  );
}
