"use client";

import { useState } from "react";
import type { HistoryContent, HighlightedWord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateHistoryContent } from "@/app/admin/actions";
import { Plus, Trash2, Save } from "lucide-react";

interface HistoryEditorProps {
  initialHistory: HistoryContent | null;
}

export function HistoryEditor({ initialHistory }: HistoryEditorProps) {
  const [content, setContent] = useState(initialHistory?.content || "");
  const [highlights, setHighlights] = useState<HighlightedWord[]>(
    initialHistory?.highlighted_words || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const addHighlight = () => {
    setHighlights([
      ...highlights,
      { word: "", color: "#8B0000", rotation: 0 },
    ]);
  };

  const updateHighlight = (
    index: number,
    field: keyof HighlightedWord,
    value: string | number
  ) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value };
    setHighlights(updated);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    const result = await updateHistoryContent(
      content,
      highlights.filter((h) => h.word.trim() !== "")
    );

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "History content saved successfully!" });
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>History Content</CardTitle>
          <CardDescription>
            Edit the main history text that appears on the memorial page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the history content..."
              className="min-h-[300px] font-sans"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highlighted Words</CardTitle>
          <CardDescription>
            Add words that should be styled differently in the text. These will
            appear in color and italic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-4 p-4 border border-border rounded-lg bg-secondary/20"
            >
              <div className="flex-1 min-w-[150px] space-y-2">
                <Label htmlFor={`word-${index}`}>Word/Phrase</Label>
                <Input
                  id={`word-${index}`}
                  value={highlight.word}
                  onChange={(e) => updateHighlight(index, "word", e.target.value)}
                  placeholder="Enter word..."
                />
              </div>
              <div className="w-32 space-y-2">
                <Label htmlFor={`color-${index}`}>Color</Label>
                <div className="flex gap-2">
                  <Input
                    id={`color-${index}`}
                    type="color"
                    value={highlight.color}
                    onChange={(e) => updateHighlight(index, "color", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={highlight.color}
                    onChange={(e) => updateHighlight(index, "color", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="w-24 space-y-2">
                <Label htmlFor={`rotation-${index}`}>Rotation</Label>
                <Input
                  id={`rotation-${index}`}
                  type="number"
                  min="-10"
                  max="10"
                  value={highlight.rotation}
                  onChange={(e) =>
                    updateHighlight(index, "rotation", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeHighlight(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addHighlight} className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Add Highlighted Word
          </Button>
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

      <Button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? "Saving..." : "Save History Content"}
      </Button>
    </div>
  );
}
