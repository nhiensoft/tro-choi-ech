"use client";

import { useState, useEffect } from "react";

export function useCountdown(startedAt: number | null, duration: number | null) {
  const [remaining, setRemaining] = useState(duration ?? 0);

  useEffect(() => {
    if (!startedAt || !duration) {
      setRemaining(duration ?? 0);
      return;
    }

    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setRemaining(Math.max(0, duration - elapsed));
    };

    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [startedAt, duration]);

  const isRunning = startedAt !== null && remaining > 0;
  const isFinished = startedAt !== null && duration !== null && remaining <= 0;

  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { remaining, isRunning, isFinished, display, minutes, seconds };
}
