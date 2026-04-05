import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { kv } from "@vercel/kv";

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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const teamIdx = formData.get("teamIdx") as string | null;

  if (!file || teamIdx === null) {
    return Response.json({ error: "Missing file or teamIdx" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const contentType = file.type || "image/png";

  // Store in KV with key like "photo:0"
  await kv.set(`photo:${teamIdx}`, { base64, contentType }, { ex: 86400 }); // 24h TTL

  const url = `/api/game/photo?idx=${teamIdx}&t=${Date.now()}`;
  return Response.json({ url });
}
