"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { getRounds, type GameState, type GameStep, type Role } from "@/lib/game-types";
import { DecorativeBg } from "./decorative-bg";

const ROLE_STYLE: Record<Role, { text: string; border: string; bg: string; glow: string; cardBorder: string }> = {
  "Gen Z": {
    text: "#8b5cf6",
    border: "rgba(139,92,246,0.5)",
    bg: "rgba(139,92,246,0.1)",
    glow: "rgba(139,92,246,0.3)",
    cardBorder: "rgba(139,92,246,0.35)",
  },
  "Nhà đầu tư": {
    text: "#d4a843",
    border: "rgba(212,168,67,0.5)",
    bg: "rgba(212,168,67,0.1)",
    glow: "rgba(212,168,67,0.3)",
    cardBorder: "rgba(212,168,67,0.35)",
  },
  "Khách du lịch": {
    text: "#06b6d4",
    border: "rgba(6,182,212,0.5)",
    bg: "rgba(6,182,212,0.1)",
    glow: "rgba(6,182,212,0.3)",
    cardBorder: "rgba(6,182,212,0.35)",
  },
};

function parseRoundStep(step: GameStep): { round: number; phase: "ask" | "respond" } | null {
  const match = step.match(/^round-(\d)-(\w+)$/);
  if (!match) return null;
  return { round: Number(match[1]), phase: match[2] as "ask" | "respond" };
}

export function ViewerRound({ state }: { state: GameState }) {
  const parsed = parseRoundStep(state.step);
  if (!parsed) return null;

  const { round, phase } = parsed;
  const rounds = getRounds(state.roles);
  const roundInfo = rounds[round - 1];
  if (!roundInfo) return null;

  const isAsk = phase === "ask";
  const activeTeamIdx = isAsk ? roundInfo.askerIdx : roundInfo.responderIdx;
  const activeRole = isAsk ? roundInfo.askerRole : roundInfo.responderRole;
  const activeTeamName = state.teams[activeTeamIdx];
  const activeStyle = ROLE_STYLE[activeRole];

  const otherTeamIdx = isAsk ? roundInfo.responderIdx : roundInfo.askerIdx;
  const otherRole = isAsk ? roundInfo.responderRole : roundInfo.askerRole;
  const otherTeamName = state.teams[otherTeamIdx];
  const otherStyle = ROLE_STYLE[otherRole];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-6 p-8 overflow-hidden">
      <DecorativeBg />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-2xl">
        {/* Round header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            {/* Round pip indicators */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: n === round ? "#d4a843" : "rgba(212,168,67,0.2)",
                  boxShadow: n === round ? "0 0 10px rgba(212,168,67,0.8)" : "none",
                }}
              />
            ))}
          </div>
          <p
            className="font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#8a9ab8", fontSize: "0.8rem" }}
          >
            Chặng {round} / 3
          </p>
          <h2
            className="font-bold"
            style={{
              color: isAsk ? "#d4a843" : "#06b6d4",
              fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
            }}
          >
            {isAsk ? "Lượt hỏi" : "Lượt phản hồi"}
          </h2>
        </div>

        {/* Active team card */}
        <div
          className="w-full rounded-3xl p-8 animate-glow-gold"
          style={{
            background: "linear-gradient(135deg, rgba(19,24,41,0.98) 0%, rgba(26,32,53,0.98) 100%)",
            border: `2px solid ${activeStyle.cardBorder}`,
            boxShadow: `0 0 40px ${activeStyle.glow}, 0 16px 48px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Role badge */}
          <div className="flex justify-center mb-5">
            <span
              className="px-5 py-1.5 rounded-full text-base font-bold uppercase tracking-widest"
              style={{
                background: activeStyle.bg,
                border: `1px solid ${activeStyle.border}`,
                color: activeStyle.text,
                boxShadow: `0 0 16px ${activeStyle.glow}`,
              }}
            >
              {activeRole}
            </span>
          </div>

          {/* Team label */}
          <p
            className="text-center font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#8a9ab8", fontSize: "0.8rem" }}
          >
            {isAsk ? "Đội hỏi" : "Đội phản hồi"}
          </p>

          {/* Team name — BIG */}
          <p
            className="text-center font-bold leading-none mb-6"
            style={{ color: "#f0e8d0", fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}
          >
            {activeTeamName}
          </p>

          {/* Timer */}
          <TimerDisplay
            startedAt={state.timerStartedAt}
            duration={state.timerDuration}
            isAsk={isAsk}
          />
        </div>

        {/* Target team */}
        <div
          className="w-full rounded-2xl px-6 py-4 flex items-center justify-between"
          style={{
            background: "rgba(26,32,53,0.6)",
            border: "1px solid rgba(212,168,67,0.12)",
          }}
        >
          <p style={{ color: "#8a9ab8", fontSize: "0.9rem" }}>
            {isAsk ? "Hỏi về website của" : "Phản hồi cho"}
          </p>
          <div className="flex items-center gap-3">
            <p
              className="font-bold"
              style={{ color: "#f0e8d0", fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
            >
              {otherTeamName}
            </p>
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                background: otherStyle.bg,
                border: `1px solid ${otherStyle.border}`,
                color: otherStyle.text,
              }}
            >
              {otherRole}
            </span>
          </div>
        </div>

        {/* Judges note */}
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full animate-gold-pulse"
            style={{ background: "#d4a843" }}
          />
          <p style={{ color: "rgba(138,154,184,0.6)", fontSize: "0.85rem" }}>
            Ban giám khảo đang chấm điểm...
          </p>
        </div>
      </div>
    </div>
  );
}

function TimerDisplay({
  startedAt,
  duration,
  isAsk,
}: {
  startedAt: number | null;
  duration: number | null;
  isAsk: boolean;
}) {
  const { display, isRunning, isFinished } = useCountdown(startedAt, duration);
  const defaultDuration = isAsk ? "02:00" : "03:00";

  const timerColor = isFinished
    ? "#e53535"
    : isRunning
    ? "#d4a843"
    : "#4a5568";

  const timerGlow = isFinished
    ? "0 0 40px rgba(229,53,53,0.7), 0 0 80px rgba(229,53,53,0.3)"
    : isRunning
    ? "0 0 40px rgba(212,168,67,0.6), 0 0 80px rgba(212,168,67,0.2)"
    : "none";

  return (
    <div className="text-center">
      {/* Timer display */}
      <div
        className="inline-block font-mono font-bold leading-none"
        style={{
          color: timerColor,
          fontSize: "clamp(4rem, 16vw, 9rem)",
          textShadow: timerGlow,
          transition: "color 0.3s, text-shadow 0.3s",
          ...(isFinished ? { animation: "timer-urgent 0.5s ease-in-out infinite" } : {}),
        }}
      >
        {startedAt && duration ? display : defaultDuration}
      </div>

      {/* Status text */}
      <div className="mt-2 h-7 flex items-center justify-center">
        {isFinished ? (
          <p
            className="font-bold uppercase tracking-widest animate-timer-urgent"
            style={{ color: "#e53535", fontSize: "1.1rem" }}
          >
            Hết giờ!
          </p>
        ) : !startedAt ? (
          <p style={{ color: "rgba(138,154,184,0.5)", fontSize: "0.85rem" }}>
            Chờ MC bắt đầu đếm...
          </p>
        ) : (
          <p
            className="font-semibold uppercase tracking-widest"
            style={{ color: "rgba(212,168,67,0.5)", fontSize: "0.75rem" }}
          >
            {isAsk ? "Thời gian hỏi" : "Thời gian phản hồi"}
          </p>
        )}
      </div>
    </div>
  );
}
