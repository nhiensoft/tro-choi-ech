"use client";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/game-types";

const ROLE_STYLES: Record<
  Role | "default",
  { bg: string; glow: string; text: string }
> = {
  "Gen Z": {
    bg: "bg-role-genz",
    glow: "shadow-glow-genz",
    text: "text-role-genz-foreground",
  },
  "Nhà đầu tư": {
    bg: "bg-role-investor",
    glow: "shadow-glow-investor",
    text: "text-role-investor-foreground",
  },
  "Khách du lịch": {
    bg: "bg-role-tourist",
    glow: "shadow-glow-tourist",
    text: "text-role-tourist-foreground",
  },
  default: {
    bg: "bg-primary",
    glow: "",
    text: "text-primary-foreground",
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
          transition: "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          cursor: !disabled && !flipped ? "pointer" : "default",
        }}
      >
        {/* Mặt trước — dấu ? */}
        <div
          className={cn(
            "absolute inset-0",
            "rounded-2xl border-2 border-border bg-card",
            "flex items-center justify-center",
            "shadow-lg",
            !disabled && !flipped && "hover:shadow-xl hover:border-primary/50"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-6xl font-bold text-primary select-none">?</span>
        </div>

        {/* Mặt sau — nội dung */}
        <div
          className={cn(
            "absolute inset-0",
            "rounded-2xl border-2",
            style.bg,
            style.text,
            flipped && style.glow,
            "flex flex-col items-center justify-center gap-2 p-4",
            "border-transparent"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-2xl font-bold text-center leading-tight">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
