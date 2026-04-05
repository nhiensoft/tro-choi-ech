"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import { getRounds, type GameState, type Role } from "@/lib/game-types";

const ROLE_TEXT: Record<Role, string> = {
  "Gen Z": "text-role-genz",
  "Nhà đầu tư": "text-role-investor",
  "Khách du lịch": "text-role-tourist",
};

export function ViewerMatchup({ state }: { state: GameState }) {
  const { play } = useSound();
  const rounds = getRounds(state.roles);

  useEffect(() => {
    play("dramatic");
  }, [play]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground font-medium">Cặp thi đấu</p>
        <h2 className="text-4xl font-bold text-primary">3 chặng phản biện</h2>
      </div>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {rounds.map((round) => (
          <div
            key={round.roundNumber}
            className="p-6 rounded-2xl border-2 bg-card shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${(round.roundNumber - 1) * 200}ms`, animationFillMode: "both" }}
          >
            <p className="text-sm font-semibold text-muted-foreground mb-3">
              Chặng {round.roundNumber}
            </p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Asker */}
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">Hỏi (2 phút)</p>
                <p className="text-2xl font-bold">
                  {state.teams[round.askerIdx]}
                </p>
                <p className={`text-sm font-semibold ${ROLE_TEXT[round.askerRole]}`}>
                  {round.askerRole}
                </p>
              </div>

              <div className="text-3xl text-primary font-bold">→</div>

              {/* Responder */}
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">Phản hồi (3 phút)</p>
                <p className="text-2xl font-bold">
                  {state.teams[round.responderIdx]}
                </p>
                <p className={`text-sm font-semibold ${ROLE_TEXT[round.responderRole]}`}>
                  {round.responderRole}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <p className="text-lg text-muted-foreground font-medium">
          Đang chờ MC bắt đầu chặng 1...
        </p>
      </div>
    </div>
  );
}
