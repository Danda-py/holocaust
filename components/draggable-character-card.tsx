"use client";

import React from "react"

import type { Character } from "@/lib/types";
import { ExternalLink, Move } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateCharacterPosition } from "@/app/admin/actions";

interface DraggableCharacterCardProps {
  character: Character;
}

export function DraggableCharacterCard({ character }: DraggableCharacterCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: character.position_x || 0,
    y: character.position_y || 0,
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on the modal or buttons
    if ((e.target as HTMLElement).closest('[data-no-drag]')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Save position to database
    await updateCharacterPosition(character.id, position.x, position.y);
  };

  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <>
      <div
        className="absolute group w-64 min-h-[320px] p-4 rounded-sm transition-all duration-300 hover:z-20 cursor-move"
        style={{
          backgroundColor: "var(--post-it-cream)",
          transform: `translate(${position.x}px, ${position.y}px) rotate(${character.rotation}deg)`,
          boxShadow: isDragging 
            ? "8px 8px 24px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)"
            : "4px 4px 12px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.2)",
          transition: isDragging ? "none" : "box-shadow 0.3s",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Drag indicator */}
        <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
          <Move className="w-4 h-4" style={{ color: "#666" }} />
        </div>

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
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 pointer-events-none"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
        )}

        {/* Name */}
        <h3
          className="font-serif text-lg font-bold mb-2 pointer-events-none"
          style={{ color: "#2c2c2c" }}
        >
          {character.name}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-4 pointer-events-none"
          style={{ color: "#4a4a4a" }}
        >
          {character.description}
        </p>

        {/* View details button */}
        <button
          data-no-drag
          onClick={() => setIsOpen(true)}
          className="absolute bottom-3 left-3 text-xs px-3 py-1 rounded-sm bg-black/10 hover:bg-black/20 transition-colors"
          style={{ color: "#4a4a4a" }}
        >
          View Details
        </button>

        {/* External link indicator */}
        {character.external_link && (
          <div className="absolute bottom-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ExternalLink className="w-4 h-4" style={{ color: "#666" }} />
          </div>
        )}
      </div>

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
