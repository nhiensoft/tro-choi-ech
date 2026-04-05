"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import type { GameState, GameStep } from "@/lib/game-types";

function getRevealedCount(step: GameStep): number {
  if (step === "awards-3rd") return 1;
  if (step === "awards-2nd") return 2;
  if (step === "awards-1st") return 3;
  return 0;
}

const PLACE_LABELS = ["Giải Nhất", "Giải Nhì", "Giải Ba"];
const PLACE_COLORS = [
  "from-yellow-400 to-amber-500", // 1st
  "from-slate-300 to-slate-400",  // 2nd
  "from-amber-600 to-orange-500", // 3rd
];
const PLACE_BORDER = [
  "border-yellow-400 shadow-yellow-400/30",
  "border-slate-300 shadow-slate-300/30",
  "border-amber-600 shadow-amber-600/30",
];

export function ViewerAwards({ state }: { state: GameState }) {
  const { play } = useSound();
  const revealed = getRevealedCount(state.step);

  useEffect(() => {
    if (revealed > 0) play("reveal");
  }, [revealed, play]);

  if (!state.awardsOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Đang chuẩn bị công bố...</p>
      </div>
    );
  }

  const [firstIdx, secondIdx, thirdIdx] = state.awardsOrder;
  // Display order: 3rd → 2nd → 1st
  const displayOrder = [
    { placeIndex: 2, teamIdx: thirdIdx, revealAt: 1 },
    { placeIndex: 1, teamIdx: secondIdx, revealAt: 2 },
    { placeIndex: 0, teamIdx: firstIdx, revealAt: 3 },
  ];

  const isFirstRevealed = revealed >= 3;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 relative">
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground font-medium">
          Kết quả cuộc thi
        </p>
        <h2 className="text-4xl font-bold text-primary">Công bố giải thưởng</h2>
      </div>

      {/* Awards grid */}
      <div className={`flex gap-6 items-end justify-center flex-wrap w-full max-w-4xl transition-all duration-1000 ${isFirstRevealed ? "opacity-0 scale-75 pointer-events-none" : ""}`}>
        {displayOrder.map(({ placeIndex, teamIdx, revealAt }) => {
          const isRevealed = revealed >= revealAt;
          const teamName = state.teams[teamIdx];
          const teamPhoto = state.teamPhotos[teamIdx];
          const score = state.scores[teamIdx];

          return (
            <div
              key={placeIndex}
              className={`flex-1 min-w-[200px] max-w-[300px] rounded-2xl border-4 overflow-hidden transition-all duration-700
                ${isRevealed ? `${PLACE_BORDER[placeIndex]} shadow-lg` : "border-muted bg-muted/50"}`}
            >
              {/* Photo area */}
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {teamPhoto ? (
                  <img
                    src={teamPhoto}
                    alt={teamName}
                    className={`w-full h-full object-cover transition-all duration-700
                      ${isRevealed ? "blur-0 scale-100" : "blur-xl scale-110"}`}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-6xl
                    ${isRevealed ? "" : "blur-xl"}`}>
                    {isRevealed ? "🏆" : "?"}
                  </div>
                )}

                {/* Place badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${PLACE_COLORS[placeIndex]}
                  transition-opacity duration-500 ${isRevealed ? "opacity-100" : "opacity-0"}`}>
                  {PLACE_LABELS[placeIndex]}
                </div>
              </div>

              {/* Info */}
              <div className={`p-4 text-center transition-all duration-700
                ${isRevealed ? "opacity-100" : "opacity-30 blur-sm"}`}>
                <p className="text-2xl font-bold">
                  {isRevealed ? teamName : "???"}
                </p>
                {isRevealed && score !== undefined && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {score} điểm
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* First place full-screen overlay */}
      {isFirstRevealed && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 animate-in zoom-in duration-1000">
          <div className="text-center space-y-6">
            <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold text-white bg-gradient-to-r ${PLACE_COLORS[0]}`}>
              {PLACE_LABELS[0]}
            </div>

            {state.teamPhotos[firstIdx] ? (
              <div className="w-80 h-60 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl shadow-yellow-400/30 mx-auto">
                <img
                  src={state.teamPhotos[firstIdx]}
                  alt={state.teams[firstIdx]}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-8xl">🏆</div>
            )}

            <h1 className="text-6xl font-bold text-primary animate-in zoom-in duration-500">
              {state.teams[firstIdx]}
            </h1>

            {state.scores[firstIdx] !== undefined && (
              <p className="text-2xl text-muted-foreground">
                {state.scores[firstIdx]} điểm
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
