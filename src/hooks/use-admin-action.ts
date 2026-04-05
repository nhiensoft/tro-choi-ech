"use client";

import { useCallback } from "react";
import type { GameAction } from "@/lib/game-types";

export function useAdminAction() {
  const dispatch = useCallback(async (action: GameAction) => {
    const res = await fetch("/api/game/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Action failed");
    }

    return res.json();
  }, []);

  return { dispatch };
}
