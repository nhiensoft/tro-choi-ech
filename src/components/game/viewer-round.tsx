"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { getRounds, type GameState, type GameStep, type Role } from "@/lib/game-types";

const ROLE_TEXT: Record<Role, string> = {
  "Gen Z": "text-role-genz",
  "Nhà đầu tư": "text-role-investor",
  "Khách du lịch": "text-role-tourist",
};

const ROLE_BG: Record<Role, string> = {
  "Gen Z": "border-role-genz/40",
  "Nhà đầu tư": "border-role-investor/40",
  "Khách du lịch": "border-role-tourist/40",
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

  const otherTeamIdx = isAsk ? roundInfo.responderIdx : roundInfo.askerIdx;
  const otherRole = isAsk ? roundInfo.responderRole : roundInfo.askerRole;
  const otherTeamName = state.teams[otherTeamIdx];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      {/* Round header */}
      <div className="text-center space-y-1">
        <p className="text-lg text-muted-foreground font-medium">
          Chặng {round}/3
        </p>
        <h2 className="text-3xl font-bold text-primary">
          {isAsk ? "Lượt hỏi" : "Lượt phản hồi"}
        </h2>
      </div>

      {/* Active team card */}
      <div className={`w-full max-w-lg p-8 rounded-2xl border-4 bg-card shadow-lg ${ROLE_BG[activeRole]}`}>
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {isAsk ? "Đội hỏi" : "Đội phản hồi"}
          </p>
          <p className="text-4xl font-bold">{activeTeamName}</p>
          <p className={`text-xl font-semibold ${ROLE_TEXT[activeRole]}`}>
            {activeRole}
          </p>
        </div>

        {/* Timer */}
        <TimerDisplay
          startedAt={state.timerStartedAt}
          duration={state.timerDuration}
          isAsk={isAsk}
        />
      </div>

      {/* Target info */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          {isAsk ? "Hỏi về website của" : "Phản hồi cho"}
        </p>
        <p className="text-2xl font-bold">
          {otherTeamName}{" "}
          <span className={`${ROLE_TEXT[otherRole]}`}>({otherRole})</span>
        </p>
      </div>

      {/* Judges note */}
      <p className="text-sm text-muted-foreground mt-4">
        Ban giám khảo đang chấm điểm...
      </p>
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

  if (!startedAt || !duration) {
    return (
      <div className="mt-6 text-center">
        <p className="text-6xl font-mono font-bold text-muted-foreground">
          {defaultDuration}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Chờ MC bắt đầu đếm...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <p
        className={`text-7xl font-mono font-bold transition-colors ${
          isFinished
            ? "text-destructive animate-pulse"
            : isRunning
              ? "text-primary"
              : "text-muted-foreground"
        }`}
      >
        {display}
      </p>
      {isFinished && (
        <p className="text-lg font-bold text-destructive mt-2">Hết giờ!</p>
      )}
    </div>
  );
}
