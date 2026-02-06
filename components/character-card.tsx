"use client";

import type { Character } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CharacterCardProps {
  character: Character;
  isAdmin?: boolean; // nuova prop: se true abilita il drag delle immagini
}

export function CharacterCard({ character, isAdmin = false }: CharacterCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // offset dell'immagine (in px)
  const [offset, setOffset] = useState({ x: 0, y: 500 });

  // riferimenti per il drag
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  // stato per evitare chiamate multiple in contemporanea
  const savingRef = useRef(false);

  useEffect(() => {
    // inizializza offset da character se presente (nomi adattare a DB)
    setOffset({
      x: (character.image_offset_x as number) || 0,
      y: (character.image_offset_y as number) || 0,
    });
  }, [character]);

  // Funzione che persiste l'offset sul server
  const saveOffset = async (newOffset: { x: number; y: number }) => {
    if (!isAdmin) return;
    if (!character?.id) return;
    if (savingRef.current) return;
    savingRef.current = true;

    try {
      await fetch(`/api/characters/${character.id}/offset`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: newOffset.x, y: newOffset.y }),
      });
      // opzionale: mostrare notifica di salvataggio avvenuto
    } catch (err) {
      // opzionale: gestione errori (toast)
      console.error("Errore salvataggio offset immagine:", err);
    } finally {
      savingRef.current = false;
    }
  };

  // Handlers mouse
  const onImageMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.stopPropagation(); // non aprire il dialog quando si inizia a trascinare
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
  };

  const onWindowMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startRef.current = { x: e.clientX, y: e.clientY };
  };

  const onWindowMouseUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    window.removeEventListener("mousemove", onWindowMouseMove);
    window.removeEventListener("mouseup", onWindowMouseUp);

    // persisti l'offset
    saveOffset(offset);
  };

  // Handlers touch (mobile)
  const onImageTouchStart = (e: React.TouchEvent) => {
    if (!isAdmin) return;
    e.stopPropagation();
    const t = e.touches[0];
    draggingRef.current = true;
    startRef.current = { x: t.clientX, y: t.clientY };
  };

  const onImageTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - startRef.current.x;
    const dy = t.clientY - startRef.current.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startRef.current = { x: t.clientX, y: t.clientY };
  };

  const onImageTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    // persistere l'offset
    saveOffset(offset);
  };

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
          background:
            "linear-gradient(to bottom, rgba(255,255,200,0.7), rgba(255,255,180,0.5))",
          transform: "rotate(-2deg)",
        }}
      />

      {/* Image */}
      {character.image_url && (
        <div
          className="relative w-full h-32 mb-3 overflow-hidden rounded-sm"
          // se admin, mostra cursore di movimento
          style={{ cursor: isAdmin ? "move" : undefined }}
        >
          <Image
            src={character.image_url || "/placeholder.svg"}
            alt={character.name}
            fill
            className={`object-cover grayscale group-hover:grayscale-0 transition-all duration-500`}
            sizes="(max-width: 768px) 100vw, 256px"
            onMouseDown={onImageMouseDown}
            onTouchStart={onImageTouchStart}
            onTouchMove={onImageTouchMove}
            onTouchEnd={onImageTouchEnd}
            // applichiamo la trasformazione direttamente all'immagine per spostarla
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transition: draggingRef.current ? "none" : "transform 120ms ease-out",
            }}
          />
        </div>
      )}

      {/* Name */}
      <h3 className="font-serif text-lg font-bold mb-2" style={{ color: "#2c2c2c" }}>
        {character.name}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed line-clamp-4" style={{ color: "#4a4a4a" }}>
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
              background:
                "linear-gradient(to bottom, rgba(255,255,200,0.8), rgba(255,255,180,0.6))",
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

            {/* Image (nel dialog permettiamo la stessa modifica se admin) */}
            {character.image_url && (
              <div
                className="relative w-full h-48 mb-4 overflow-hidden rounded-sm mx-auto max-w-xs"
                style={{ cursor: isAdmin ? "move" : undefined }}
              >
                <Image
                  src={character.image_url || "/placeholder.svg"}
                  alt={character.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                  onMouseDown={onImageMouseDown}
                  onTouchStart={onImageTouchStart}
                  onTouchMove={onImageTouchMove}
                  onTouchEnd={onImageTouchEnd}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transition: draggingRef.current ? "none" : "transform 120ms ease-out",
                  }}
                />
              </div>
            )}

            {/* Full Description */}
            <p className="text-base leading-relaxed mb-6" style={{ color: "#4a4a4a" }}>
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
                  <a href={character.external_link} target="_blank" rel="noopener noreferrer">
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
