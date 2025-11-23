export interface StoryPage {
  id: number;
  text: string;
  imagePrompt: string;
  imageData?: string; // Base64 image string
  audioBuffer?: AudioBuffer; // Decoded audio
}

export interface StoryData {
  title: string;
  language: string;
  pages: StoryPage[];
}

export enum AppState {
  IDLE,
  GENERATING_TEXT,
  PREVIEW,
  GENERATING_MEDIA,
  READING,
  ERROR
}

export interface GenerationProgress {
  current: number;
  total: number;
  message: string;
}