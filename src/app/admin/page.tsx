import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { AdminShell } from "@/components/game/admin-shell";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;

  if (!session || !verifyAdminSession(session)) {
    redirect("/admin/login");
  }

  return <AdminShell />;
}
