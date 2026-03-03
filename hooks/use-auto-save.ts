import { useEffect, useRef, useCallback } from "react";
import { useAutoSaveContext } from "@/contexts/auto-save-context";

interface UseAutoSaveOptions {
  data: unknown;
  onSave: (data: unknown) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({
  data,
  onSave,
  delay = 3000, // 3 seconds default
  enabled = true,
}: UseAutoSaveOptions) {
  const { setStatus, setLastSaved } = useAutoSaveContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      setStatus("saving");
      await onSave(data);
      setStatus("saved");
      setLastSaved(new Date());

      // Reset to idle after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Auto-save error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, setStatus, setLastSaved]);

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);

    // Don't save if data hasn't changed
    if (currentData === previousDataRef.current) return;

    // Don't save on first render (when previousDataRef is null)
    if (previousDataRef.current === null) {
      previousDataRef.current = currentData;
      return;
    }

    previousDataRef.current = currentData;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  return { save };
}
