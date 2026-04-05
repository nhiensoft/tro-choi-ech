"use client";

import Image from "next/image";

const SECTIONS = [
  { src: "/logos/don-vi-to-chuc.png", alt: "Đơn vị tổ chức" },
  { src: "/logos/don-vi-phoi-hop.png", alt: "Đơn vị phối hợp" },
  { src: "/logos/nha-tai-tro.png", alt: "Nhà tài trợ" },
  { src: "/logos/ho-tro-ky-thuat.png", alt: "Hỗ trợ kỹ thuật" },
];

export function SponsorBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-stretch"
      style={{ background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      {SECTIONS.map((section, i) => (
        <div
          key={section.alt}
          className="flex-1 flex items-center justify-center"
          style={{
            borderRight: i < SECTIONS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
          }}
        >
          <div className="relative" style={{ height: "clamp(36px, 5.5vw, 72px)", width: "100%" }}>
            <Image
              src={section.src}
              alt={section.alt}
              fill
              className="object-contain"
              sizes="25vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
