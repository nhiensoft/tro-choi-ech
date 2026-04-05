"use client";

export function ViewerWaiting() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-[3.5rem] font-bold leading-[1.1] text-primary">
        Trò Chơi Hầu
      </h1>
      <p className="text-xl text-muted-foreground">
        Chặng 2 — Bốc thăm vai trò & phản biện
      </p>
      <div className="flex items-center gap-3 mt-8">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <p className="text-lg text-muted-foreground font-medium">
          Đang chờ MC bắt đầu...
        </p>
      </div>
    </div>
  );
}
