"use client";

export function DecorativeBg() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Warm cream background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,105,20,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(124,58,237,0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(196,30,58,0.04) 0%, transparent 50%), #faf7f0",
        }}
      />

      {/* Subtle top edge line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,105,20,0.5) 30%, rgba(139,105,20,0.9) 50%, rgba(139,105,20,0.5) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,105,20,0.25) 30%, rgba(139,105,20,0.5) 50%, rgba(139,105,20,0.25) 70%, transparent 100%)",
        }}
      />

      {/* Imperial pattern — top-left corner ornament */}
      <svg
        className="absolute top-0 left-0 w-48 h-48 animate-ornament"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 L80 0 L80 10 L10 10 L10 80 L0 80 Z"
          fill="rgba(139,105,20,0.18)"
        />
        <path
          d="M0 0 L50 0 L50 4 L4 4 L4 50 L0 50 Z"
          fill="rgba(139,105,20,0.35)"
        />
        {/* Corner lotus bud */}
        <g transform="translate(28, 28)">
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(-45)" />
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(45)" />
          <ellipse cx="0" cy="0" rx="3" ry="6" fill="rgba(139,105,20,0.75)" transform="rotate(0)" />
          <circle cx="0" cy="0" r="3" fill="rgba(139,105,20,0.9)" />
        </g>
        {/* Decorative dots along top border */}
        <circle cx="100" cy="5" r="2" fill="rgba(139,105,20,0.45)" />
        <circle cx="130" cy="5" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="70" cy="5" r="1.5" fill="rgba(139,105,20,0.3)" />
        {/* Decorative dots along left border */}
        <circle cx="5" cy="100" r="2" fill="rgba(139,105,20,0.45)" />
        <circle cx="5" cy="130" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="5" cy="70" r="1.5" fill="rgba(139,105,20,0.3)" />
      </svg>

      {/* Imperial pattern — top-right corner ornament */}
      <svg
        className="absolute top-0 right-0 w-48 h-48 animate-ornament"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: "0.8s" }}
      >
        <path
          d="M200 0 L120 0 L120 10 L190 10 L190 80 L200 80 Z"
          fill="rgba(139,105,20,0.18)"
        />
        <path
          d="M200 0 L150 0 L150 4 L196 4 L196 50 L200 50 Z"
          fill="rgba(139,105,20,0.35)"
        />
        <g transform="translate(172, 28)">
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(-45)" />
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(45)" />
          <ellipse cx="0" cy="0" rx="3" ry="6" fill="rgba(139,105,20,0.75)" />
          <circle cx="0" cy="0" r="3" fill="rgba(139,105,20,0.9)" />
        </g>
        <circle cx="100" cy="5" r="2" fill="rgba(139,105,20,0.45)" />
        <circle cx="70" cy="5" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="130" cy="5" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="195" cy="100" r="2" fill="rgba(139,105,20,0.45)" />
        <circle cx="195" cy="130" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="195" cy="70" r="1.5" fill="rgba(139,105,20,0.3)" />
      </svg>

      {/* Imperial pattern — bottom-left corner ornament */}
      <svg
        className="absolute bottom-0 left-0 w-48 h-48 animate-ornament"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: "1.2s" }}
      >
        <path
          d="M0 200 L80 200 L80 190 L10 190 L10 120 L0 120 Z"
          fill="rgba(139,105,20,0.18)"
        />
        <path
          d="M0 200 L50 200 L50 196 L4 196 L4 150 L0 150 Z"
          fill="rgba(139,105,20,0.35)"
        />
        <g transform="translate(28, 172)">
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(-45)" />
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(45)" />
          <ellipse cx="0" cy="0" rx="3" ry="6" fill="rgba(139,105,20,0.75)" />
          <circle cx="0" cy="0" r="3" fill="rgba(139,105,20,0.9)" />
        </g>
        <circle cx="5" cy="100" r="2" fill="rgba(139,105,20,0.45)" />
        <circle cx="5" cy="70" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="5" cy="130" r="1.5" fill="rgba(139,105,20,0.3)" />
      </svg>

      {/* Imperial pattern — bottom-right corner ornament */}
      <svg
        className="absolute bottom-0 right-0 w-48 h-48 animate-ornament"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: "0.4s" }}
      >
        <path
          d="M200 200 L120 200 L120 190 L190 190 L190 120 L200 120 Z"
          fill="rgba(139,105,20,0.18)"
        />
        <path
          d="M200 200 L150 200 L150 196 L196 196 L196 150 L200 150 Z"
          fill="rgba(139,105,20,0.35)"
        />
        <g transform="translate(172, 172)">
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(-45)" />
          <ellipse cx="0" cy="0" rx="4" ry="8" fill="rgba(139,105,20,0.55)" transform="rotate(45)" />
          <ellipse cx="0" cy="0" rx="3" ry="6" fill="rgba(139,105,20,0.75)" />
          <circle cx="0" cy="0" r="3" fill="rgba(139,105,20,0.9)" />
        </g>
        <circle cx="195" cy="100" r="2" fill="rgba(139,105,20,0.45)" />
        <circle cx="195" cy="70" r="1.5" fill="rgba(139,105,20,0.3)" />
        <circle cx="195" cy="130" r="1.5" fill="rgba(139,105,20,0.3)" />
      </svg>

      {/* Floating lotus petals — scattered across screen */}
      {/* Petal 1 — top left area */}
      <svg
        className="absolute w-16 h-16"
        style={{
          top: "12%",
          left: "8%",
          animation: "lotus-sway 6s ease-in-out infinite",
          opacity: 0.18,
        }}
        viewBox="0 0 60 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#a67c1a" transform="rotate(0 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(60 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-60 30 30)" />
        <circle cx="30" cy="30" r="5" fill="#a67c1a" />
      </svg>

      {/* Petal 2 — top right area */}
      <svg
        className="absolute w-20 h-20"
        style={{
          top: "8%",
          right: "12%",
          animation: "lotus-sway-r 7s ease-in-out infinite",
          animationDelay: "1s",
          opacity: 0.15,
        }}
        viewBox="0 0 60 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#a67c1a" transform="rotate(0 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(60 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-60 30 30)" />
        <circle cx="30" cy="30" r="5" fill="#a67c1a" />
      </svg>

      {/* Petal 3 — bottom left */}
      <svg
        className="absolute w-14 h-14"
        style={{
          bottom: "15%",
          left: "15%",
          animation: "lotus-sway 8s ease-in-out infinite",
          animationDelay: "2.5s",
          opacity: 0.12,
        }}
        viewBox="0 0 60 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#c41e3a" transform="rotate(-30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#c41e3a" transform="rotate(30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#e84060" transform="rotate(0 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#c41e3a" transform="rotate(60 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#c41e3a" transform="rotate(-60 30 30)" />
        <circle cx="30" cy="30" r="5" fill="#a67c1a" />
      </svg>

      {/* Petal 4 — bottom right */}
      <svg
        className="absolute w-12 h-12"
        style={{
          bottom: "20%",
          right: "10%",
          animation: "lotus-sway-r 5.5s ease-in-out infinite",
          animationDelay: "1.8s",
          opacity: 0.14,
        }}
        viewBox="0 0 60 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#a67c1a" transform="rotate(0 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(60 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-60 30 30)" />
        <circle cx="30" cy="30" r="5" fill="#a67c1a" />
      </svg>

      {/* Petal 5 — mid left */}
      <svg
        className="absolute w-10 h-10"
        style={{
          top: "45%",
          left: "4%",
          animation: "lotus-sway 9s ease-in-out infinite",
          animationDelay: "3.5s",
          opacity: 0.1,
        }}
        viewBox="0 0 60 60"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(30 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#a67c1a" transform="rotate(0 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(60 30 30)" />
        <ellipse cx="30" cy="30" rx="8" ry="22" fill="#8B6914" transform="rotate(-60 30 30)" />
        <circle cx="30" cy="30" r="5" fill="#a67c1a" />
      </svg>

      {/* Floating warm gold particles */}
      {[
        { top: "20%", left: "25%", size: 3, delay: "0s", dur: "3.2s" },
        { top: "35%", left: "75%", size: 2, delay: "0.7s", dur: "4s" },
        { top: "60%", left: "20%", size: 4, delay: "1.4s", dur: "3.6s" },
        { top: "75%", left: "60%", size: 2, delay: "0.3s", dur: "2.8s" },
        { top: "15%", left: "55%", size: 3, delay: "2s", dur: "4.4s" },
        { top: "50%", left: "88%", size: 2, delay: "1s", dur: "3s" },
        { top: "80%", left: "40%", size: 3, delay: "2.5s", dur: "3.8s" },
        { top: "25%", left: "90%", size: 2, delay: "0.5s", dur: "4.2s" },
        { top: "70%", left: "85%", size: 3, delay: "1.8s", dur: "3.4s" },
        { top: "42%", left: "48%", size: 2, delay: "3s", dur: "5s" },
        { top: "88%", left: "15%", size: 2, delay: "1.2s", dur: "3.9s" },
        { top: "5%", left: "38%", size: 3, delay: "0.9s", dur: "4.6s" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: "#8B6914",
            animation: `particle-float ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            opacity: 0.35,
          }}
        />
      ))}

      {/* Centre subtle warm vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(200,180,140,0.12) 100%)",
        }}
      />
    </div>
  );
}
