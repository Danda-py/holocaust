"use client";

import type { Character } from "@/lib/types";
import { CharacterCard } from "./character-card";
import { DraggableCharacterCard } from "./draggable-character-card";

interface CharactersWallProps {
  characters: Character[];
  isAdmin?: boolean;
}

export function CharactersWall({ characters, isAdmin = false }: CharactersWallProps) {
  if (!characters || characters.length === 0) {
    return (
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-8 text-foreground">
            Remembering the Individuals
          </h2>
          <p className="text-muted-foreground">
            No characters have been added yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl mb-4 text-center text-foreground">
          Remembering the Individuals
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Each person represented here had a unique story, dreams, and loved ones.
          Click on a card to learn more about their life.
        </p>

        {/* Cork board effect */}
        <div
          className="relative p-8 md:p-12 rounded-lg min-h-[500px]"
          style={{
            backgroundColor: "var(--cork)",
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            boxShadow: "inset 0 2px 20px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Wooden frame effect */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 8px rgba(60,40,20,0.8), inset 0 0 0 10px rgba(80,60,40,0.6)",
            }}
          />

          {/* Cards */}
          {isAdmin ? (
            // Admin mode: draggable cards with absolute positioning
            <div className="relative min-h-[600px]">
              {characters.map((character) => (
                <DraggableCharacterCard key={character.id} character={character} />
              ))}
            </div>
          ) : (
            // Public mode: grid layout
            <div className="relative flex flex-wrap justify-center gap-8 md:gap-10">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
