import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { ArticleCard } from "@/app/components/article-card";
import { CommentThread } from "@/app/components/comment-thread";
import { supabase } from "@/app/lib/supabase";
import { formatArticleDate, getYouTubeEmbedUrl, splitArticleContent } from "@/app/lib/articles";
import type { ArticleListItem } from "@/app/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type Article = {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  content: string | null;
  cover_image: string | null;
  views: number | null;
  created_at: string | null;
  has_video: boolean | null;
  youtube_url: string | null;
};

type CommentRow = {
  id?: string | number;
  comment?: string | null;
  created_at?: string | null;
};

const articleSelect = `
  id,
  title,
  slug,
  category,
  content,
  cover_image,
  views,
  created_at,
  has_video,
  youtube_url
`;

const relatedArticleSelect = `
  id,
  title,
  slug,
  category,
  excerpt,
  cover_image,
  views,
  published,
  created_at
`;

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Failed to load article", error);
    return null;
  }

  return data as Article;
}

async function getRelatedArticles(article: Article) {
  const { data, error } = await supabase
    .from("articles")
    .select(relatedArticleSelect)
    .eq("category", article.category)
    .neq("slug", article.slug)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to load related articles", error);
    return [];
  }

  return (data ?? []) as ArticleListItem[];
}

async function getComments(articleId: Article["id"]) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load comments", error);
    return [];
  }

  return ((data ?? []) as CommentRow[])
    .map((comment) => ({
      author: "Reader",
      body: comment.comment ?? "",
    }))
    .filter((comment) => comment.body.trim().length > 0);
}

async function incrementArticleViews(article: Article) {
  const nextViews = (article.views ?? 0) + 1;
  const { error } = await supabase
    .from("articles")
    .update({ views: nextViews })
    .eq("id", article.id);

  if (error) {
    console.error("Failed to increment article views", error);
    return article.views ?? 0;
  }

  return nextViews;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles, comments, views] = await Promise.all([
    getRelatedArticles(article),
    getComments(article.id),
    incrementArticleViews(article),
  ]);
  const articleDate = formatArticleDate(article.created_at);
  const paragraphs = splitArticleContent(article.content);
  const youtubeEmbedUrl =
    article.has_video && article.youtube_url?.trim()
      ? getYouTubeEmbedUrl(article.youtube_url)
      : null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt=""
              className="h-72 w-full object-cover"
            />
          ) : (
            <div className="h-72 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300" />
          )}

          <div className="p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">{article.category}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">{article.title}</h1>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-600">
              <span>{articleDate}</span>
              <span>&bull;</span>
              <span>{views.toLocaleString()} views</span>
            </div>

            {youtubeEmbedUrl ? (
              <div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-zinc-950">
                <iframe
                  src={youtubeEmbedUrl}
                  title={article.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : null}

            <div className="mt-10 space-y-5 text-lg leading-8 text-zinc-700">
              {paragraphs.map((paragraph, index) => (
                <p key={`${article.slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-950">Related articles</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((item) => (
                  <ArticleCard key={item.slug} article={item} />
                ))
              ) : (
                <p className="text-sm leading-7 text-zinc-600">No related articles yet.</p>
              )}
            </div>
          </div>
          <aside className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-950">Comments</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">Reading stays open to everyone, but posting a comment requires an account.</p>
            <div className="mt-6">
              <CommentThread articleId={article.id} initialComments={comments} />
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
