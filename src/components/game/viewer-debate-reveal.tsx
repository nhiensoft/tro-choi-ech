"use client";

import { useEffect, useRef } from "react";
import { useSound } from "@/hooks/use-sound";
import type { GameState } from "@/lib/game-types";

export function ViewerDebateReveal({ state }: { state: GameState }) {
  const { play } = useSound();
  const hasDebates = Object.keys(state.debates).length > 0;
  const prevDebateCountRef = useRef(Object.keys(state.debates).length);

  useEffect(() => {
    const count = Object.keys(state.debates).length;
    if (count > prevDebateCountRef.current) {
      play("dramatic");
    }
    prevDebateCountRef.current = count;
  }, [state.debates, play]);

  const pairs = state.pickOrder.map((teamIdx) => ({
    teamIdx,
    teamName: state.teams[teamIdx],
    targetName:
      state.debates[teamIdx] !== undefined
        ? state.teams[state.debates[teamIdx]]
        : null,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground font-medium">
          Vòng phản biện
        </p>
        <h2 className="text-4xl font-bold text-primary">
          {hasDebates ? "Kết quả phản biện" : `${state.teams[state.pickOrder[0]]} đang chọn...`}
        </h2>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xl">
        {pairs.map((pair, i) => {
          const isRevealed = pair.targetName !== null;
          return (
            <div
              key={pair.teamIdx}
              className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-500
                ${isRevealed
                  ? "bg-card border-primary/30 shadow-md opacity-100 translate-y-0"
                  : "bg-muted/50 border-transparent opacity-40 translate-y-2"
                }`}
            >
              <span className="text-xl font-bold">{pair.teamName}</span>
              <span className="text-muted-foreground text-lg">phản biện →</span>
              <span className={`text-xl font-bold ${isRevealed ? "text-primary" : "text-muted-foreground"}`}>
                {isRevealed ? pair.targetName : "???"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
