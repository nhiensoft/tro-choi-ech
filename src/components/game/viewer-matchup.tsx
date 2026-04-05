"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import { getRounds, type GameState, type Role } from "@/lib/game-types";
import { DecorativeBg } from "./decorative-bg";

const ROLE_COLOR: Record<Role, { text: string; border: string; bg: string; glow: string }> = {
  "Gen Z": {
    text: "#8b5cf6",
    border: "rgba(139,92,246,0.4)",
    bg: "rgba(139,92,246,0.1)",
    glow: "rgba(139,92,246,0.25)",
  },
  "Nhà đầu tư": {
    text: "#d4a843",
    border: "rgba(212,168,67,0.4)",
    bg: "rgba(212,168,67,0.1)",
    glow: "rgba(212,168,67,0.25)",
  },
  "Khách du lịch": {
    text: "#06b6d4",
    border: "rgba(6,182,212,0.4)",
    bg: "rgba(6,182,212,0.1)",
    glow: "rgba(6,182,212,0.25)",
  },
};

export function ViewerMatchup({ state }: { state: GameState }) {
  const { play } = useSound();
  const rounds = getRounds(state.roles);

  useEffect(() => {
    play("dramatic");
  }, [play]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 p-8 overflow-hidden">
      <DecorativeBg />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <p
            className="font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#8a9ab8", fontSize: "0.85rem" }}
          >
            Cặp thi đấu
          </p>
          <h2
            className="text-gold-gradient font-bold"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            3 chặng phản biện
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div
              className="h-px w-20"
              style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.6))" }}
            />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="#d4a843" opacity="0.7" />
              <circle cx="5" cy="5" r="2" fill="#0a0e1a" />
            </svg>
            <div
              className="h-px w-20"
              style={{ background: "linear-gradient(to left, transparent, rgba(212,168,67,0.6))" }}
            />
          </div>
        </div>

        {/* Round cards */}
        <div className="flex flex-col gap-5 w-full">
          {rounds.map((round) => {
            const askerStyle = ROLE_COLOR[round.askerRole];
            const responderStyle = ROLE_COLOR[round.responderRole];
            return (
              <div
                key={round.roundNumber}
                className="rounded-2xl overflow-hidden animate-float-up"
                style={{
                  background: "linear-gradient(135deg, rgba(19,24,41,0.95) 0%, rgba(26,32,53,0.95) 100%)",
                  border: "1px solid rgba(212,168,67,0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,67,0.1)",
                  animationDelay: `${(round.roundNumber - 1) * 0.18}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Round label bar */}
                <div
                  className="px-6 py-2 flex items-center gap-3"
                  style={{
                    background: "rgba(212,168,67,0.08)",
                    borderBottom: "1px solid rgba(212,168,67,0.15)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #d4a843, #b8860b)",
                      color: "#0a0e1a",
                    }}
                  >
                    {round.roundNumber}
                  </div>
                  <span
                    className="font-semibold uppercase tracking-widest text-xs"
                    style={{ color: "#d4a843" }}
                  >
                    Chặng {round.roundNumber}
                  </span>
                </div>

                {/* Teams row */}
                <div className="flex items-stretch gap-0">
                  {/* Asker */}
                  <div
                    className="flex-1 p-6 text-center"
                    style={{
                      borderRight: "1px solid rgba(212,168,67,0.1)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "#8a9ab8" }}
                    >
                      Hỏi · 2 phút
                    </p>
                    <p
                      className="font-bold leading-tight mb-2"
                      style={{ color: "#f0e8d0", fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
                    >
                      {state.teams[round.askerIdx]}
                    </p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        background: askerStyle.bg,
                        border: `1px solid ${askerStyle.border}`,
                        color: askerStyle.text,
                        boxShadow: `0 0 12px ${askerStyle.glow}`,
                      }}
                    >
                      {round.askerRole}
                    </span>
                  </div>

                  {/* Arrow divider */}
                  <div className="flex items-center justify-center px-3">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <path
                        d="M4 16 L24 16 M18 10 L24 16 L18 22"
                        stroke="#d4a843"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.7"
                      />
                    </svg>
                  </div>

                  {/* Responder */}
                  <div className="flex-1 p-6 text-center">
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "#8a9ab8" }}
                    >
                      Phản hồi · 3 phút
                    </p>
                    <p
                      className="font-bold leading-tight mb-2"
                      style={{ color: "#f0e8d0", fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
                    >
                      {state.teams[round.responderIdx]}
                    </p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        background: responderStyle.bg,
                        border: `1px solid ${responderStyle.border}`,
                        color: responderStyle.text,
                        boxShadow: `0 0 12px ${responderStyle.glow}`,
                      }}
                    >
                      {round.responderRole}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Waiting indicator */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-gold-pulse"
                style={{ background: "#d4a843", animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <p style={{ color: "#8a9ab8", fontSize: "1rem" }} className="font-medium">
            Đang chờ MC bắt đầu chặng 1...
          </p>
        </div>
      </div>
    </div>
  );
}
