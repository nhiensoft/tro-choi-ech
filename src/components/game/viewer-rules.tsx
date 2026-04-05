"use client";

export function ViewerRules() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h2 className="text-4xl font-bold text-primary">Luật chơi</h2>

      <div className="max-w-2xl w-full space-y-6 text-lg">
        <div className="p-6 rounded-2xl border-2 bg-card space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-primary shrink-0">1.</span>
            <p>
              Mỗi đội sẽ bốc thăm để nhận một <strong>vai trò</strong>: Gen Z,
              Nhà đầu tư, hoặc Khách du lịch.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-primary shrink-0">2.</span>
            <p>
              Cuộc thi gồm <strong>3 chặng</strong>. Mỗi chặng, đội với vai trò
              hỏi sẽ có <strong>2 phút</strong> để đặt câu hỏi, và đội phản hồi
              có <strong>3 phút</strong> để trả lời.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-primary shrink-0">3.</span>
            <p>
              <strong>Chặng 1:</strong> Gen Z hỏi → Nhà đầu tư phản hồi
              <br />
              <strong>Chặng 2:</strong> Nhà đầu tư hỏi → Khách du lịch phản hồi
              <br />
              <strong>Chặng 3:</strong> Khách du lịch hỏi → Gen Z phản hồi
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl font-bold text-primary shrink-0">4.</span>
            <p>
              Ban giám khảo sẽ chấm điểm trong suốt quá trình thi. Kết thúc 3
              chặng sẽ công bố kết quả.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <p className="text-lg text-muted-foreground font-medium">
          Đang chờ MC tiếp tục...
        </p>
      </div>
    </div>
  );
}
