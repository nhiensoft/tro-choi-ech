"use client";

import { useState, useEffect, useRef } from "react";
import type { GameState } from "@/lib/game-types";

export function useGameSync() {
  const [state, setState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const prevStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    // Initial fetch
    fetch("/api/game/state")
      .then((r) => r.json())
      .then((data) => {
        setState(data.state);
        prevStateRef.current = data.state;
      })
      .catch(() => {});

    // SSE subscription
    const es = new EventSource("/api/game/events");

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        prevStateRef.current = state;
        setState(data.state);
      } catch {
        // Ignore parse errors (heartbeat comments)
      }
    };

    es.onerror = () => setIsConnected(false);

    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, isConnected, prevState: prevStateRef.current };
}
