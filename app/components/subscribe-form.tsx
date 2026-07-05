"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("subscribers")
      .insert([
        {
          email: email.toLowerCase().trim(),
        },
      ]);

    if (error) {
      if (
        error.message.toLowerCase().includes("duplicate") ||
        error.message.toLowerCase().includes("unique")
      ) {
        setMessage("You're already subscribed.");
      } else {
        setMessage("Subscription failed. Please try again.");
      }
    } else {
      setMessage("Successfully subscribed.");
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-2xl border border-zinc-300 px-5 py-4 outline-none"
        />

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="rounded-2xl bg-blue-950 px-8 py-4 text-white transition hover:bg-blue-900 disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm text-zinc-600">
          {message}
        </p>
      )}
    </div>
  );
}