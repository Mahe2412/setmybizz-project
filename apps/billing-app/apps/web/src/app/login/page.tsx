"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const [email, setEmail] = useState("demo@billease.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(embed ? "/dashboard?embed=1" : "/dashboard");
    router.refresh();
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center p-4 ${
        embed ? "bg-slate-50" : "bg-gradient-to-br from-blue-50 to-slate-100"
      }`}
    >
      <div className={`card w-full ${embed ? "max-w-sm shadow-sm" : "max-w-md"}`}>
        <h1 className="text-xl font-bold text-blue-600">Bill Book</h1>
        <p className="mt-1 text-sm text-slate-500">
          {embed ? "Sign in to continue in BizOS" : "GST billing & invoicing for your business"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {!embed && (
          <p className="mt-4 text-center text-sm text-slate-500">
            No account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        )}
        <p className="mt-2 text-center text-xs text-slate-400">
          Demo: demo@billease.app / demo1234
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
