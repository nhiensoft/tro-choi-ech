import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "crypto";
import { AdminShell } from "@/components/game/admin-shell";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;

  const password = process.env.ADMIN_PASSWORD;
  if (!password || !session) {
    redirect("/admin/login");
  }

  const expected = createHmac("sha256", password).update("admin").digest("hex");
  if (session !== expected) {
    redirect("/admin/login");
  }

  return <AdminShell />;
}
