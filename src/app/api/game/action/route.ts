import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { dispatch } from "@/lib/server-game-store";
import type { GameAction } from "@/lib/game-types";

function verifyAdmin(cookieValue: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = createHmac("sha256", password).update("admin").digest("hex");
  return cookieValue === expected;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;

  if (!session || !verifyAdmin(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const action = (await request.json()) as GameAction;
  const newState = await dispatch(action);
  return Response.json({ state: newState });
}
