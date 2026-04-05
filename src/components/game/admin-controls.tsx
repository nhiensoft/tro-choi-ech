"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAction } from "@/hooks/use-admin-action";
import { type GameState, type Role } from "@/lib/game-types";

export function AdminControls({ state }: { state: GameState }) {
  const { dispatch } = useAdminAction();

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
      {state.step === "role-pick" && <RolePickControls state={state} dispatch={dispatch} />}
      {state.step === "debate-pick" && <DebatePickControls state={state} dispatch={dispatch} />}
      {state.step === "result" && <ResultControls dispatch={dispatch} />}
    </div>
  );
}

// === Step: Input ===

function InputControls({ dispatch }: { dispatch: (a: never) => Promise<unknown> }) {
  const [names, setNames] = useState(["", "", ""]);
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
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Nhập tên 3 đội</p>
      {["Đội 1", "Đội 2", "Đội 3"].map((label, i) => (
        <div key={i} className="space-y-1">
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

// === Step: Role Pick ===

function RolePickControls({
  state,
  dispatch,
}: {
  state: GameState;
  dispatch: (a: never) => Promise<unknown>;
}) {
  const currentTeamIdx = state.pickOrder[state.currentPickerIdx];
  const currentTeamName = state.teams[currentTeamIdx];
  const isLastTeam = state.currentPickerIdx === 2;
  const hasPickedRole = !!state.roles[currentTeamIdx];

  const handlePickRole = (role: Role) => {
    dispatch({
      type: "PICK_ROLE",
      teamIdx: currentTeamIdx,
      role,
    } as never);
  };

  const handleNext = () => {
    if (state.currentPickerIdx < 2) {
      dispatch({ type: "NEXT_PICKER" } as never);
    } else {
      dispatch({ type: "GO_TO_DEBATE" } as never);
    }
  };

  // Auto-pick last remaining role for last team
  const handleAutoPickLast = () => {
    if (state.remainingRoles.length === 1) {
      handlePickRole(state.remainingRoles[0]);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">
        Lư��t {state.currentPickerIdx + 1}/3 — {currentTeamName}
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
            {state.currentPickerIdx < 2 ? "Đội tiếp theo" : "Sang vòng phản biện"}
          </Button>
        </div>
      )}
    </div>
  );
}

// === Step: Debate Pick ===

function DebatePickControls({
  state,
  dispatch,
}: {
  state: GameState;
  dispatch: (a: never) => Promise<unknown>;
}) {
  const pickerIdx = state.pickOrder[0];
  const pickerName = state.teams[pickerIdx];
  const otherIdxs = [0, 1, 2].filter((i) => i !== pickerIdx);
  const hasDebates = Object.keys(state.debates).length > 0;

  const handlePickDebate = (targetIdx: number) => {
    dispatch({
      type: "PICK_DEBATE",
      teamIdx: pickerIdx,
      targetIdx,
    } as never);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">
        Phản biện — {pickerName} chọn
      </p>

      {!hasDebates && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Phản biện đội nào?</p>
          {otherIdxs.map((idx) => (
            <Button
              key={idx}
              onClick={() => handlePickDebate(idx)}
              variant="outline"
              className="w-full cursor-pointer"
            >
              {state.teams[idx]}
            </Button>
          ))}
        </div>
      )}

      {hasDebates && (
        <div className="space-y-2">
          {state.pickOrder.map((teamIdx) => (
            <p key={teamIdx} className="text-sm">
              <span className="font-bold">{state.teams[teamIdx]}</span>
              {" → "}
              <span className="text-primary font-bold">
                {state.teams[state.debates[teamIdx]]}
              </span>
            </p>
          ))}
          <Button
            onClick={() => dispatch({ type: "GO_TO_RESULT" } as never)}
            className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Xem tổng kết
          </Button>
        </div>
      )}
    </div>
  );
}

// === Step: Result ===

function ResultControls({ dispatch }: { dispatch: (a: never) => Promise<unknown> }) {
  return (
    <div className="space-y-3 p-4 rounded-xl border-2 bg-card">
      <p className="text-sm font-semibold text-muted-foreground">Hoàn tất!</p>
      <Button
        onClick={() => dispatch({ type: "RESET" } as never)}
        className="w-full cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90"
      >
        Chơi lại
      </Button>
    </div>
  );
}
