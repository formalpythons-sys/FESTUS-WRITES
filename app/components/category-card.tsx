import Link from "next/link";
import type { Category } from "@/app/lib/categories";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/${category.slug}`}
      className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-6 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-300" />
      <h3 className="text-xl font-semibold text-zinc-950">{category.title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{category.description}</p>
      <p className="mt-6 text-sm font-semibold text-zinc-950">Explore</p>
    </Link>
  );
}
