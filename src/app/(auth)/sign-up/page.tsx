"use client";

import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signUp.email({ name, email, password });
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
    await signIn.social({ provider: "github", callbackURL: "/repos" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Create an account</h1>
          <p className="mt-1.5 text-sm text-white/50">Sign up with GitHub or your email.</p>
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

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-white/70">Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:ring-1 focus:ring-white/20 disabled:opacity-50"
            />
          </div>
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-white/60 transition-colors hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
