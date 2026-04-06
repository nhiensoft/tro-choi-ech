"use client";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/game-types";

const ROLE_STYLES: Record<
  Role | "default",
  { gradient: string; border: string; glow: string; text: string }
> = {
  "Gen Z": {
    gradient: "linear-gradient(135deg, #f3eeff 0%, #ede0ff 50%, #e2ceff 100%)",
    border: "rgba(124,58,237,0.55)",
    glow: "rgba(124,58,237,0.35)",
    text: "#5b21b6",
  },
  "Nhà đầu tư": {
    gradient: "linear-gradient(135deg, #fdf8ec 0%, #f5e9c4 50%, #edd99a 100%)",
    border: "rgba(139,105,20,0.55)",
    glow: "rgba(139,105,20,0.35)",
    text: "#6d4c0a",
  },
  "Khách du lịch": {
    gradient: "linear-gradient(135deg, #e8f9fd 0%, #c8eef8 50%, #a8e2f2 100%)",
    border: "rgba(8,145,178,0.55)",
    glow: "rgba(8,145,178,0.35)",
    text: "#0e6e8c",
  },
  default: {
    gradient: "linear-gradient(135deg, #faf7f0 0%, #f5f0e8 100%)",
    border: "rgba(139,105,20,0.55)",
    glow: "rgba(139,105,20,0.3)",
    text: "#8B6914",
  },
};

interface FlipCardProps {
  content: string;
  role?: Role | null;
  flipped: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
  label?: string; // number or text to show on front face instead of "?"
}

export function FlipCard({
  content,
  role,
  flipped,
  disabled = false,
  onSelect,
  className,
  label,
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
            background: "linear-gradient(135deg, #ffffff 0%, #faf7f0 50%, #f5f0e8 100%)",
            border: `2px solid ${!disabled && !flipped ? "rgba(139,105,20,0.4)" : "rgba(139,105,20,0.18)"}`,
            boxShadow: !disabled && !flipped
              ? "0 8px 32px rgba(139,105,20,0.15), 0 0 20px rgba(139,105,20,0.08)"
              : "0 4px 16px rgba(139,105,20,0.08)",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
        >
          {/* Imperial pattern corner dots */}
          <div
            className="absolute top-2 left-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(139,105,20,0.3)" }}
          />
          <div
            className="absolute top-2 right-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(139,105,20,0.3)" }}
          />
          <div
            className="absolute bottom-2 left-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(139,105,20,0.3)" }}
          />
          <div
            className="absolute bottom-2 right-2 w-3 h-3 rounded-full"
            style={{ background: "rgba(139,105,20,0.3)" }}
          />

          {/* Gift box icon */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            {/* Ribbon vertical */}
            <rect x="21" y="8" width="6" height="32" rx="1" fill="rgba(196,30,58,0.35)" />
            {/* Ribbon horizontal */}
            <rect x="6" y="18" width="36" height="6" rx="1" fill="rgba(196,30,58,0.35)" />
            {/* Box body */}
            <rect x="6" y="20" width="36" height="20" rx="3" fill="rgba(139,105,20,0.2)" stroke="rgba(139,105,20,0.35)" strokeWidth="1.5" />
            {/* Box lid */}
            <rect x="4" y="16" width="40" height="8" rx="3" fill="rgba(139,105,20,0.28)" stroke="rgba(139,105,20,0.35)" strokeWidth="1.5" />
            {/* Bow left */}
            <ellipse cx="19" cy="14" rx="6" ry="4" fill="rgba(196,30,58,0.3)" transform="rotate(-15 19 14)" />
            {/* Bow right */}
            <ellipse cx="29" cy="14" rx="6" ry="4" fill="rgba(196,30,58,0.3)" transform="rotate(15 29 14)" />
            {/* Bow center */}
            <circle cx="24" cy="15" r="3" fill="rgba(196,30,58,0.4)" />
          </svg>

          {/* Number label or "?" */}
          <span
            className="font-bold select-none"
            style={{
              color: "#8B6914",
              fontSize: label ? "3rem" : "3.5rem",
              lineHeight: 1,
              textShadow: "0 0 20px rgba(139,105,20,0.3)",
            }}
          >
            {label ?? "?"}
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
              ? `0 0 30px ${style.glow}, 0 0 60px ${style.glow.replace("0.35", "0.15")}, 0 8px 32px rgba(0,0,0,0.08)`
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
