"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { upsertProfile } from "@/app/lib/auth";
import { supabase } from "@/app/lib/supabase";

function getSafeNextPath(fallback = "/") {
  if (typeof window === "undefined") return fallback;

  const next = new URLSearchParams(window.location.search).get("next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next.startsWith("/admin") ? "/" : next;
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const formatSupabaseError = (error: {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
  }) => {
    const parts = [
      error.code ? `Code: ${error.code}` : null,
      error.message,
      error.details ? `Details: ${error.details}` : null,
      error.hint ? `Hint: ${error.hint}` : null,
    ].filter(Boolean);

    return parts.join(" | ");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setStatusMessage("Please fill in your full name, email, and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      if (!data.user) {
        setStatusMessage("Account created, but no user was returned by Supabase.");
        return;
      }

      const { error: profileError } = await upsertProfile({
        id: data.user.id,
        email: data.user.email ?? trimmedEmail,
        fullName: trimmedName,
      });

      if (profileError) {
        const formattedError = formatSupabaseError(profileError);

        console.error("Profile insert failed", {
          error: profileError,
          attemptedProfile: {
            id: data.user.id,
            email: data.user.email ?? trimmedEmail,
            full_name: trimmedName,
          },
        });

        setStatusMessage(`Account created, but the profile row could not be saved. ${formattedError}`);
        return;
      }

      if (!data.session) {
        setStatusMessage("Account created. Please check your email to confirm your account before logging in.");
        return;
      }

      router.push(getSafeNextPath("/"));
      router.refresh();
    } catch (error) {
      console.error("Signup failed", error);
      setStatusMessage("Could not create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-blue-950 p-8 text-white sm:p-10 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">Join the team</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Create your account to publish.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-zinc-400">
              Start shaping the editorial voice of Festus Writes with a clean, secure publishing setup.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-blue-900/50 p-4 text-sm text-zinc-300">
            Already have an account? Sign in to continue managing your work.
          </div>
        </div>

        <div className="flex-1 p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <p className="mt-2 text-sm text-zinc-600">Set up your editorial account in a minute.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700" htmlFor="full-name">Full name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none"
              />
            </div>

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
                placeholder="Create a strong password"
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
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-zinc-950">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
