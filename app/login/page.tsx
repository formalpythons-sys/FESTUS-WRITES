"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProfileRole } from "@/app/lib/auth";
import { supabase } from "@/app/lib/supabase";

function getSafeNextPath(fallback = "/") {
  if (typeof window === "undefined") return fallback;

  const next = new URLSearchParams(window.location.search).get("next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      setStatusMessage("Please fill in your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      const destination = getSafeNextPath("/");

      if (destination.startsWith("/admin")) {
        const role = await getProfileRole(data.user?.id);

        if (role !== "admin") {
          setStatusMessage("You are logged in, but only admins can access the admin page.");
          return;
        }
      }

      router.push(destination);
      router.refresh();
    } catch (error) {
      console.error("Login failed", error);
      setStatusMessage("Could not log you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-blue-950 p-8 text-white sm:p-10 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">Welcome back</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Sign in here.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-zinc-400">
              Step into thoughtful writing that explores life, faith, culture, and the questions that matter.
            </p>
          </div>
          <div className="mt-8 hidden rounded-2xl border border-white/10 bg-blue-900/50 p-4 text-sm text-zinc-300 sm:block">
            New here? Create an account to begin publishing.
          </div>
        </div>

        <div className="flex-1 p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Log in</h2>
            <p className="mt-2 text-sm text-zinc-600">Use your email and password to continue.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none"
              />
            </div>

            {statusMessage ? (
              <p className="text-sm text-red-600" aria-live="polite">{statusMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-blue-950 px-5 py-3 font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-zinc-950">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
