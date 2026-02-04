export interface HighlightedWord {
  word: string;
  color: string;
  rotation: number;
}

export interface HistoryContent {
  id: string;
  content: string;
  highlighted_words: HighlightedWord[];
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  external_link: string | null;
  position_x: number;
  position_y: number;
  rotation: number;
  created_at: string;
  updated_at: string;
}
