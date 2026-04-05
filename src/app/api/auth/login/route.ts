import { cookies } from "next/headers";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return Response.json({ error: "Sai mật khẩu" }, { status: 401 });
  }

  const token = createHmac("sha256", adminPassword).update("admin").digest("hex");

  const cookieStore = await cookies();
  cookieStore.set("admin-session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 86400, // 24h
  });

  return Response.json({ ok: true });
}
