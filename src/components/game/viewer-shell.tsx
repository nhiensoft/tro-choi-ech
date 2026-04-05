"use client";

import { useGameSync } from "@/hooks/use-game-sync";
import { ViewerWaiting } from "./viewer-waiting";
import { ViewerRoleReveal } from "./viewer-role-reveal";
import { ViewerDebateReveal } from "./viewer-debate-reveal";
import { ViewerResult } from "./viewer-result";

export function ViewerShell() {
  const { state, isConnected } = useGameSync();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Đang kết nối...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Connection indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
          }`}
        />
      </div>

      {/* Game view */}
      {state.step === "input" && <ViewerWaiting />}
      {state.step === "role-pick" && <ViewerRoleReveal state={state} />}
      {state.step === "debate-pick" && <ViewerDebateReveal state={state} />}
      {state.step === "result" && <ViewerResult state={state} />}
    </div>
  );
}
