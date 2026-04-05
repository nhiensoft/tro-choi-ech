import { getState, getVersion } from "@/lib/server-game-store";

export const dynamic = "force-dynamic";

const POLL_INTERVAL = 500; // ms — check KV for changes every 500ms
const HEARTBEAT_INTERVAL = 15000; // ms

export async function GET() {
  const encoder = new TextEncoder();
  let lastVersion = -1;
  let stopped = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial state immediately
      try {
        const state = await getState();
        lastVersion = getVersion();
        const payload = `data: ${JSON.stringify({ state, version: lastVersion })}\n\n`;
        controller.enqueue(encoder.encode(payload));
      } catch {
        // ignore initial fetch error
      }

      // Poll KV for state changes
      const pollTimer = setInterval(async () => {
        if (stopped) return;
        try {
          const currentVersion = await getVersionFromKV();
          if (currentVersion !== lastVersion) {
            const state = await getState(true); // force refresh from KV
            lastVersion = currentVersion;
            const payload = `data: ${JSON.stringify({ state, version: currentVersion })}\n\n`;
            controller.enqueue(encoder.encode(payload));
          }
        } catch {
          // KV read failed — skip this tick
        }
      }, POLL_INTERVAL);

      // Heartbeat to keep connection alive
      const heartbeatTimer = setInterval(() => {
        if (stopped) return;
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          // connection dead
        }
      }, HEARTBEAT_INTERVAL);

      // Cleanup on cancel
      const cleanup = () => {
        stopped = true;
        clearInterval(pollTimer);
        clearInterval(heartbeatTimer);
      };

      // Store cleanup ref for cancel()
      (controller as unknown as Record<string, () => void>).__cleanup = cleanup;
    },
    cancel(controller) {
      stopped = true;
      const ctrl = controller as unknown as Record<string, () => void>;
      if (ctrl.__cleanup) ctrl.__cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// Direct KV version check (lightweight — just reads version number)
async function getVersionFromKV(): Promise<number> {
  const { kv } = await import("@vercel/kv");
  const version = await kv.get<number>("game-version");
  return version ?? 0;
}
