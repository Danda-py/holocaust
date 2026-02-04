"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { HighlightedWord } from "@/lib/types";

export async function updateHistoryContent(
  content: string,
  highlightedWords: HighlightedWord[]
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if there's existing content
  const { data: existing } = await supabase
    .from("history_content")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("history_content")
      .update({
        content,
        highlighted_words: highlightedWords,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    // Insert new
    const { error } = await supabase.from("history_content").insert({
      content,
      highlighted_words: highlightedWords,
    });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
  return { success: true };
}

export async function createCharacter(data: {
  name: string;
  description: string;
  image_url?: string;
  external_link?: string;
  rotation?: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("characters").insert({
    name: data.name,
    description: data.description,
    image_url: data.image_url || null,
    external_link: data.external_link || null,
    rotation: data.rotation || Math.floor(Math.random() * 7) - 3,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
  return { success: true };
}

export async function updateCharacter(
  id: string,
  data: {
    name: string;
    description: string;
    image_url?: string;
    external_link?: string;
    rotation?: number;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("characters")
    .update({
      name: data.name,
      description: data.description,
      image_url: data.image_url || null,
      external_link: data.external_link || null,
      rotation: data.rotation,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
  return { success: true };
}

export async function deleteCharacter(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("characters").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
  return { success: true };
}

export async function updateCharacterPosition(
  id: string,
  position_x: number,
  position_y: number
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("characters")
    .update({
      position_x,
      position_y,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "page");
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
