"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSound } from "@/hooks/use-sound";
import type { GameState, Role } from "@/lib/game-types";

const ROLE_BG: Record<Role, string> = {
  "Gen Z": "bg-role-genz-light border-role-genz/30",
  "Nhà đầu tư": "bg-role-investor-light border-role-investor/30",
  "Khách du lịch": "bg-role-tourist-light border-role-tourist/30",
};

const ROLE_TEXT: Record<Role, string> = {
  "Gen Z": "text-role-genz",
  "Nhà đầu tư": "text-role-investor",
  "Khách du lịch": "text-role-tourist",
};

export function ViewerResult({ state }: { state: GameState }) {
  const { play } = useSound();

  useEffect(() => {
    play("success");
  }, [play]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-primary">Kết quả bốc thăm</h2>
        <p className="text-lg text-muted-foreground">
          Chặng 2 — Vai trò & Phản biện
        </p>
      </div>

      <div className="grid gap-5 w-full max-w-2xl">
        {state.pickOrder.map((teamIdx) => {
          const role = state.roles[teamIdx];
          const debateTargetIdx = state.debates[teamIdx];
          const debateTargetName = state.teams[debateTargetIdx];

          return (
            <Card
              key={teamIdx}
              className={`border-2 overflow-hidden ${role ? ROLE_BG[role] : ""}`}
            >
              <CardContent className="flex items-center justify-between py-5 flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Đội</span>
                  <span className="text-2xl font-bold text-foreground">
                    {state.teams[teamIdx]}
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-sm font-medium text-muted-foreground">Vai trò hỏi</span>
                  <span className={`text-xl font-bold ${role ? ROLE_TEXT[role] : ""}`}>
                    {role}
                  </span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-sm font-medium text-muted-foreground">Phản biện</span>
                  <span className="text-xl font-bold text-primary">
                    {debateTargetName}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-lg text-muted-foreground">
        <p className="font-semibold">Vòng phản biện:</p>
        <p className="text-xl font-bold text-foreground mt-1">
          {state.pickOrder.map((idx) => state.teams[idx]).join(" → ")} → {state.teams[state.pickOrder[0]]}
        </p>
      </div>
    </div>
  );
}
