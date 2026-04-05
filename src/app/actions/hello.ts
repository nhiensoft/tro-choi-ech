"use server";

export async function greet(name: string) {
  const trimmed = name.trim() || "bạn";
  return `Xin chào, ${trimmed}!`;
}
