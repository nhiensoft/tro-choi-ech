import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/auth";
import { dispatch } from "@/lib/server-game-store";
import type { GameAction } from "@/lib/game-types";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;

  if (!session || !verifyAdminSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const action = (await request.json()) as GameAction;
  const newState = await dispatch(action);
  return Response.json({ state: newState });
}
