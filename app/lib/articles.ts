import { supabase } from "@/app/lib/supabase";

export type Article = {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  views: number | null;
  published: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  has_video: boolean | null;
  youtube_url: string | null;
};

export type ArticleListItem = Pick<
  Article,
  | "id"
  | "title"
  | "slug"
  | "category"
  | "excerpt"
  | "cover_image"
  | "views"
  | "published"
  | "created_at"
>;

const articleSelect = `
  id,
  title,
  slug,
  category,
  excerpt,
  content,
  cover_image,
  views,
  published,
  created_at,
  updated_at,
  has_video,
  youtube_url
`;

const listSelect = `
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

export function formatArticleDate(value: string | null) {
  if (!value) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function splitArticleContent(content: string | null) {
  return (content ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function getPublishedArticles(limit?: number) {
  let query = supabase
    .from("articles")
    .select(listSelect)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load published articles", error);
    return [];
  }

  return (data ?? []) as ArticleListItem[];
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("slug", slug)
    .single();

  if (error) {
    console.log("SUPABASE ERROR:", JSON.stringify(error, null, 2));
    return null;
  }

  return data as Article;
}

export async function getArticlesByCategory(category: string, search?: string) {
  let query = supabase
    .from("articles")
    .select(listSelect)
    .eq("category", category)
    .order("created_at", { ascending: false });

  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    const safeSearch = trimmedSearch.replace(/[%_]/g, "\\$&");
    query = query.or(`title.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load category articles", error);
    return [];
  }

  return (data ?? []) as ArticleListItem[];
}

export function getYouTubeEmbedUrl(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/")[2] ?? "";
      } else {
        videoId = parsedUrl.searchParams.get("v") ?? "";
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  } catch {
    return null;
  }
}
