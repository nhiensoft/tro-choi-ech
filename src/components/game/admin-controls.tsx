"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAction } from "@/hooks/use-admin-action";
import { getRounds, type GameState, type GameStep, type Role } from "@/lib/game-types";
import { useCountdown } from "@/hooks/use-countdown";

export function AdminControls({ state }: { state: GameState }) {
  const { dispatch } = useAdminAction();

  const isRound = state.step.startsWith("round-");
  const isAwards = state.step.startsWith("awards-");

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Bảng điều khiển</h3>
        <Button
          variant="destructive"
          size="sm"
          className="cursor-pointer"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Reset game
        </Button>
      </div>

      {state.step === "input" && <InputControls dispatch={dispatch} />}
      {state.step === "rules" && <RulesControls dispatch={dispatch} />}
      {state.step === "role-pick" && <RolePickControls state={state} dispatch={dispatch} />}
      {state.step === "matchup-reveal" && <MatchupControls dispatch={dispatch} />}
      {isRound && <RoundControls state={state} dispatch={dispatch} />}
      {state.step === "completion" && <CompletionControls dispatch={dispatch} />}
      {state.step === "scoring" && <ScoringControls state={state} dispatch={dispatch} />}
      {isAwards && <AwardsControls state={state} dispatch={dispatch} />}
    </div>
  );
}

type Dispatch = (a: never) => Promise<unknown>;

// === Step: Input ===

function InputControls({ dispatch }: { dispatch: Dispatch }) {
  const [names, setNames] = useState(["", "", ""]);
  const [photos, setPhotos] = useState(["", "", ""]);
  const [error, setError] = useState("");

  const handleStart = () => {
    const trimmed = names.map((n) => n.trim());
    if (trimmed.some((n) => n === "")) {
      setError("Nhập đủ 3 tên đội");
      return;
    }
    if (new Set(trimmed).size !== 3) {
      setError("Tên đội phải khác nhau");
      return;
    }
    dispatch({
      type: "SET_TEAMS",
      teams: trimmed as [string, string, string],
    } as never);

    // Save photos after teams are set
    photos.forEach((url, i) => {
      if (url.trim()) {
        dispatch({ type: "SET_PHOTO", teamIdx: i, url: url.trim() } as never);
      }
    });
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Nhập tên 3 đội</p>
      {["Đội 1", "Đội 2", "Đội 3"].map((label, i) => (
        <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/30">
          <label className="text-xs font-medium text-muted-foreground">{label}</label>
          <Input
            placeholder={`Tên ${label.toLowerCase()}...`}
            value={names[i]}
            onChange={(e) => {
              const next = [...names];
              next[i] = (e.target as HTMLInputElement).value;
              setNames(next);
              if (error) setError("");
            }}
            className="h-9 border"
          />
          <Input
            placeholder="URL ảnh đội (tuỳ chọn)..."
            value={photos[i]}
            onChange={(e) => {
              const next = [...photos];
              next[i] = (e.target as HTMLInputElement).value;
              setPhotos(next);
            }}
            className="h-8 border text-xs"
          />
          {photos[i] && (
            <img
              src={photos[i]}
              alt={`Preview ${label}`}
              className="w-full h-20 object-cover rounded-md border"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
      ))}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button
        onClick={handleStart}
        className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
      >
        Bắt đầu
      </Button>
    </div>
  );
}

// === Step: Rules ===

function RulesControls({ dispatch }: { dispatch: Dispatch }) {
  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Viewer đang xem luật chơi</p>
      <Button
        onClick={() => dispatch({ type: "GO_TO_ROLE_PICK" } as never)}
        className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Sang bốc vai trò
      </Button>
    </div>
  );
}

// === Step: Role Pick ===

function RolePickControls({ state, dispatch }: { state: GameState; dispatch: Dispatch }) {
  const currentTeamIdx = state.pickOrder[state.currentPickerIdx];
  const currentTeamName = state.teams[currentTeamIdx];
  const isLastTeam = state.currentPickerIdx === 2;
  const hasPickedRole = !!state.roles[currentTeamIdx];

  const handlePickRole = (role: Role) => {
    dispatch({ type: "PICK_ROLE", teamIdx: currentTeamIdx, role } as never);
  };

  const handleNext = () => {
    if (state.currentPickerIdx < 2) {
      dispatch({ type: "NEXT_PICKER" } as never);
    } else {
      dispatch({ type: "GO_TO_MATCHUP" } as never);
    }
  };

  const handleAutoPickLast = () => {
    if (state.remainingRoles.length === 1) {
      handlePickRole(state.remainingRoles[0]);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">
        Lượt {state.currentPickerIdx + 1}/3 — {currentTeamName}
      </p>

      {!hasPickedRole && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Chọn vai trò:</p>
          {isLastTeam ? (
            <Button
              onClick={handleAutoPickLast}
              className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Lật lá bài ({state.remainingRoles[0]})
            </Button>
          ) : (
            state.remainingRoles.map((role) => (
              <Button
                key={role}
                onClick={() => handlePickRole(role)}
                variant="outline"
                className="w-full cursor-pointer"
              >
                {role}
              </Button>
            ))
          )}
        </div>
      )}

      {hasPickedRole && (
        <div className="space-y-2">
          <p className="text-sm font-bold">
            {currentTeamName} → <span className="text-primary">{state.roles[currentTeamIdx]}</span>
          </p>
          <Button
            onClick={handleNext}
            className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {state.currentPickerIdx < 2 ? "Đội tiếp theo" : "Xem cặp thi đấu"}
          </Button>
        </div>
      )}
    </div>
  );
}

// === Step: Matchup ===

function MatchupControls({ dispatch }: { dispatch: Dispatch }) {
  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Viewer đang xem cặp thi đấu</p>
      <Button
        onClick={() => dispatch({ type: "GO_TO_ROUND", round: 1, phase: "ask" } as never)}
        className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Bắt đầu Chặng 1
      </Button>
    </div>
  );
}

