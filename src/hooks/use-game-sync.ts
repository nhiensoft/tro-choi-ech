"use client";

import { useState, useEffect, useRef } from "react";
import type { GameState } from "@/lib/game-types";

export function useGameSync() {
  const [state, setState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const prevStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    // SSE subscription — server polls KV and pushes changes
    const es = new EventSource("/api/game/events");

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setState((prev) => {
          prevStateRef.current = prev;
          return data.state;
        });
      } catch {
        // Ignore parse errors (heartbeat comments)
      }
    };

    es.onerror = () => setIsConnected(false);

    return () => es.close();
  }, []);

  return { state, isConnected, prevState: prevStateRef.current };
}
