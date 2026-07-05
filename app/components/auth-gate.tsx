"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, getProfileRole } from "@/app/lib/auth";

type AuthGateProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export function AuthGate({ children, requireAdmin = false }: AuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;
  const signupNext = requireAdmin ? "/" : pathname;
  const signupHref = `/signup?next=${encodeURIComponent(signupNext)}`;

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const { user } = await getCurrentUser();
      if (!active) return;

      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (!requireAdmin) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      const role = await getProfileRole(user.id);
      if (!active) return;

      if (role !== "admin") {
        setAuthorized(false);
        setLoading(false);
        router.replace("/");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [requireAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-600">
        Checking access...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900">
        <div className="w-full max-w-md rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Access required</p>
          <h2 className="mt-4 text-2xl font-semibold">You need an account to continue.</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            {requireAdmin
              ? "Only users with an admin role in the profiles table can access this page."
              : "Please sign in or create an account to leave comments."}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={loginHref} className="rounded-full bg-blue-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-900">
              Log in
            </Link>
            <Link href={signupHref} className="rounded-full border border-blue-950/20 px-5 py-3 text-sm font-medium text-blue-950 transition hover:border-blue-950 hover:bg-blue-50">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
