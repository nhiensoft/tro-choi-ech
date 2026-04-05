import { kv } from "@vercel/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idx = searchParams.get("idx");

  if (idx === null) {
    return new Response("Missing idx", { status: 400 });
  }

  const data = await kv.get<{ base64: string; contentType: string }>(`photo:${idx}`);

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = Buffer.from(data.base64, "base64");
  return new Response(buffer, {
    headers: {
      "Content-Type": data.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
