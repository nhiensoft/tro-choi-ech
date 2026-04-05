"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import type { GameState, GameStep } from "@/lib/game-types";
import { DecorativeBg } from "./decorative-bg";

function getRevealedCount(step: GameStep): number {
  if (step === "awards-3rd") return 1;
  if (step === "awards-2nd") return 2;
  if (step === "awards-1st") return 3;
  return 0;
}

const PLACE_LABELS = ["Giải Nhất", "Giải Nhì", "Giải Ba"];

const PLACE_STYLE = [
  {
    // 1st — Gold
    gradient: "linear-gradient(135deg, #a67c1a 0%, #8B6914 50%, #6d4c0a 100%)",
    border: "rgba(139,105,20,0.6)",
    glow: "rgba(139,105,20,0.35)",
    bg: "rgba(139,105,20,0.07)",
    textColor: "#6d4c0a",
    badgeBg: "linear-gradient(135deg, #a67c1a, #8B6914)",
    badgeText: "#ffffff",
    heightClass: "h-72",
  },
  {
    // 2nd — Silver
    gradient: "linear-gradient(135deg, #d0d0d0 0%, #b0b0b0 50%, #909090 100%)",
    border: "rgba(160,160,160,0.5)",
    glow: "rgba(160,160,160,0.2)",
    bg: "rgba(160,160,160,0.06)",
    textColor: "#5a5a5a",
    badgeBg: "linear-gradient(135deg, #d0d0d0, #a0a0a0)",
    badgeText: "#1a1207",
    heightClass: "h-60",
  },
  {
    // 3rd — Bronze
    gradient: "linear-gradient(135deg, #e8a060 0%, #cd7f32 50%, #a0522d 100%)",
    border: "rgba(205,127,50,0.5)",
    glow: "rgba(205,127,50,0.2)",
    bg: "rgba(205,127,50,0.06)",
    textColor: "#7a3e10",
    badgeBg: "linear-gradient(135deg, #e8a060, #cd7f32)",
    badgeText: "#ffffff",
    heightClass: "h-52",
  },
];

