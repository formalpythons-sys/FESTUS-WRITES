"use client";

import { useState } from "react";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { AuthGate } from "@/app/components/auth-gate";
import { supabase } from "@/app/lib/supabase";

const ARTICLE_IMAGE_BUCKET = "Articles";
const ARTICLE_IMAGE_FOLDER = "Article Image";

type AdminArticleRow = {
  title: string;
  category: string;
  status?: string;
  views?: number | null;
  date?: string | null;
};

type SubscriberRow = {
  email: string;
  joined?: string | null;
};

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function AdminPageContent() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [articles, setArticles] = useState<AdminArticleRow[]>([]);
const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);

const [stats, setStats] = useState({
  totalArticles: 0,
  totalViews: 0,
  totalComments: 0,
  totalSubscribers: 0,
});

  const makeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(makeSlug(value));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverImageFile(null);
      setPreview(null);
      return;
    }

    setCoverImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      let coverImageUrl = "";

      if (coverImageFile) {
        const safeName = `${Date.now()}-${coverImageFile.name.replace(/\s+/g, "-").toLowerCase()}`;
        const imagePath = `${ARTICLE_IMAGE_FOLDER}/${safeName}`;
        const { data, error } = await supabase.storage
          .from(ARTICLE_IMAGE_BUCKET)
          .upload(imagePath, coverImageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Image upload failed", getErrorMessage(error), error);
          setStatusMessage("Article saved without a cover image because the upload failed.");
        } else {
          const { data: publicUrlData } = supabase.storage
            .from(ARTICLE_IMAGE_BUCKET)
            .getPublicUrl(data?.path ?? imagePath);
          coverImageUrl = publicUrlData.publicUrl;
        }
      }

    const { error } = await supabase.from("articles").insert({
  title,
  slug: slug || makeSlug(title),
  category,

  excerpt: summary,

  content,
  cover_image: coverImageUrl,
  published,
  views: 0,

  has_video: hasVideo,
  youtube_url: hasVideo ? youtubeUrl : null,

  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
      if (error) {
        console.error("Article insert failed", getErrorMessage(error), error);
        throw error;
      }

      setStatusMessage("Article created successfully.");
      setTitle("");
      setSlug("");
      setCategory("");
      setSummary("");
      setContent("");
      setPublished(false);
setHasVideo(false);
setYoutubeUrl("");
setCoverImageFile(null);
setPreview(null);
    } catch (error) {
      console.error("Failed to save article", getErrorMessage(error), error);
      setStatusMessage(`Could not save the article: ${getErrorMessage(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Admin Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
             Frank Surveillants
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-600">
            Manage articles, monitor engagement, and grow your audience from
            one calm editorial workspace.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
         {[
  {
    label: "Total Articles",
    value: stats.totalArticles,
  },
  {
    label: "Total Views",
    value: stats.totalViews,
  },
  {
    label: "Total Comments",
    value: stats.totalComments,
  },
  {
    label: "Total Subscribers",
    value: stats.totalSubscribers,
  },
].map((card) => (
  <div
    key={card.label}
    className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm"
  >
    <p className="text-sm text-zinc-500">{card.label}</p>

    <p className="mt-3 text-3xl font-bold text-zinc-950">
      {card.value}
    </p>
  </div>
))}
        </section>

        {/* Create Article */}
        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-950">
              Create New Article
            </h2>

            <p className="mt-2 text-zinc-600">
              Draft and publish content for your readers.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Article Title"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
            />

            <input
              type="text"
              value={slug}
              readOnly
              placeholder="Slug will be generated automatically"
              className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
            >
              <option value="">Select Category</option>
              <option value="Politics">Politics</option>
              <option value="Relationships">Relationships</option>
              <option value="Theology">Theology</option>
              <option value="Sexuality">Sexuality</option>
              <option value="Parenting">Parenting</option>
            </select>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                Cover Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-2xl border border-zinc-300 px-4 py-3 file:mr-4 file:rounded-full file:border-0 file:bg-blue-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />

              {preview ? (
                <div className="overflow-hidden rounded-2xl border border-zinc-200">
                  <img
                    src={preview}
                    alt="Cover preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
                  Upload an image to preview it here
                </div>
              )}
            </div>

            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Article Summary"
              className="min-h-[120px] w-full rounded-2xl border border-zinc-300 px-4 py-3"
            />

            <div className="space-y-3 rounded-2xl border border-zinc-200 p-4">
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={hasVideo}
      onChange={(event) => setHasVideo(event.target.checked)}
      className="h-4 w-4"
    />
    <span className="text-sm font-medium text-zinc-700">
      Include YouTube Video
    </span>
  </label>

  {hasVideo && (
    <input
      type="text"
      value={youtubeUrl}
      onChange={(event) => setYoutubeUrl(event.target.value)}
      placeholder="https://youtube.com/watch?v=..."
      className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
    />
  )}
</div>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write your article here..."
              className="min-h-[450px] w-full rounded-2xl border border-zinc-300 px-4 py-3"
            />

            <label className="flex items-center gap-3 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="h-4 w-4"
              />
              Publish immediately
            </label>

            {statusMessage ? (
              <p className="text-sm text-zinc-600">{statusMessage}</p>
            ) : null}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-blue-950 px-6 py-3 font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Publish Article"}
              </button>
            </div>
          </form>
        </section>

        {/* Article Management */}
        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-950">
              Article Management
            </h2>

            <button className="rounded-full border border-zinc-300 px-4 py-2 text-sm">
              Refresh
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Views</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.title}
                    className="border-t border-zinc-200"
                  >
                    <td className="px-4 py-4">{article.title}</td>
                    <td className="px-4 py-4">{article.category}</td>
                    <td className="px-4 py-4">{article.status}</td>
                    <td className="px-4 py-4">{article.views}</td>
                    <td className="px-4 py-4">{article.date}</td>

                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <button className="text-zinc-700 hover:text-black">
                          Edit
                        </button>

                        <button className="text-red-600 hover:text-red-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Subscribers */}
        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-950">
              Subscribers
            </h2>

            <button className="rounded-full border border-zinc-300 px-4 py-2 text-sm">
              Export CSV
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                </tr>
              </thead>

              <tbody>
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.email}
                    className="border-t border-zinc-200"
                  >
                    <td className="px-4 py-4">{subscriber.email}</td>
                    <td className="px-4 py-4">{subscriber.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGate requireAdmin>
      <AdminPageContent />
    </AuthGate>
  );
}
