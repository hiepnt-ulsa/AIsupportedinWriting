import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewColor: string;
}

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: "corporate-grey",
    name: "Corporate Grey",
    description: "Professional studio look with a neutral grey backdrop.",
    prompt: "professional corporate headshot, neutral grey studio background, high-end business attire, soft studio lighting, sharp focus, high resolution",
    previewColor: "bg-slate-400"
  },
  {
    id: "modern-tech",
    name: "Modern Tech Office",
    description: "Clean, bright office environment with soft bokeh.",
    prompt: "professional tech professional headshot, modern bright office background with soft bokeh, smart casual attire, natural window lighting, clean aesthetic, high resolution",
    previewColor: "bg-blue-100"
  },
  {
    id: "outdoor-natural",
    name: "Outdoor Natural",
    description: "Warm, natural light with a blurred greenery background.",
    prompt: "professional outdoor headshot, blurred park greenery background, warm natural sunlight, approachable smile, casual professional attire, high resolution",
    previewColor: "bg-emerald-100"
  },
  {
    id: "executive-dark",
    name: "Executive Dark",
    description: "Sophisticated dark wood or library setting.",
    prompt: "executive professional headshot, dark wood library background, dramatic professional lighting, formal business attire, authoritative yet approachable, high resolution",
    previewColor: "bg-stone-800"
  }
];

export async function generateHeadshot(imageBuffer: string, stylePrompt: string) {
  const model = "gemini-2.5-flash-image";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBuffer.split(',')[1],
            mimeType: "image/png",
          },
        },
        {
          text: `Transform this person into a professional headshot. Maintain their facial features and identity accurately. Apply this style: ${stylePrompt}. The result should be a single, high-quality professional headshot.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated");
}

export async function editHeadshot(imageBuffer: string, editPrompt: string) {
  const model = "gemini-2.5-flash-image";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBuffer.split(',')[1],
            mimeType: "image/png",
          },
        },
        {
          text: `Edit this professional headshot based on this instruction: ${editPrompt}. Keep the person's identity consistent.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated");
}
