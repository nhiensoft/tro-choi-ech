"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import { getRounds, type GameState, type Role } from "@/lib/game-types";
import { DecorativeBg } from "./decorative-bg";

const ROLE_COLOR: Record<Role, { text: string; border: string; bg: string; glow: string }> = {
  "Gen Z": {
    text: "#7c3aed",
    border: "rgba(124,58,237,0.35)",
    bg: "rgba(124,58,237,0.08)",
    glow: "rgba(124,58,237,0.18)",
  },
  "Nhà đầu tư": {
    text: "#8B6914",
    border: "rgba(139,105,20,0.35)",
    bg: "rgba(139,105,20,0.08)",
    glow: "rgba(139,105,20,0.18)",
  },
  "Khách du lịch": {
    text: "#0891b2",
    border: "rgba(8,145,178,0.35)",
    bg: "rgba(8,145,178,0.08)",
    glow: "rgba(8,145,178,0.18)",
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
            style={{ color: "#6b5e4f", fontSize: "0.85rem" }}
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
              style={{ background: "linear-gradient(to right, transparent, rgba(139,105,20,0.55))" }}
            />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="#8B6914" opacity="0.7" />
              <circle cx="5" cy="5" r="2" fill="#faf7f0" />
            </svg>
            <div
              className="h-px w-20"
              style={{ background: "linear-gradient(to left, transparent, rgba(139,105,20,0.55))" }}
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
                  background: "linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(250,247,240,0.97) 100%)",
                  border: "1px solid rgba(139,105,20,0.18)",
                  boxShadow: "0 8px 32px rgba(139,105,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                  animationDelay: `${(round.roundNumber - 1) * 0.18}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Round label bar */}
                <div
                  className="px-6 py-2 flex items-center gap-3"
                  style={{
                    background: "rgba(139,105,20,0.06)",
                    borderBottom: "1px solid rgba(139,105,20,0.12)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #8B6914, #6d4c0a)",
                      color: "#ffffff",
                    }}
                  >
                    {round.roundNumber}
                  </div>
                  <span
                    className="font-semibold uppercase tracking-widest text-xs"
                    style={{ color: "#8B6914" }}
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
                      borderRight: "1px solid rgba(139,105,20,0.1)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "#6b5e4f" }}
                    >
                      Hỏi · 2 phút
                    </p>
                    <p
                      className="font-bold leading-tight mb-2"
                      style={{ color: "#1a1207", fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
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
                        stroke="#8B6914"
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
                      style={{ color: "#6b5e4f" }}
                    >
                      Phản hồi · 3 phút
                    </p>
                    <p
                      className="font-bold leading-tight mb-2"
                      style={{ color: "#1a1207", fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
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
                style={{ background: "#8B6914", animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <p style={{ color: "#6b5e4f", fontSize: "1rem" }} className="font-medium">
            Đang chờ MC bắt đầu chặng 1...
          </p>
        </div>
      </div>
    </div>
  );
}
