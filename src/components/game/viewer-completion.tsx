"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import { DecorativeBg } from "./decorative-bg";

export function ViewerCompletion() {
  const { play } = useSound();

  useEffect(() => {
    play("success");
  }, [play]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 p-8 overflow-hidden">
      <DecorativeBg />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-2xl">
        {/* Trophy SVG */}
        <svg
          className="w-24 h-24 animate-ornament"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          {/* Cup body */}
          <path
            d="M22 12 L22 38 Q22 54 40 56 Q58 54 58 38 L58 12 Z"
            fill="rgba(212,168,67,0.15)"
            stroke="#d4a843"
            strokeWidth="2"
          />
          {/* Handles */}
          <path
            d="M22 20 Q10 20 10 30 Q10 40 22 38"
            fill="none"
            stroke="#d4a843"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M58 20 Q70 20 70 30 Q70 40 58 38"
            fill="none"
            stroke="#d4a843"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Base */}
          <rect x="28" y="56" width="24" height="4" rx="2" fill="#d4a843" opacity="0.6" />
          <rect x="24" y="60" width="32" height="5" rx="2.5" fill="#d4a843" opacity="0.8" />
          {/* Star inside */}
          <path
            d="M40 20 L41.5 26 L48 26 L42.5 30 L44.5 36 L40 32 L35.5 36 L37.5 30 L32 26 L38.5 26 Z"
            fill="#d4a843"
            opacity="0.9"
          />
        </svg>

        {/* Title */}
        <div className="space-y-4">
          <h2
            className="text-gold-gradient font-bold animate-in zoom-in duration-700"
            style={{ fontSize: "clamp(3rem, 9vw, 5.5rem)" }}
          >
            Chúc mừng!
          </h2>
          <p
            className="font-medium"
            style={{ color: "#8a9ab8", fontSize: "clamp(1.1rem, 3vw, 1.5rem)" }}
          >
            Tất cả các đội đã hoàn thành 3 chặng thi
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 w-full max-w-xs">
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.6))" }}
          />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 1 L11.8 8.2 L19 10 L11.8 11.8 L10 19 L8.2 11.8 L1 10 L8.2 8.2 Z"
              fill="#d4a843"
              opacity="0.8"
            />
          </svg>
          <div
            className="h-px flex-1"
            style={{ background: "linear-gradient(to left, transparent, rgba(212,168,67,0.6))" }}
          />
        </div>

        {/* Info box */}
        <div
          className="px-8 py-6 rounded-2xl max-w-md"
          style={{
            background: "linear-gradient(135deg, rgba(19,24,41,0.9) 0%, rgba(26,32,53,0.9) 100%)",
            border: "1px solid rgba(212,168,67,0.2)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <p
            className="leading-relaxed"
            style={{ color: "#b89c5a", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}
          >
            Ban giám khảo đang tổng hợp điểm. Kết quả sẽ được công bố ngay sau đây...
          </p>
        </div>

        {/* Waiting indicator */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-gold-pulse"
                style={{ background: "#d4a843", animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <p style={{ color: "#8a9ab8", fontSize: "1rem" }} className="font-medium">
            Đang chờ công bố kết quả...
          </p>
        </div>
      </div>
    </div>
  );
}
