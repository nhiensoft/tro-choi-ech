"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";

export function ViewerCompletion() {
  const { play } = useSound();

  useEffect(() => {
    play("success");
  }, [play]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-bold text-primary animate-in zoom-in duration-700">
          Chúc mừng!
        </h2>
        <p className="text-2xl text-muted-foreground">
          Tất cả các đội đã hoàn thành 3 chặng thi
        </p>
      </div>

      <div className="w-24 h-1 bg-primary rounded-full" />

      <p className="text-lg text-muted-foreground text-center max-w-md">
        Ban giám khảo đang tổng hợp điểm. Kết quả sẽ được công bố ngay sau đây...
      </p>

      <div className="flex items-center gap-3 mt-4">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <p className="text-lg text-muted-foreground font-medium">
          Đang chờ công bố kết quả...
        </p>
      </div>
    </div>
  );
}
