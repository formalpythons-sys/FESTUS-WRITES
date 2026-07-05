import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-blue-900 bg-blue-950 text-zinc-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em]">Festus Writes</p>
          <p className="mt-2 max-w-md text-sm text-zinc-400">Ideas worth wrestling with, delivered with rigor and grace.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <Link href="/politics" className="transition hover:text-white">Politics</Link>
          <Link href="/relationships" className="transition hover:text-white">Relationships</Link>
          <Link href="/theology" className="transition hover:text-white">Theology</Link>
          <Link href="/sexuality" className="transition hover:text-white">Sexuality</Link>
          <Link href="/parenting" className="transition hover:text-white">Parenting</Link>
        </div>
      </div>
    </footer>
  );
}
