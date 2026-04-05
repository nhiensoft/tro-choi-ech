"use client";

import { useRouter } from "next/navigation";
import { useGameSync } from "@/hooks/use-game-sync";
import { AdminControls } from "./admin-controls";
import { Button } from "@/components/ui/button";
import { getRounds } from "@/lib/game-types";

export function AdminShell() {
  const { state, isConnected } = useGameSync();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Đang kết nối...</p>
      </div>
    );
  }

  const hasRoles = Object.keys(state.roles).length > 0;
  const rounds = hasRoles ? getRounds(state.roles) : [];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-primary">Admin — Trò Chơi Hầu</h1>
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="cursor-pointer text-muted-foreground"
        >
          Đăng xuất
        </Button>
      </div>

      {/* Main: Preview + Controls */}
      <div className="flex gap-6 items-start justify-center flex-wrap">
        {/* Game state preview */}
        <div className="flex-1 min-w-[300px] p-4 rounded-xl border-2 bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Viewer đang thấy (step: {state.step})
          </p>
          <div className="space-y-2 text-sm">
            {state.teams[0] && (
              <div>
                <p className="font-semibold">Đội: {state.teams.join(", ")}</p>
                <p className="text-muted-foreground">
                  Thứ tự bốc: {state.pickOrder.map((i) => state.teams[i]).join(" → ")}
                </p>
              </div>
            )}
            {hasRoles && (
              <div>
                <p className="font-semibold">Vai trò:</p>
                {Object.entries(state.roles).map(([idx, role]) => (
                  <p key={idx} className="text-muted-foreground">
                    {state.teams[Number(idx)]} → {role}
                  </p>
                ))}
              </div>
            )}
            {rounds.length > 0 && (
              <div>
                <p className="font-semibold">Chặng thi:</p>
                {rounds.map((r) => (
                  <p key={r.roundNumber} className="text-muted-foreground">
                    Chặng {r.roundNumber}: {state.teams[r.askerIdx]} ({r.askerRole}) → {state.teams[r.responderIdx]} ({r.responderRole})
                  </p>
                ))}
              </div>
            )}
            {Object.keys(state.scores).length > 0 && (
              <div>
                <p className="font-semibold">Điểm:</p>
                {Object.entries(state.scores).map(([idx, score]) => (
                  <p key={idx} className="text-muted-foreground">
                    {state.teams[Number(idx)]}: {score} điểm
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <AdminControls state={state} />
      </div>
    </div>
  );
}
