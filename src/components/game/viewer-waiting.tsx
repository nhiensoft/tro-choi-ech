"use client";

import { DecorativeBg } from "./decorative-bg";

export function ViewerWaiting() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 p-8 overflow-hidden">
      <DecorativeBg />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Imperial lotus SVG above title */}
        <svg
          className="w-20 h-20 animate-ornament"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#8B6914" transform="rotate(-36 40 40)" opacity="0.7" />
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#8B6914" transform="rotate(0 40 40)" opacity="0.8" />
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#8B6914" transform="rotate(36 40 40)" opacity="0.7" />
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#8B6914" transform="rotate(72 40 40)" opacity="0.6" />
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#8B6914" transform="rotate(-72 40 40)" opacity="0.6" />
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#a67c1a" transform="rotate(108 40 40)" opacity="0.5" />
          <ellipse cx="40" cy="40" rx="9" ry="26" fill="#a67c1a" transform="rotate(-108 40 40)" opacity="0.5" />
          <circle cx="40" cy="40" r="8" fill="#a67c1a" />
          <circle cx="40" cy="40" r="4" fill="#faf7f0" />
          <circle cx="40" cy="40" r="2" fill="#8B6914" />
        </svg>

        {/* Main game title */}
        <div className="space-y-3">
          <h1
            className="text-gold-gradient font-bold leading-tight"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
          >
            Vùng Đất Kinh Đô
          </h1>
          {/* Decorative rule under title */}
          <div className="flex items-center justify-center gap-3">
            <div
              className="h-px flex-1 max-w-[80px]"
              style={{ background: "linear-gradient(to right, transparent, rgba(139,105,20,0.6))" }}
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#8B6914" opacity="0.8" />
            </svg>
            <div
              className="h-px flex-1 max-w-[80px]"
              style={{ background: "linear-gradient(to left, transparent, rgba(139,105,20,0.6))" }}
            />
          </div>
          <p
            className="font-medium tracking-wide"
            style={{ color: "#6b5e4f", fontSize: "clamp(1rem, 3vw, 1.35rem)" }}
          >
            Chặng 2 — Phản biện Website Du lịch
          </p>
        </div>

        {/* Waiting indicator */}
        <div
          className="flex items-center gap-4 px-8 py-4 rounded-full mt-4"
          style={{
            background: "rgba(139,105,20,0.07)",
            border: "1px solid rgba(139,105,20,0.22)",
          }}
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full animate-gold-pulse"
                style={{
                  background: "#8B6914",
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
          <p
            className="font-medium tracking-wide"
            style={{ color: "#6d4c0a", fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)" }}
          >
            Đang chờ MC bắt đầu...
          </p>
        </div>

        {/* Bottom tagline */}
        <p
          className="italic max-w-md"
          style={{ color: "rgba(107,94,79,0.7)", fontSize: "0.9rem" }}
        >
          Cuộc thi phản biện website du lịch Huế
        </p>
      </div>
    </div>
  );
}
