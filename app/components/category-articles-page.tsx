import Link from "next/link";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { ArticleCard } from "@/app/components/article-card";
import { getArticlesByCategory } from "@/app/lib/articles";
import { getCategoryBySlug } from "@/app/lib/categories";

type CategoryArticlesPageProps = {
  slug: string;
  search?: string;
};

export async function CategoryArticlesPage({ slug, search }: CategoryArticlesPageProps) {
  const category = getCategoryBySlug(slug);
  const items = category ? await getArticlesByCategory(category.title, search) : [];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:px-8">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">{category?.title}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">{category?.description}</h1>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <form className="flex-1">
              <label>
                <span className="sr-only">Search articles</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={search}
                  placeholder="Search by title or article content"
                  className="w-full rounded-full border border-zinc-300 px-4 py-3 text-sm outline-none ring-0"
                />
              </label>
            </form>
            <Link href="/" className="text-sm font-semibold text-zinc-700 transition hover:text-zinc-950">
              Back to home
            </Link>
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.length > 0 ? (
            items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600 shadow-sm md:col-span-2 xl:col-span-3">
              No articles found in this category.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
