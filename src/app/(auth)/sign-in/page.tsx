"use client";

import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn.email({ email, password });
    if (result.error) {
      setError(result.error.message || "An error occurred");
      setLoading(false);
    } else {
      router.push("/repos");
    }
  };

  const handleGithubSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/repos",
      });
    } catch (err) {
      setError("Failed to sign in with GitHub");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1.5 text-sm text-white/50">Sign in with GitHub or your email.</p>
        </div>

        <button
          onClick={handleGithubSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <FaGithub className="size-4" />
          Continue with GitHub
        </button>

        <div className="my-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-white/70">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:ring-1 focus:ring-white/20 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-white/70">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:ring-1 focus:ring-white/20 disabled:opacity-50"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-white/60 transition-colors hover:text-white">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
