"use client";

import { useGameSync } from "@/hooks/use-game-sync";
import { ViewerWaiting } from "./viewer-waiting";
import { ViewerRules } from "./viewer-rules";
import { ViewerRoleReveal } from "./viewer-role-reveal";
import { ViewerMatchup } from "./viewer-matchup";
import { ViewerRound } from "./viewer-round";
import { ViewerCompletion } from "./viewer-completion";
import { ViewerAwards } from "./viewer-awards";

export function ViewerShell() {
  const { state, isConnected } = useGameSync();

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Đang kết nối...</p>
      </div>
    );
  }

  const isRound = state.step.startsWith("round-");
  const isAwards = state.step.startsWith("awards-");

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
      {state.step === "rules" && <ViewerRules />}
      {state.step === "role-pick" && <ViewerRoleReveal state={state} />}
      {state.step === "matchup-reveal" && <ViewerMatchup state={state} />}
      {isRound && <ViewerRound state={state} />}
      {state.step === "completion" && <ViewerCompletion />}
      {state.step === "scoring" && <ViewerCompletion />}
      {isAwards && <ViewerAwards state={state} />}
    </div>
  );
}
