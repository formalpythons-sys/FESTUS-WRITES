import { supabase } from "@/app/lib/supabase";

type ProfileInput = {
  id: string;
  email?: string | null;
  fullName?: string;
};

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function upsertProfile({ id, email, fullName }: ProfileInput) {
  return supabase.from("profiles").upsert(
    {
      id,
      email,
      full_name: fullName?.trim() || null,
    },
    { onConflict: "id" }
  );
}

export async function getProfileRole(userId: string | undefined) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data?.role ?? null;
}
