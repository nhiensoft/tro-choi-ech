import "server-only";
import { timingSafeEqual, createHmac } from "crypto";

export function generateAdminToken(password: string): string {
  return createHmac("sha256", password).update("admin").digest("hex");
}

export function verifyAdminSession(cookieValue: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = generateAdminToken(password);
  try {
    return timingSafeEqual(Buffer.from(cookieValue, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
