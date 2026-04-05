"use client";

import { useGameSync } from "@/hooks/use-game-sync";
import { DecorativeBg } from "./decorative-bg";
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
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <DecorativeBg />
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full animate-gold-pulse"
            style={{ background: "#d4a843" }}
          />
          <p style={{ color: "#8a9ab8", fontSize: "1.1rem" }}>Đang kết nối...</p>
        </div>
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
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            isConnected ? "" : "animate-pulse"
          }`}
          style={{
            background: isConnected ? "#22c55e" : "#e53535",
            boxShadow: isConnected
              ? "0 0 6px rgba(34,197,94,0.6)"
              : "0 0 6px rgba(229,53,53,0.6)",
          }}
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
