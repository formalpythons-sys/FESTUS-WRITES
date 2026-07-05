import Link from "next/link";
import { formatArticleDate } from "@/app/lib/articles";
import type { ArticleListItem } from "@/app/lib/articles";

type ArticleCardProps = {
  article: ArticleListItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const date = formatArticleDate(article.created_at);

  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {article.cover_image ? (
        <img
          src={article.cover_image}
          alt=""
          className="mb-4 h-36 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="mb-4 h-36 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
      )}
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">{article.category}</p>
      <h3 className="mt-3 text-xl font-semibold text-zinc-950">{article.title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{article.excerpt}</p>
      <div className="mt-6 text-sm text-zinc-500">{date}</div>
      <Link href={`/article/${article.slug}`} className="mt-6 inline-flex text-sm font-semibold text-zinc-950 transition group-hover:translate-x-1">
        Read article
      </Link>
    </article>
  );
}
