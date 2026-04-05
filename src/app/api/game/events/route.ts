import { addSSEClient, removeSSEClient } from "@/lib/server-game-store";

export const dynamic = "force-dynamic";

type SSEClient = Awaited<ReturnType<typeof addSSEClient>>;

export async function GET() {
  let client: SSEClient | null = null;
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      client = await addSSEClient(controller);

      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
        } catch {
          if (heartbeatInterval) clearInterval(heartbeatInterval);
        }
      }, 30000);
    },
    cancel() {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (client) removeSSEClient(client);
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
