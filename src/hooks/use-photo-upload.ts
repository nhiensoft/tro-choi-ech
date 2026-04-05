"use client";

import { useState } from "react";

export function usePhotoUpload() {
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  const upload = async (file: File, idx: number): Promise<string | null> => {
    setUploading((prev) => ({ ...prev, [idx]: true }));
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("teamIdx", String(idx));
      const res = await fetch("/api/game/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Upload failed");
      }
      const { url } = await res.json() as { url: string };

      // Revoke previous object URL to avoid memory leak
      setPreviews((prev) => {
        if (prev[idx]) URL.revokeObjectURL(prev[idx]);
        return { ...prev, [idx]: URL.createObjectURL(file) };
      });

      return url;
    } catch (e) {
      setError(e instanceof Error ? e.message : `Upload ảnh đội ${idx + 1} thất bại`);
      return null;
    } finally {
      setUploading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  return { upload, uploading, previews, error, setError };
}
