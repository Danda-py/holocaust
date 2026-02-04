"use client";

import React from "react"

import { useState } from "react";
import type { Character } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/app/admin/actions";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface CharactersManagerProps {
  initialCharacters: Character[];
}

interface CharacterFormData {
  name: string;
  description: string;
  image_url: string;
  external_link: string;
  rotation: number;
}

const emptyFormData: CharacterFormData = {
  name: "",
  description: "",
  image_url: "",
  external_link: "",
  rotation: 0,
};

export function CharactersManager({ initialCharacters }: CharactersManagerProps) {
  const [characters, setCharacters] = useState(initialCharacters);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState<CharacterFormData>(emptyFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const openCreateDialog = () => {
    setEditingCharacter(null);
    setFormData(emptyFormData);
    setIsDialogOpen(true);
  };

  const openEditDialog = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      description: character.description,
      image_url: character.image_url || "",
      external_link: character.external_link || "",
      rotation: character.rotation,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (editingCharacter) {
      const result = await updateCharacter(editingCharacter.id, formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setCharacters(
          characters.map((c) =>
            c.id === editingCharacter.id ? { ...c, ...formData } : c
          )
        );
        setMessage({ type: "success", text: "Character updated successfully!" });
        setIsDialogOpen(false);
      }
    } else {
      const result = await createCharacter(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        // Refresh page to get new character with ID
        window.location.reload();
      }
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    setIsLoading(true);
    const result = await deleteCharacter(id);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setCharacters(characters.filter((c) => c.id !== id));
      setMessage({ type: "success", text: "Character deleted successfully!" });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Characters</CardTitle>
              <CardDescription>
                Manage the individuals displayed on the memorial wall.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Character
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editingCharacter ? "Edit Character" : "Add New Character"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCharacter
                      ? "Update the character information below."
                      : "Fill in the details for the new character."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter name..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Enter description..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="external_link">External Link</Label>
                    <Input
                      id="external_link"
                      type="url"
                      value={formData.external_link}
                      onChange={(e) =>
                        setFormData({ ...formData, external_link: e.target.value })
                      }
                      placeholder="https://example.com/biography"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rotation">Card Rotation (-10 to 10)</Label>
                    <Input
                      id="rotation"
                      type="number"
                      min="-10"
                      max="10"
                      value={formData.rotation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rotation: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading
                        ? "Saving..."
                        : editingCharacter
                        ? "Update"
                        : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {characters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No characters added yet. Click "Add Character" to create one.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {characters.map((character) => (
                <Card key={character.id} className="overflow-hidden">
                  {character.image_url && (
                    <div className="relative h-32 bg-secondary">
                      <Image
                        src={character.image_url || "/placeholder.svg"}
                        alt={character.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">
                      {character.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {character.description}
                    </p>
                    {character.external_link && (
                      <a
                        href={character.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent flex items-center gap-1 mb-3 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Source
                      </a>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(character)}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(character.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
