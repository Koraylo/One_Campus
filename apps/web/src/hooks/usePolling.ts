'use client';

import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
}

export function usePolling(callback: () => void | Promise<void>, options: UsePollingOptions = {}) {
  const { interval = 5000, enabled = true } = options;
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let running = false;

    const tick = async () => {
      if (!active || running) return;
      running = true;
      try {
        await savedCallback.current();
      } catch (error) {
        // Polling failures should not become unhandled promise rejections or
        // permanently stop future refreshes. Callers can also surface errors.
        console.error('[Polling] Refresh failed:', error);
      } finally {
        running = false;
      }
    };

    void tick();
    const timer = setInterval(() => void tick(), Math.max(interval, 1000));

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [interval, enabled]);
}
