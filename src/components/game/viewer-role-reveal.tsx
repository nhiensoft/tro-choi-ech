"use client";

import { useEffect, useRef, useState } from "react";
import { FlipCard } from "@/components/game/flip-card";
import { useSound } from "@/hooks/use-sound";
import { type GameState, type Role } from "@/lib/game-types";
import { DecorativeBg } from "./decorative-bg";

const ROLE_TEXT_COLOR: Record<Role, string> = {
  "Gen Z": "#7c3aed",
  "Nhà đầu tư": "#8B6914",
  "Khách du lịch": "#0891b2",
};

export function ViewerRoleReveal({ state }: { state: GameState }) {
  const { play } = useSound();
  const currentTeamIdx = state.pickOrder[state.currentPickerIdx];
  const currentTeamName = state.teams[currentTeamIdx];

  // Track which box indices have been revealed (with animation)
  const [revealedBoxes, setRevealedBoxes] = useState<Set<number>>(new Set());
  const prevRolesCountRef = useRef(Object.keys(state.roles).length);

  // Determine which boxes are opened based on roles assigned
  const assignedRoles = new Set(Object.values(state.roles));
  // Initialize revealed boxes from existing state (for late-joining viewers)
  useEffect(() => {
    const initialRevealed = new Set<number>();
    state.boxRoles.forEach((role, idx) => {
      if (assignedRoles.has(role)) {
        initialRevealed.add(idx);
      }
    });
    if (initialRevealed.size > 0 && revealedBoxes.size === 0) {
      setRevealedBoxes(initialRevealed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a new role is picked, reveal the corresponding box with sound
  useEffect(() => {
    const currentCount = Object.keys(state.roles).length;
    if (currentCount > prevRolesCountRef.current) {
      play("reveal");
      // Find newly opened box
      const newRevealed = new Set(revealedBoxes);
      state.boxRoles.forEach((role, idx) => {
        if (assignedRoles.has(role)) {
          newRevealed.add(idx);
        }
      });
      setRevealedBoxes(newRevealed);
    }
    prevRolesCountRef.current = currentCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.roles]);

  // Find which team picked which box
  const getTeamForRole = (role: Role): string | null => {
    for (const [teamIdx, assignedRole] of Object.entries(state.roles)) {
      if (assignedRole === role) {
        return state.teams[Number(teamIdx)];
      }
    }
    return null;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 px-8 pb-8 pt-12 overflow-hidden">
      <DecorativeBg />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <p
            className="font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#6b5e4f", fontSize: "0.85rem" }}
          >
            Lượt {Math.min(state.currentPickerIdx + 1, 3)} / 3 — Bốc vai trò
          </p>
          <h2
            className="text-gold-gradient font-bold"
            style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
          >
            {currentTeamName}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div
              className="h-px w-16"
              style={{ background: "linear-gradient(to right, transparent, rgba(139,105,20,0.55))" }}
            />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="4" fill="#8B6914" opacity="0.7" />
              <circle cx="5" cy="5" r="2" fill="#faf7f0" />
            </svg>
            <div
              className="h-px w-16"
              style={{ background: "linear-gradient(to left, transparent, rgba(139,105,20,0.55))" }}
            />
          </div>
        </div>

        {/* 3 Numbered Gift Boxes */}
        <div className="flex gap-6 items-center justify-center flex-wrap">
          {state.boxRoles.map((role, boxIdx) => {
            const isOpened = revealedBoxes.has(boxIdx);
            const teamName = getTeamForRole(role);

            return (
              <div key={boxIdx} className="flex flex-col items-center gap-2">
                <FlipCard
                  content={role}
                  role={role}
                  flipped={isOpened}
                  disabled
                  label={String(boxIdx + 1)}
                />
                {/* Show team name under opened box */}
                {isOpened && teamName && (
                  <div
                    className="px-4 py-1.5 rounded-lg text-center animate-float-up"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(139,105,20,0.15)",
                      boxShadow: "0 2px 8px rgba(139,105,20,0.07)",
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{ color: ROLE_TEXT_COLOR[role] ?? "#8B6914", fontSize: "0.85rem" }}
                    >
                      {teamName}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
