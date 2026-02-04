"use client";

import type { HistoryContent } from "@/lib/types";

interface HistorySectionProps {
  history: HistoryContent | null;
}

export function HistorySection({ history }: HistorySectionProps) {
  if (!history) {
    return (
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">
            History
          </h2>
          <p className="text-muted-foreground">
            No history content available yet.
          </p>
        </div>
      </section>
    );
  }

  const renderTextWithHighlights = (
    text: string,
    highlights: { word: string; color: string; rotation: number }[]
  ) => {
    if (!highlights || highlights.length === 0) {
      return <span>{text}</span>;
    }

    // Sort highlights by length (longest first) to avoid partial matches
    const sortedHighlights = [...highlights].sort(
      (a, b) => b.word.length - a.word.length
    );

    // Create a regex pattern to match all highlighted words
    const pattern = sortedHighlights
      .map((h) => h.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const regex = new RegExp(`(${pattern})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const highlight = sortedHighlights.find(
        (h) => h.word.toLowerCase() === part.toLowerCase()
      );

      if (highlight) {
        return (
          <span
            key={index}
            className="inline-block px-1 font-semibold italic transition-transform hover:scale-105"
            style={{
              color: highlight.color,
              transform: `rotate(${highlight.rotation}deg)`,
            }}
          >
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center text-foreground">
          History
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-foreground/90 leading-relaxed text-lg md:text-xl">
            {renderTextWithHighlights(
              history.content,
              history.highlighted_words
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
