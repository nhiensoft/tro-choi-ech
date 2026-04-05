"use client";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/game-types";

const ROLE_STYLES: Record<
  Role | "default",
  { gradient: string; border: string; glow: string; text: string }
> = {
  "Gen Z": {
    gradient: "linear-gradient(135deg, #1a0d3a 0%, #2d1b69 50%, #3d2080 100%)",
    border: "rgba(139,92,246,0.7)",
    glow: "rgba(139,92,246,0.5)",
    text: "#d4b8ff",
  },
  "Nhà đầu tư": {
    gradient: "linear-gradient(135deg, #1a1200 0%, #3a2800 50%, #4a3200 100%)",
    border: "rgba(212,168,67,0.7)",
    glow: "rgba(212,168,67,0.5)",
    text: "#f0cb6a",
  },
  "Khách du lịch": {
    gradient: "linear-gradient(135deg, #001a1f 0%, #003340 50%, #004050 100%)",
    border: "rgba(6,182,212,0.7)",
    glow: "rgba(6,182,212,0.5)",
    text: "#7de8ff",
  },
  default: {
    gradient: "linear-gradient(135deg, #0f1526 0%, #1a2035 100%)",
    border: "rgba(212,168,67,0.7)",
    glow: "rgba(212,168,67,0.4)",
    text: "#d4a843",
  },
};

interface FlipCardProps {
  content: string;
  role?: Role | null;
  flipped: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function FlipCard({
  content,
  role,
  flipped,
  disabled = false,
  onSelect,
  className,
}: FlipCardProps) {
  const style = role ? ROLE_STYLES[role] : ROLE_STYLES.default;

  return (
    <div
      className={cn("w-48 h-64", className)}
      style={{ perspective: "1000px" }}
      onClick={() => {
        if (!disabled && !flipped && onSelect) onSelect();
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          cursor: !disabled && !flipped ? "pointer" : "default",
        }}
      >
        {/* Front face — mystery "?" */}
        <div
          className={cn(
            "absolute inset-0",
            "rounded-2xl",
            "flex flex-col items-center justify-center gap-3"
          )}
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #0f1526 0%, #131829 50%, #1a2035 100%)",
            border: `2px solid ${!disabled && !flipped ? "rgba(212,168,67,0.45)" : "rgba(212,168,67,0.2)"}`,
            boxShadow: !disabled && !flipped
              ? "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(212,168,67,0.15)"
              : "0 4px 16px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
        >
          {/* Imperial pattern corner dots */}
          <div
            className="absolute top-2 left-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(212,168,67,0.3)" }}
          />
          <div
            className="absolute top-2 right-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(212,168,67,0.3)" }}
          />
          <div
            className="absolute bottom-2 left-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(212,168,67,0.3)" }}
          />
          <div
            className="absolute bottom-2 right-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(212,168,67,0.3)" }}
          />

          {/* Lotus icon */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <ellipse cx="18" cy="18" rx="5" ry="13" fill="rgba(212,168,67,0.25)" transform="rotate(-36 18 18)" />
            <ellipse cx="18" cy="18" rx="5" ry="13" fill="rgba(212,168,67,0.25)" transform="rotate(0 18 18)" />
            <ellipse cx="18" cy="18" rx="5" ry="13" fill="rgba(212,168,67,0.25)" transform="rotate(36 18 18)" />
            <ellipse cx="18" cy="18" rx="5" ry="13" fill="rgba(212,168,67,0.2)" transform="rotate(72 18 18)" />
            <ellipse cx="18" cy="18" rx="5" ry="13" fill="rgba(212,168,67,0.2)" transform="rotate(-72 18 18)" />
            <circle cx="18" cy="18" r="5" fill="rgba(212,168,67,0.4)" />
          </svg>

          {/* "?" */}
          <span
            className="font-bold select-none"
            style={{
              color: "#d4a843",
              fontSize: "3.5rem",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(212,168,67,0.5)",
            }}
          >
            ?
          </span>
        </div>

        {/* Back face — role content */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-4"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: style.gradient,
            border: `2px solid ${style.border}`,
            boxShadow: flipped
              ? `0 0 30px ${style.glow}, 0 0 60px ${style.glow.replace("0.5", "0.2")}, 0 8px 32px rgba(0,0,0,0.7)`
              : "none",
          }}
        >
          {/* Corner ornaments */}
          <div
            className="absolute top-2 left-2 w-3 h-3 rounded-full"
            style={{ background: style.border }}
          />
          <div
            className="absolute top-2 right-2 w-3 h-3 rounded-full"
            style={{ background: style.border }}
          />
          <div
            className="absolute bottom-2 left-2 w-3 h-3 rounded-full"
            style={{ background: style.border }}
          />
          <div
            className="absolute bottom-2 right-2 w-3 h-3 rounded-full"
            style={{ background: style.border }}
          />

          <span
            className="font-bold text-center leading-tight select-none"
            style={{
              color: style.text,
              fontSize: "1.5rem",
              textShadow: `0 0 16px ${style.glow}`,
            }}
          >
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
