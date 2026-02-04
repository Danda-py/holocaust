import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/hero-section";
import { HistorySection } from "@/components/history-section";
import { CharactersWall } from "@/components/characters-wall";
import { Footer } from "@/components/footer";
import type { HistoryContent, Character } from "@/lib/types";

export const revalidate = 60; // Revalidate every 60 seconds

async function getHistoryContent(): Promise<HistoryContent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("history_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[v0] Error fetching history:", error.message);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
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

export default async function HomePage() {
  const [history, characters] = await Promise.all([
    getHistoryContent(),
    getCharacters(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <HistorySection history={history} />
      <CharactersWall characters={characters} />
      <Footer />
    </main>
  );
}
