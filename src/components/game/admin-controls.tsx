"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAction } from "@/hooks/use-admin-action";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { parseRoundStep, getRounds, type GameState, type GameAction } from "@/lib/game-types";
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

type Dispatch = (action: GameAction) => Promise<unknown>;

// === Step: Input ===

function InputControls({ dispatch }: { dispatch: Dispatch }) {
  const [names, setNames] = useState(["", "", ""]);
  const [nameError, setNameError] = useState("");
  const { upload, uploading, previews, error: uploadError } = usePhotoUpload();

  const handleUpload = async (file: File, idx: number) => {
    const url = await upload(file, idx);
    if (url) {
      dispatch({ type: "SET_PHOTO", teamIdx: idx, url });
    }
  };

  const handleStart = async () => {
    const trimmed = names.map((n) => n.trim());
    if (trimmed.some((n) => n === "")) {
      setNameError("Nhập đủ 3 tên đội");
      return;
    }
    if (new Set(trimmed).size !== 3) {
      setNameError("Tên đội phải khác nhau");
      return;
    }
    try {
      await dispatch({
        type: "SET_TEAMS",
        teams: trimmed as [string, string, string],
      });
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Lỗi khi bắt đầu");
    }
  };

  const displayError = nameError || uploadError;

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
              if (nameError) setNameError("");
            }}
            className="h-9 border"
          />
          <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleUpload(file, i);
              }}
            />
            <span className="px-3 py-1.5 rounded-md border bg-background hover:bg-muted transition-colors">
              {uploading[i] ? "Đang tải..." : previews[i] ? "Đổi ảnh" : "Tải ảnh đội"}
            </span>
            {previews[i] && <span className="text-green-600">Đã tải</span>}
          </label>
          {previews[i] && (
            <img
              src={previews[i]}
              alt={`Preview ${label}`}
              className="w-full h-20 object-cover rounded-md border"
            />
          )}
        </div>
      ))}
      {displayError && <p className="text-xs text-destructive">{displayError}</p>}
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
        onClick={() => dispatch({ type: "GO_TO_ROLE_PICK" })}
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
  const hasPickedRole = !!state.roles[currentTeamIdx];

  // Determine which boxes have been opened
  const assignedRoles = new Set(Object.values(state.roles));
  const isBoxOpened = (boxIdx: number) => assignedRoles.has(state.boxRoles[boxIdx]);

  const handlePickBox = (boxIdx: number) => {
    const role = state.boxRoles[boxIdx];
    dispatch({ type: "PICK_ROLE", teamIdx: currentTeamIdx, role });
  };

  const handleNext = () => {
    if (state.currentPickerIdx < 2) {
      dispatch({ type: "NEXT_PICKER" });
    } else {
      dispatch({ type: "GO_TO_MATCHUP" });
    }
  };

  // Find which team picked which box
  const getTeamForBox = (boxIdx: number): string | null => {
    const role = state.boxRoles[boxIdx];
    for (const [teamIdx, assignedRole] of Object.entries(state.roles)) {
      if (assignedRole === role) {
        return state.teams[Number(teamIdx)];
      }
    }
    return null;
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">
        Lượt {state.currentPickerIdx + 1}/3 — {currentTeamName}
      </p>

      {!hasPickedRole && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Đội chọn hộp số mấy?</p>
          <div className="grid grid-cols-3 gap-2">
            {state.boxRoles.map((role, boxIdx) => {
              const opened = isBoxOpened(boxIdx);
              const teamName = getTeamForBox(boxIdx);
              return (
                <Button
                  key={boxIdx}
                  onClick={() => handlePickBox(boxIdx)}
                  disabled={opened}
                  variant={opened ? "ghost" : "outline"}
                  className={`cursor-pointer h-auto py-3 flex flex-col gap-1 ${opened ? "opacity-50" : "border-2 hover:border-primary"}`}
                >
                  <span className="text-lg font-bold">{boxIdx + 1}</span>
                  {opened && (
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {role} — {teamName}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
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
        onClick={() => dispatch({ type: "GO_TO_ROUND", round: 1, phase: "ask" })}
        className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Bắt đầu Chặng 1
      </Button>
    </div>
  );
}

// === Step: Round ===

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
    dispatch({ type: "START_TIMER", duration });
  };

  const handleNext = () => {
    if (isAsk) {
      dispatch({ type: "GO_TO_ROUND", round: round as 1 | 2 | 3, phase: "respond" });
    } else if (round < 3) {
      dispatch({ type: "GO_TO_ROUND", round: (round + 1) as 1 | 2 | 3, phase: "ask" });
    } else {
      dispatch({ type: "GO_TO_COMPLETION" });
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
        onClick={() => dispatch({ type: "GO_TO_SCORING" })}
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
  const [error, setError] = useState("");
  const { upload, uploading, error: uploadError } = usePhotoUpload();

  const handleSaveScore = (idx: number) => {
    const val = Number(scores[idx]);
    if (isNaN(val)) return;
    dispatch({ type: "SET_SCORE", teamIdx: idx, score: val });
  };

  const handleUpload = async (file: File, idx: number) => {
    const url = await upload(file, idx);
    if (url) {
      dispatch({ type: "SET_PHOTO", teamIdx: idx, url });
    }
  };

  const handlePublish = () => {
    const allScores = [0, 1, 2].map((i) => Number(scores[i]));
    if (allScores.some(isNaN)) {
      setError("Nhập đủ điểm cho 3 đội");
      return;
    }

    const scoresRecord: Record<number, number> = { 0: allScores[0], 1: allScores[1], 2: allScores[2] };
    const ranked = [0, 1, 2].sort((a, b) => allScores[b] - allScores[a]);
    const order: [number, number, number] = [ranked[0], ranked[1], ranked[2]];

    // Atomic: set scores + awards order + navigate to awards-3rd in one dispatch
    dispatch({ type: "PUBLISH_AWARDS", scores: scoresRecord, order });
  };

  const displayError = error || uploadError;

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Nhập điểm & ảnh đội</p>

      {[0, 1, 2].map((idx) => (
        <div key={idx} className="space-y-2 p-3 rounded-lg bg-muted/30">
          <p className="text-xs font-bold">{state.teams[idx]}</p>
          <Input
            type="number"
            placeholder="Điểm..."
            value={scores[idx]}
            onChange={(e) => {
              setScores({ ...scores, [idx]: (e.target as HTMLInputElement).value });
              if (error) setError("");
            }}
            onBlur={() => handleSaveScore(idx)}
            className="h-8 border"
          />
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-xs">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleUpload(file, idx);
                }}
              />
              <span className="px-3 py-1.5 rounded-md border bg-background hover:bg-muted transition-colors">
                {uploading[idx] ? "Đang tải..." : state.teamPhotos[idx] ? "Đổi ảnh" : "Tải ảnh"}
              </span>
            </label>
            {state.teamPhotos[idx] && (
              <span className="text-xs text-green-600">Đã có ảnh</span>
            )}
          </div>
          {state.teamPhotos[idx] && (
            <img
              src={state.teamPhotos[idx]}
              alt={state.teams[idx]}
              className="w-full h-16 object-cover rounded-md border"
            />
          )}
        </div>
      ))}

      {displayError && <p className="text-xs text-destructive">{displayError}</p>}

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
      dispatch({ type: "GO_TO_AWARDS", place: "2nd" });
    } else if (step === "awards-2nd") {
      dispatch({ type: "GO_TO_AWARDS", place: "1st" });
    }
  };

  const label =
    step === "awards-3rd" ? "Giải Ba" : step === "awards-2nd" ? "Giải Nhì" : "Giải Nhất";

  const isLast = step === "awards-1st";

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Đang công bố: {label}</p>

      {state.awardsOrder && (
        <div className="text-sm space-y-1">
          {step === "awards-3rd" && (
            <p>
              Giải Ba: <strong>{state.teams[state.awardsOrder[2]]}</strong>
            </p>
          )}
          {(step === "awards-2nd" || step === "awards-1st") && (
            <>
              <p>
                Giải Ba: <strong>{state.teams[state.awardsOrder[2]]}</strong>
              </p>
              <p>
                Giải Nhì: <strong>{state.teams[state.awardsOrder[1]]}</strong>
              </p>
            </>
          )}
          {step === "awards-1st" && (
            <p>
              Giải Nhất: <strong>{state.teams[state.awardsOrder[0]]}</strong>
            </p>
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
          onClick={() => dispatch({ type: "RESET" })}
          className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Chơi lại
        </Button>
      )}
    </div>
  );
}