export function ViewerAwards({ state }: { state: GameState }) {
  const { play } = useSound();
  const revealed = getRevealedCount(state.step);

  useEffect(() => {
    if (revealed > 0) play("reveal");
  }, [revealed, play]);

  if (!state.awardsOrder) {
    return (
      <div className="relative flex items-center justify-center min-h-screen pt-12 overflow-hidden">
        <DecorativeBg />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-gold-pulse" style={{ background: "#8B6914" }} />
          <p style={{ color: "#6b5e4f", fontSize: "1.1rem" }}>Đang chuẩn bị công bố...</p>
        </div>
      </div>
    );
  }

  const [firstIdx, secondIdx, thirdIdx] = state.awardsOrder;
  // Display order: 3rd → 2nd → 1st (podium style: 3 left, 2 right, 1 center)
  // We actually show: 3rd, 1st, 2nd for visual podium
  const podiumOrder = [
    { placeIndex: 2, teamIdx: thirdIdx, revealAt: 1 },  // left — 3rd
    { placeIndex: 0, teamIdx: firstIdx, revealAt: 3 },  // center — 1st (tallest)
    { placeIndex: 1, teamIdx: secondIdx, revealAt: 2 }, // right — 2nd
  ];

  const isFirstRevealed = revealed >= 3;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 px-8 pb-8 pt-12 overflow-hidden">
      <DecorativeBg />

      {/* Main awards view */}
      <div
        className={`relative z-10 flex flex-col items-center gap-8 w-full max-w-4xl transition-all duration-1000 ${isFirstRevealed ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}`}
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <p
            className="font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#6b5e4f", fontSize: "0.85rem" }}
          >
            Kết quả cuộc thi
          </p>
          <h2
            className="text-gold-gradient font-bold"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            Công bố giải thưởng
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div
              className="h-px w-20"
              style={{ background: "linear-gradient(to right, transparent, rgba(139,105,20,0.55))" }}
            />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
                fill="#8B6914"
                opacity="0.8"
              />
            </svg>
            <div
              className="h-px w-20"
              style={{ background: "linear-gradient(to left, transparent, rgba(139,105,20,0.55))" }}
            />
          </div>
        </div>

        {/* Podium cards */}
        <div className="flex items-end justify-center gap-4 w-full">
          {podiumOrder.map(({ placeIndex, teamIdx, revealAt }) => {
            const isRevealed = revealed >= revealAt;
            const teamName = state.teams[teamIdx];
            const teamPhoto = state.teamPhotos?.[teamIdx];
            const score = state.scores[teamIdx];
            const style = PLACE_STYLE[placeIndex];

            return (
              <div
                key={placeIndex}
                className="flex-1 min-w-[180px] max-w-[280px] rounded-2xl overflow-hidden transition-all duration-700"
                style={{
                  background: isRevealed
                    ? `linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(250,247,240,0.99) 100%)`
                    : "rgba(240,235,224,0.6)",
                  border: `2px solid ${isRevealed ? style.border : "rgba(139,105,20,0.1)"}`,
                  boxShadow: isRevealed
                    ? `0 0 30px ${style.glow}, 0 16px 48px rgba(139,105,20,0.12)`
                    : "0 4px 16px rgba(139,105,20,0.06)",
                  transform: isRevealed
                    ? placeIndex === 0 ? "translateY(-8px) scale(1.03)" : "translateY(0)"
                    : "translateY(8px)",
                }}
              >
                {/* Place badge top strip */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: isRevealed ? style.gradient : "rgba(139,105,20,0.1)",
                    transition: "background 0.7s",
                  }}
                />

                {/* Photo area */}
                <div className="aspect-[4/3] bg-card relative overflow-hidden">
                  {teamPhoto ? (
                    <img
                      src={teamPhoto}
                      alt={teamName}
                      className="w-full h-full object-cover transition-all duration-700"
                      style={{
                        filter: isRevealed ? "blur(0) brightness(1)" : "blur(16px) brightness(0.8)",
                        transform: isRevealed ? "scale(1)" : "scale(1.1)",
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: isRevealed ? style.bg : "rgba(240,235,224,0.8)" }}
                    >
                      {isRevealed ? (
                        <svg
                          width="56"
                          height="56"
                          viewBox="0 0 80 80"
                          fill="none"
                          aria-hidden="true"
                          className="animate-ornament"
                        >
                          <path d="M18 10 L18 38 Q18 54 40 56 Q62 54 62 38 L62 10 Z" fill="rgba(139,105,20,0.15)" stroke="#8B6914" strokeWidth="2" />
                          <path d="M18 18 Q6 18 6 28 Q6 40 18 38" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
                          <path d="M62 18 Q74 18 74 28 Q74 40 62 38" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
                          <rect x="26" y="56" width="28" height="4" rx="2" fill="#8B6914" opacity="0.6" />
                          <rect x="22" y="60" width="36" height="5" rx="2.5" fill="#8B6914" opacity="0.8" />
                          <path d="M40 18 L42 25 L49 25 L43.5 29.5 L45.5 36 L40 31.5 L34.5 36 L36.5 29.5 L31 25 L38 25 Z" fill="#8B6914" />
                        </svg>
                      ) : (
                        <span
                          className="font-bold"
                          style={{ color: "rgba(139,105,20,0.3)", fontSize: "3rem" }}
                        >
                          ?
                        </span>
                      )}
                    </div>
                  )}

                  {/* Place badge overlay */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold transition-all duration-500"
                    style={{
                      background: isRevealed ? style.badgeBg : "rgba(240,235,224,0.9)",
                      color: isRevealed ? style.badgeText : "rgba(107,94,79,0.5)",
                      border: isRevealed ? "none" : "1px solid rgba(139,105,20,0.15)",
                      opacity: isRevealed ? 1 : 0.4,
                    }}
                  >
                    {isRevealed ? PLACE_LABELS[placeIndex] : "???"}
                  </div>
                </div>

                {/* Team info */}
                <div
                  className="p-4 text-center transition-all duration-700"
                  style={{ opacity: isRevealed ? 1 : 0.2 }}
                >
                  <p
                    className="font-bold leading-tight"
                    style={{
                      color: isRevealed ? style.textColor : "#6b5e4f",
                      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                      filter: isRevealed ? "none" : "blur(6px)",
                    }}
                  >
                    {isRevealed ? teamName : "???"}
                  </p>
                  {isRevealed && score !== undefined && (
                    <p style={{ color: "#6b5e4f", fontSize: "0.85rem" }} className="mt-1">
                      {score} điểm
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* First place full-screen celebration overlay */}
      {isFirstRevealed && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-in zoom-in duration-700"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(139,105,20,0.07) 0%, rgba(250,247,240,0.97) 70%)",
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Decorative corners for first place overlay */}
          <DecorativeBg />

          <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
            {/* Badge */}
            <div
              className="px-8 py-3 rounded-full text-xl font-bold uppercase tracking-widest animate-glow-gold"
              style={{
                background: "linear-gradient(135deg, #a67c1a, #8B6914, #6d4c0a)",
                color: "#ffffff",
              }}
            >
              {PLACE_LABELS[0]}
            </div>

            {/* Photo or trophy */}
            {state.teamPhotos?.[firstIdx] ? (
              <div
                className="w-72 h-52 rounded-2xl overflow-hidden animate-glow-gold"
                style={{
                  border: "3px solid rgba(139,105,20,0.7)",
                }}
              >
                <img
                  src={state.teamPhotos[firstIdx]}
                  alt={state.teams[firstIdx]}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <svg
                className="w-28 h-28 animate-ornament"
                viewBox="0 0 80 80"
                fill="none"
                aria-hidden="true"
              >
                <path d="M18 10 L18 38 Q18 54 40 56 Q62 54 62 38 L62 10 Z" fill="rgba(139,105,20,0.18)" stroke="#8B6914" strokeWidth="2.5" />
                <path d="M18 18 Q6 18 6 28 Q6 40 18 38" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M62 18 Q74 18 74 28 Q74 40 62 38" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="26" y="56" width="28" height="4" rx="2" fill="#8B6914" opacity="0.7" />
                <rect x="22" y="60" width="36" height="5" rx="2.5" fill="#8B6914" />
                <path d="M40 18 L42 25 L49 25 L43.5 29.5 L45.5 36 L40 31.5 L34.5 36 L36.5 29.5 L31 25 L38 25 Z" fill="#8B6914" />
              </svg>
            )}

            {/* Winner name */}
            <h1
              className="text-gold-gradient font-bold leading-tight animate-in zoom-in duration-500"
              style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)" }}
            >
              {state.teams[firstIdx]}
            </h1>

            {state.scores[firstIdx] !== undefined && (
              <p
                className="font-semibold"
                style={{ color: "#6b5e4f", fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
              >
                {state.scores[firstIdx]} điểm
              </p>
            )}

            {/* Decorative star row */}
            <div className="flex gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg
                  key={i}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="animate-gold-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <path
                    d="M10 1 L11.8 7.5 L18.5 7.5 L13 11.5 L15 18 L10 14 L5 18 L7 11.5 L1.5 7.5 L8.2 7.5 Z"
                    fill="#8B6914"
                    opacity="0.9"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
