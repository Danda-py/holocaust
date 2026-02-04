import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { HistoryContent, Character } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getHistoryContent(): Promise<HistoryContent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("history_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.log("[v0] Error fetching history:", error.message);
    return null;
  }

  return data;
}

async function getCharacters(): Promise<Character[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.log("[v0] Error fetching characters:", error.message);
    return [];
  }

  return data || [];
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [history, characters] = await Promise.all([
    getHistoryContent(),
    getCharacters(),
  ]);

  return (
    <AdminDashboard
      user={user}
      initialHistory={history}
      initialCharacters={characters}
    />
  );
}
