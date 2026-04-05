import { kv } from "@vercel/kv";
import type { GameState } from "@/lib/game-types";

export const dynamic = "force-dynamic";

const POLL_INTERVAL = 300; // ms
const HEARTBEAT_INTERVAL = 15000; // ms
const KV_KEY = "game-state";
const KV_VERSION_KEY = "game-version";

export async function GET() {
  const encoder = new TextEncoder();
  let lastVersion = -1;
  let stopped = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial state immediately
      try {
        const [state, version] = await Promise.all([
          kv.get<GameState>(KV_KEY),
          kv.get<number>(KV_VERSION_KEY),
        ]);
        lastVersion = version ?? 0;
        const payload = `data: ${JSON.stringify({ state: state ?? null, version: lastVersion })}\n\n`;
        controller.enqueue(encoder.encode(payload));
      } catch {
        // ignore
      }

      // Poll KV — single call to check version, only fetch state on change
      const pollTimer = setInterval(async () => {
        if (stopped) return;
        try {
          const version = await kv.get<number>(KV_VERSION_KEY) ?? 0;
          if (version !== lastVersion) {
            const state = await kv.get<GameState>(KV_KEY);
            lastVersion = version;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ state, version })}\n\n`)
            );
          }
        } catch {
          // skip
        }
      }, POLL_INTERVAL);

      const heartbeatTimer = setInterval(() => {
        if (stopped) return;
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          // dead
        }
      }, HEARTBEAT_INTERVAL);

      const cleanup = () => {
        stopped = true;
        clearInterval(pollTimer);
        clearInterval(heartbeatTimer);
      };
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
