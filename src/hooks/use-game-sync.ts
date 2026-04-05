"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GameState } from "@/lib/game-types";

export function useGameSync() {
  const [state, setState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const prevStateRef = useRef<GameState | null>(null);
  const versionRef = useRef(0);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/game/state");
      const data = await res.json();
      if (data.version !== versionRef.current) {
        prevStateRef.current = state;
        versionRef.current = data.version;
        setState(data.state);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchState();

    // SSE subscription
    const es = new EventSource("/api/game/events");

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.version !== undefined) {
          versionRef.current = data.version;
        }
        setState((prev) => {
          prevStateRef.current = prev;
          return data.state;
        });
      } catch {
        // Ignore parse errors (heartbeat comments)
      }
    };

    es.onerror = () => setIsConnected(false);

    // Fallback polling every 2s (in case SSE broadcast fails)
    const poll = setInterval(fetchState, 2000);

    return () => {
      es.close();
      clearInterval(poll);
    };
  }, [fetchState]);

  return { state, isConnected, prevState: prevStateRef.current };
}
