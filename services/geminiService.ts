import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StoryData } from "../types";
import { decodeBase64, decodeAudioData } from "./audioUtils";

// NOTE: process.env.API_KEY is injected by the runtime environment.
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// 1. Generate the Text content of the story
export const generateStoryText = async (topic: string, language: string): Promise<StoryData> => {
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Write a short children's story about: ${topic}. 
    The story MUST be written in the following language: ${language}.
    The story should be exactly 4 pages long. 
    Each page should have 2-3 simple sentences suitable for young children.
    Also provide a specific, descriptive image prompt for an illustration for each page.
    The image prompt should be detailed, describing style (e.g., "storybook watercolor style"), characters, and setting.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The title of the story" },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING, description: "The story text for this page" },
                imagePrompt: { type: Type.STRING, description: "Prompt for the AI image generator" }
              },
              required: ["id", "text", "imagePrompt"]
            }
          }
        },
        required: ["title", "pages"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No text returned from story generation");
  
  const parsed = JSON.parse(text);
  return { ...parsed, language } as StoryData;
};

// 2. Generate an Illustration
export const generateIllustration = async (prompt: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";
  
  // We want a square image for the book
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
       // Note: aspectRatio and imageSize are typically for the Pro model or Imagen.
       // For 2.5-flash-image, we control basic output.
    }
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image");
};

// 3. Generate Speech (TTS)
export const generateSpeech = async (text: string, audioContext: AudioContext): Promise<AudioBuffer> => {
  const model = "gemini-2.5-flash-preview-tts";

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Puck" } 
        }
      }
    }
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data returned");
  }

  const audioBytes = decodeBase64(base64Audio);
  return await decodeAudioData(audioBytes, audioContext);
};