// === Step: Round ===

function parseRoundStep(step: GameStep): { round: number; phase: "ask" | "respond" } | null {
  const match = step.match(/^round-(\d)-(\w+)$/);
  if (!match) return null;
  return { round: Number(match[1]), phase: match[2] as "ask" | "respond" };
}

function RoundControls({ state, dispatch }: { state: GameState; dispatch: Dispatch }) {
  const parsed = parseRoundStep(state.step);
  if (!parsed) return null;

  const { round, phase } = parsed;
  const rounds = getRounds(state.roles);
  const roundInfo = rounds[round - 1];
  const isAsk = phase === "ask";
  const timerRunning = state.timerStartedAt !== null;

  const activeTeam = isAsk
    ? state.teams[roundInfo.askerIdx]
    : state.teams[roundInfo.responderIdx];
  const duration = isAsk ? 120 : 180; // 2 min ask, 3 min respond

  const handleStartTimer = () => {
    dispatch({ type: "START_TIMER", duration } as never);
  };

  const handleNext = () => {
    if (isAsk) {
      // Switch to respond phase
      dispatch({ type: "GO_TO_ROUND", round: round as 1 | 2 | 3, phase: "respond" } as never);
    } else if (round < 3) {
      // Next round
      dispatch({ type: "GO_TO_ROUND", round: (round + 1) as 1 | 2 | 3, phase: "ask" } as never);
    } else {
      // All rounds done
      dispatch({ type: "GO_TO_COMPLETION" } as never);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">
        Chặng {round} — {isAsk ? "Lượt hỏi" : "Lượt phản hồi"}
      </p>
      <p className="text-sm">
        {activeTeam} — <strong>{isAsk ? "2 phút" : "3 phút"}</strong>
      </p>

      <TimerAdmin startedAt={state.timerStartedAt} duration={state.timerDuration} />

      <div className="flex gap-2">
        {!timerRunning && (
          <Button
            onClick={handleStartTimer}
            className="flex-1 cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Bắt đầu đếm ({isAsk ? "2p" : "3p"})
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="flex-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isAsk
            ? "Sang phản hồi"
            : round < 3
              ? `Sang Chặng ${round + 1}`
              : "Hoàn thành"}
        </Button>
      </div>
    </div>
  );
}

function TimerAdmin({ startedAt, duration }: { startedAt: number | null; duration: number | null }) {
  const { display, isFinished } = useCountdown(startedAt, duration);

  if (!startedAt || !duration) return null;

  return (
    <p className={`text-2xl font-mono font-bold text-center ${isFinished ? "text-destructive" : "text-primary"}`}>
      {display} {isFinished && "— Hết giờ!"}
    </p>
  );
}

// === Step: Completion ===

function CompletionControls({ dispatch }: { dispatch: Dispatch }) {
  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Đã hoàn thành 3 chặng!</p>
      <Button
        onClick={() => dispatch({ type: "GO_TO_SCORING" } as never)}
        className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Nhập điểm & công bố
      </Button>
    </div>
  );
}

// === Step: Scoring ===

function ScoringControls({ state, dispatch }: { state: GameState; dispatch: Dispatch }) {
  const [scores, setScores] = useState<Record<number, string>>({
    0: String(state.scores[0] ?? ""),
    1: String(state.scores[1] ?? ""),
    2: String(state.scores[2] ?? ""),
  });
  const [photos, setPhotos] = useState<Record<number, string>>({
    0: state.teamPhotos[0] ?? "",
    1: state.teamPhotos[1] ?? "",
    2: state.teamPhotos[2] ?? "",
  });
  const [error, setError] = useState("");

  const handleSaveScore = (idx: number) => {
    const val = Number(scores[idx]);
    if (isNaN(val)) return;
    dispatch({ type: "SET_SCORE", teamIdx: idx, score: val } as never);
  };

  const handleSavePhoto = (idx: number) => {
    if (!photos[idx].trim()) return;
    dispatch({ type: "SET_PHOTO", teamIdx: idx, url: photos[idx].trim() } as never);
  };

  const handlePublish = () => {
    // Check all scores entered
    const allScores = [0, 1, 2].map((i) => Number(scores[i]));
    if (allScores.some(isNaN)) {
      setError("Nhập đủ điểm cho 3 đội");
      return;
    }

    // Save all scores first
    for (let i = 0; i < 3; i++) {
      dispatch({ type: "SET_SCORE", teamIdx: i, score: allScores[i] } as never);
      if (photos[i].trim()) {
        dispatch({ type: "SET_PHOTO", teamIdx: i, url: photos[i].trim() } as never);
      }
    }

    // Rank: highest score first
    const ranked = [0, 1, 2].sort((a, b) => allScores[b] - allScores[a]);
    const order: [number, number, number] = [ranked[0], ranked[1], ranked[2]];

    dispatch({ type: "SET_AWARDS", order } as never);

    // Go to awards
    setTimeout(() => {
      dispatch({ type: "GO_TO_AWARDS", place: "3rd" } as never);
    }, 300);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Nhập điểm & ảnh đội</p>

      {[0, 1, 2].map((idx) => (
        <div key={idx} className="space-y-1 p-3 rounded-lg bg-muted/30">
          <p className="text-xs font-bold">{state.teams[idx]}</p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Điểm..."
              value={scores[idx]}
              onChange={(e) => {
                setScores({ ...scores, [idx]: (e.target as HTMLInputElement).value });
                if (error) setError("");
              }}
              onBlur={() => handleSaveScore(idx)}
              className="h-8 border flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="URL ảnh đội (tuỳ chọn)..."
              value={photos[idx]}
              onChange={(e) =>
                setPhotos({ ...photos, [idx]: (e.target as HTMLInputElement).value })
              }
              onBlur={() => handleSavePhoto(idx)}
              className="h-8 border flex-1 text-xs"
            />
          </div>
        </div>
      ))}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button
        onClick={handlePublish}
        className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Công bố kết quả
      </Button>
    </div>
  );
}

// === Step: Awards ===

function AwardsControls({ state, dispatch }: { state: GameState; dispatch: Dispatch }) {
  const step = state.step;

  const handleNext = () => {
    if (step === "awards-3rd") {
      dispatch({ type: "GO_TO_AWARDS", place: "2nd" } as never);
    } else if (step === "awards-2nd") {
      dispatch({ type: "GO_TO_AWARDS", place: "1st" } as never);
    }
  };

  const label = step === "awards-3rd"
    ? "Giải Ba"
    : step === "awards-2nd"
      ? "Giải Nhì"
      : "Giải Nhất";

  const isLast = step === "awards-1st";

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">
        Đang công bố: {label}
      </p>

      {state.awardsOrder && (
        <div className="text-sm space-y-1">
          {step === "awards-3rd" && (
            <p>Giải Ba: <strong>{state.teams[state.awardsOrder[2]]}</strong></p>
          )}
          {(step === "awards-2nd" || step === "awards-1st") && (
            <>
              <p>Giải Ba: <strong>{state.teams[state.awardsOrder[2]]}</strong></p>
              <p>Giải Nhì: <strong>{state.teams[state.awardsOrder[1]]}</strong></p>
            </>
          )}
          {step === "awards-1st" && (
            <p>Giải Nhất: <strong>{state.teams[state.awardsOrder[0]]}</strong></p>
          )}
        </div>
      )}

      {!isLast && (
        <Button
          onClick={handleNext}
          className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Công bố {step === "awards-3rd" ? "Giải Nhì" : "Giải Nhất"}
        </Button>
      )}

      {isLast && (
        <Button
          onClick={() => dispatch({ type: "RESET" } as never)}
          className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Chơi lại
        </Button>
      )}
    </div>
  );
}
