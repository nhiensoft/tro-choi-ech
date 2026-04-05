import { getState, getVersion } from "@/lib/server-game-store";

export async function GET() {
  const state = await getState();
  return Response.json({ state, version: getVersion() });
}
