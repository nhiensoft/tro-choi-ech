"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Đăng nhập thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <Card className="w-full max-w-sm border-2">
        <CardContent className="space-y-4 pt-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Trò Chơi Hầu — Chặng 2</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Mật khẩu</label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => {
                setPassword((e.target as HTMLInputElement).value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className="h-11 border-2"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            size="lg"
            className="w-full h-11 font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
