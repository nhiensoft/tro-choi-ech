"use client";

import { useEffect, useRef, useState } from "react";
import { FlipCard } from "@/components/game/flip-card";
import { useSound } from "@/hooks/use-sound";
import { ROLES, type GameState, type Role } from "@/lib/game-types";
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

  const [revealedRoles, setRevealedRoles] = useState<Set<string>>(new Set());
  const prevRolesCountRef = useRef(Object.keys(state.roles).length);

  useEffect(() => {
    const currentCount = Object.keys(state.roles).length;
    if (currentCount > prevRolesCountRef.current) {
      play("reveal");
      const newRoles = new Set<string>();
      for (const [, role] of Object.entries(state.roles)) {
        newRoles.add(role);
      }
      setRevealedRoles(newRoles);
    }
    prevRolesCountRef.current = currentCount;
  }, [state.roles, play]);

  const assignedList = state.pickOrder
    .slice(0, state.currentPickerIdx + 1)
    .filter((idx) => state.roles[idx])
    .map((idx) => ({
      teamName: state.teams[idx],
      role: state.roles[idx],
    }));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 p-8 overflow-hidden">
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

        {/* Cards */}
        <div className="flex gap-6 items-center justify-center flex-wrap">
          {state.remainingRoles.map((role) => (
            <FlipCard
              key={role}
              content={role}
              role={role}
              flipped={false}
              disabled
            />
          ))}
          {state.roles[currentTeamIdx] && (
            <FlipCard
              key={state.roles[currentTeamIdx]}
              content={state.roles[currentTeamIdx]}
              role={state.roles[currentTeamIdx]}
              flipped={revealedRoles.has(state.roles[currentTeamIdx])}
              disabled
            />
          )}
        </div>

        {/* Previous assignments */}
        {assignedList.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            {assignedList.map(({ teamName, role }) => (
              <div
                key={teamName}
                className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(139,105,20,0.15)",
                  boxShadow: "0 2px 12px rgba(139,105,20,0.07)",
                }}
              >
                <span
                  className="font-bold"
                  style={{ color: "#1a1207", fontSize: "clamp(1rem, 3vw, 1.3rem)" }}
                >
                  {teamName}
                </span>
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
                  <path d="M0 5 L16 5 M12 1 L16 5 L12 9" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                </svg>
                <span
                  className="font-bold"
                  style={{ color: ROLE_TEXT_COLOR[role as Role] ?? "#8B6914", fontSize: "clamp(1rem, 3vw, 1.3rem)" }}
                >
                  {role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
