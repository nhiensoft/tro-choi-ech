import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/auth";
import { kv } from "@vercel/kv";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;

  if (!session || !verifyAdminSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const teamIdx = formData.get("teamIdx") as string | null;

  if (!file || teamIdx === null) {
    return Response.json({ error: "Missing file or teamIdx" }, { status: 400 });
  }

  // Validate teamIdx is strictly 0, 1, or 2
  const teamIdxNum = Number(teamIdx);
  if (!Number.isInteger(teamIdxNum) || teamIdxNum < 0 || teamIdxNum > 2) {
    return Response.json({ error: "Invalid teamIdx" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const contentType = file.type;

  await kv.set(`photo:${teamIdxNum}`, { base64, contentType }, { ex: 86400 }); // 24h TTL

  const url = `/api/game/photo?idx=${teamIdxNum}&t=${Date.now()}`;
  return Response.json({ url });
}
