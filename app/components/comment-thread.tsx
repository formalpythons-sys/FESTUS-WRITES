"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import { supabase } from "@/app/lib/supabase";

type Comment = {
  author: string;
  body: string;
};

type CommentThreadProps = {
  articleId: string | number;
  initialComments?: Comment[];
};

export function CommentThread({ articleId, initialComments = [] }: CommentThreadProps) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState(initialComments);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { user } = await getCurrentUser();
      if (!active) return;

      setUser(user);
      setLoading(false);
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    const trimmedComment = commentBody.trim();

    if (!user) {
      setStatusMessage("Please log in to post a comment.");
      return;
    }

    if (!trimmedComment) {
      setStatusMessage("Please write a comment before posting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        user_id: user.id,
        comment: trimmedComment,
      });

      if (error) {
        console.error("Failed to post comment", error);
        setStatusMessage("Could not post your comment. Please try again.");
        return;
      }

      setComments((currentComments) => [
        ...currentComments,
        {
          author: "You",
          body: trimmedComment,
        },
      ]);
      setCommentBody("");
      setStatusMessage("Comment posted.");
    } catch (error) {
      console.error("Failed to post comment", error);
      setStatusMessage("Could not post your comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={`${comment.author}-${comment.body}`} className="rounded-2xl border border-zinc-200 p-4">
              <p className="font-medium text-zinc-950">{comment.author}</p>
              <p className="mt-2 text-sm text-zinc-600">{comment.body}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-600">
            No comments yet. Be the first to join the conversation.
          </div>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          Checking your session...
        </div>
      ) : user ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-950">Leave a comment</p>
          <p className="mt-1 text-sm text-zinc-600">You&apos;re signed in and ready to contribute.</p>
          <textarea
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            placeholder="Share your thoughts..."
            className="mt-4 min-h-24 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700"
          />
          {statusMessage ? (
            <p className="mt-3 text-sm text-zinc-600" aria-live="polite">{statusMessage}</p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 rounded-full bg-blue-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-950">Join the conversation</p>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Comments are available to signed-in readers only. Log in or create an account to leave a reply.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-blue-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-900">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full border border-blue-950/20 px-4 py-2 text-sm font-medium text-blue-950 transition hover:border-blue-950 hover:bg-blue-50">
              Create account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
