import Link from "next/link";
import SubscribeForm from "@/app/components/subscribe-form";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { getPublishedArticles } from "@/app/lib/articles";

export default async function Home() {
  const articles = await getPublishedArticles(5);
  const [heroArticle, ...latestArticles] = articles;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 sm:text-xs">
  Frank Surveillants
</span>
          <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Critical reflections on culture, politics, theology, family, and the architecture of society.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 sm:mt-8 sm:text-xl">
            A carefully curated collection of essays for curious, thoughtful readers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        {heroArticle ? (
          <article className="overflow-hidden rounded-[24px] bg-blue-950 text-white sm:rounded-[32px]">
            {heroArticle.cover_image ? (
              <img
                src={heroArticle.cover_image}
                alt=""
                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[450px]"
              />
            ) : (
              <div className="h-[280px] w-full bg-zinc-200 sm:h-[360px] lg:h-[450px]" />
            )}

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm uppercase tracking-widest text-zinc-400">{heroArticle.category}</p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">{heroArticle.title}</h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
                {heroArticle.excerpt}
              </p>
              <Link
                href={`/article/${heroArticle.slug}`}
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-zinc-100"
              >
                Read More
              </Link>
            </div>
          </article>
        ) : (
          <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-8 text-zinc-600 sm:rounded-[32px]">
            No published articles yet.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold sm:text-4xl">Latest Articles</h2>
          <span className="text-sm text-zinc-500 sm:text-base">{latestArticles.length} Articles</span>
        </div>

   <div className="grid gap-6 md:grid-cols-2 md:gap-8">
  {latestArticles.map((article) => (
    <Link
      href={`/article/${article.slug}`}
      key={article.slug}
      className="group block overflow-hidden rounded-3xl border border-zinc-200 transition-all duration-300 hover:shadow-xl"
    >
      {article.cover_image ? (
        <img
          src={article.cover_image}
          alt=""
          className="h-56 w-full object-cover"
        />
      ) : (
        <div className="h-56 w-full bg-zinc-100" />
      )}

      <div className="p-6 sm:p-8">
        <p className="text-sm text-zinc-500">{article.category}</p>

       <p className="mt-1 text-xs text-zinc-400">
  {article.created_at
    ? new Date(article.created_at).toLocaleDateString()
    : ""}
</p>
        <h3 className="mt-3 text-xl font-bold transition group-hover:translate-x-1 sm:text-2xl">
          {article.title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
          {article.excerpt}
        </p>
      </div>
    </Link>
  ))}
</div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
        <div className="rounded-[24px] bg-zinc-100 p-6 text-center sm:rounded-[32px] sm:p-8 lg:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Never miss a post</h2>
          <p className="mt-4 text-sm text-zinc-600 sm:text-base">Get new articles delivered directly to your inbox.</p>
        <SubscribeForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
