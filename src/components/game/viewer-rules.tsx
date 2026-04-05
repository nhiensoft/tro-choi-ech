"use client";

import { DecorativeBg } from "./decorative-bg";

const rules = [
  {
    text: (
      <>
        Mỗi đội sẽ bốc thăm để nhận một <strong className="text-gold-gradient">vai trò</strong>: Gen Z,
        Nhà đầu tư, hoặc Khách du lịch.
      </>
    ),
  },
  {
    text: (
      <>
        Cuộc thi gồm <strong className="text-gold-gradient">3 chặng</strong>. Mỗi chặng, đội với vai trò
        hỏi sẽ có <strong className="text-gold-gradient">2 phút</strong> để đặt câu hỏi, và đội phản hồi
        có <strong className="text-gold-gradient">3 phút</strong> để trả lời.
      </>
    ),
  },
  {
    text: (
      <>
        <strong style={{ color: "#7c3aed" }}>Chặng 1:</strong> Gen Z hỏi → Nhà đầu tư phản hồi
        <br />
        <strong style={{ color: "#8B6914" }}>Chặng 2:</strong> Nhà đầu tư hỏi → Khách du lịch phản hồi
        <br />
        <strong style={{ color: "#0891b2" }}>Chặng 3:</strong> Khách du lịch hỏi → Gen Z phản hồi
      </>
    ),
  },
  {
    text: (
      <>
        Ban giám khảo sẽ chấm điểm trong suốt quá trình thi. Kết thúc 3 chặng
        sẽ <strong className="text-gold-gradient">công bố kết quả</strong>.
      </>
    ),
  },
];

export function ViewerRules() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-8 p-8 overflow-hidden">
      <DecorativeBg />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <p
            className="font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#6b5e4f", fontSize: "0.85rem" }}
          >
            Vùng Đất Kinh Đô
          </p>
          <h2
            className="text-gold-gradient font-bold"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            Luật chơi
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

        {/* Rules list */}
        <div className="w-full space-y-4">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="flex items-start gap-5 p-6 rounded-2xl animate-float-up"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,247,240,0.95) 100%)",
                border: "1px solid rgba(139,105,20,0.18)",
                boxShadow: "0 4px 24px rgba(139,105,20,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                animationDelay: `${i * 0.12}s`,
                animationFillMode: "both",
              }}
            >
              {/* Number badge */}
              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(139,105,20,0.15) 0%, rgba(139,105,20,0.08) 100%)",
                  border: "2px solid rgba(139,105,20,0.45)",
                  color: "#8B6914",
                  boxShadow: "0 0 12px rgba(139,105,20,0.12)",
                }}
              >
                {i + 1}
              </div>
              <p
                className="leading-relaxed pt-1.5"
                style={{ color: "#1a1207", fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)" }}
              >
                {rule.text}
              </p>
            </div>
          ))}
        </div>

        {/* Waiting indicator */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-gold-pulse"
                style={{ background: "#8B6914", animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
          <p style={{ color: "#6b5e4f", fontSize: "1rem" }} className="font-medium">
            Đang chờ MC tiếp tục...
          </p>
        </div>
      </div>
    </div>
  );
}
