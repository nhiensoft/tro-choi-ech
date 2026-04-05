"use client";

import { useEffect, useRef, useState } from "react";
import { FlipCard } from "@/components/game/flip-card";
import { useSound } from "@/hooks/use-sound";
import { ROLES, type GameState, type Role } from "@/lib/game-types";

export function ViewerRoleReveal({ state }: { state: GameState }) {
  const { play } = useSound();
  const currentTeamIdx = state.pickOrder[state.currentPickerIdx];
  const currentTeamName = state.teams[currentTeamIdx];

  // Track which roles have been revealed (for animation)
  const [revealedRoles, setRevealedRoles] = useState<Set<string>>(new Set());
  const prevRolesCountRef = useRef(Object.keys(state.roles).length);

  // Detect new role assignment → trigger animation
  useEffect(() => {
    const currentCount = Object.keys(state.roles).length;
    if (currentCount > prevRolesCountRef.current) {
      play("reveal");
      // Find the newly assigned role
      const newRoles = new Set<string>();
      for (const [, role] of Object.entries(state.roles)) {
        newRoles.add(role);
      }
      setRevealedRoles(newRoles);
    }
    prevRolesCountRef.current = currentCount;
  }, [state.roles, play]);

  // Show all roles assigned so far
  const assignedList = state.pickOrder
    .slice(0, state.currentPickerIdx + 1)
    .filter((idx) => state.roles[idx])
    .map((idx) => ({
      teamName: state.teams[idx],
      role: state.roles[idx],
    }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground font-medium">
          Lượt {Math.min(state.currentPickerIdx + 1, 3)}/3 — Bốc vai trò hỏi
        </p>
        <h2 className="text-4xl font-bold text-primary">{currentTeamName}</h2>
      </div>

      {/* Cards — show remaining roles as unflipped, assigned role as flipped */}
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
        {/* Show the just-assigned role as flipped */}
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
        <div className="flex flex-col gap-2 mt-4">
          {assignedList.map(({ teamName, role }) => (
            <p key={teamName} className="text-xl font-bold text-center">
              {teamName} →{" "}
              <span className="text-primary">{role}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
