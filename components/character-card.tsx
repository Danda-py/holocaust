"use client";

import type { Character } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cardContent = (
    <div
      className="group relative w-64 min-h-[320px] p-4 rounded-sm transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
      style={{
        backgroundColor: "var(--post-it-cream)",
        transform: `rotate(${character.rotation}deg)`,
        boxShadow: "4px 4px 12px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.2)",
      }}
      onClick={() => setIsOpen(true)}
    >
      {/* Tape effect at top */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 opacity-60"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,200,0.7), rgba(255,255,180,0.5))",
          transform: "rotate(-2deg)",
        }}
      />

      {/* Image */}
      {character.image_url && (
        <div className="relative w-full h-32 mb-3 overflow-hidden rounded-sm">
          <Image
            src={character.image_url || "/placeholder.svg"}
            alt={character.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        </div>
      )}

      {/* Name */}
      <h3
        className="font-serif text-lg font-bold mb-2"
        style={{ color: "#2c2c2c" }}
      >
        {character.name}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed line-clamp-4"
        style={{ color: "#4a4a4a" }}
      >
        {character.description}
      </p>

      {/* External link indicator */}
      {character.external_link && (
        <div className="absolute bottom-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4" style={{ color: "#666" }} />
        </div>
      )}
    </div>
  );

  return (
    <>
      {cardContent}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-lg p-0 overflow-hidden border-0"
          style={{
            backgroundColor: "var(--post-it-cream)",
            boxShadow: "8px 8px 24px rgba(0,0,0,0.4), 0 0 2px rgba(0,0,0,0.2)",
          }}
        >
          {/* Tape effect at top */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 opacity-60 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,200,0.8), rgba(255,255,180,0.6))",
              transform: "rotate(-1deg)",
            }}
          />

          <div className="p-6 pt-8">
            <DialogHeader className="mb-4">
              <DialogTitle
                className="font-serif text-2xl font-bold text-center"
                style={{ color: "#2c2c2c" }}
              >
                {character.name}
              </DialogTitle>
            </DialogHeader>

            {/* Image */}
            {character.image_url && (
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-sm mx-auto max-w-xs">
                <Image
                  src={character.image_url || "/placeholder.svg"}
                  alt={character.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            )}

            {/* Full Description */}
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "#4a4a4a" }}
            >
              {character.description}
            </p>

            {/* External link button */}
            {character.external_link && (
              <div className="flex justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 bg-transparent"
                  style={{
                    borderColor: "#8B7355",
                    color: "#5C4033",
                  }}
                >
                  <a
                    href={character.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
