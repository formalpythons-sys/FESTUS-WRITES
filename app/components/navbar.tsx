"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, getProfileRole } from "@/app/lib/auth";

const navItems = [
  { href: "/politics", label: "Politics" },
  { href: "/relationships", label: "Relationships" },
  { href: "/theology", label: "Theology" },
  { href: "/sexuality", label: "Sexuality" },
  { href: "/parenting", label: "Parenting" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      const { user } = await getCurrentUser();

      if (!active || !user) {
        return;
      }

      const role = await getProfileRole(user.id);

      if (!active) {
        return;
      }

      setIsAdmin(role === "admin");
    }

    loadRole();

    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-950/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3 text-zinc-950">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-950 text-sm font-bold tracking-wide text-white shadow-sm transition group-hover:bg-blue-900">
            FS
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-wide">Frank</span>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-950">SURVEILLANTS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-blue-950">
              {item.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin" className="rounded-full border border-blue-950/20 px-3 py-1.5 text-blue-950 transition hover:border-blue-950 hover:bg-blue-950 hover:text-white">
              Admin
            </Link>
          ) : null}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-950/15 text-blue-950 transition hover:border-blue-950 hover:bg-blue-950 hover:text-white md:hidden"
        >
          <span className="text-xl leading-none">=</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-blue-950/10 bg-white px-4 py-4 shadow-sm md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-blue-50 hover:text-blue-950"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-medium text-blue-950 transition hover:bg-blue-50"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
