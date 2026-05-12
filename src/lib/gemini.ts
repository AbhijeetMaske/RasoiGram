import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getGeminiModel = (model: string = "gemini-3-flash-preview") => {
  return ai.models.generateContent({
    model,
  });
};

export const RASOI_RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    cuisine: { type: Type.STRING },
    description: { type: Type.STRING },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    servings: { type: Type.NUMBER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          amount: { type: Type.STRING },
          isAvailable: { type: Type.BOOLEAN }
        }
      }
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING }
      }
    }
  },
  required: ["title", "ingredients", "instructions"]
};

export const generateRecipePrompt = (inventory: string[], preferences: any) => {
  return `As an expert Indian chef at RasoiGram, generate a creative and healthy recipe using these ingredients: ${inventory.join(", ")}.
  Preferences: ${JSON.stringify(preferences)}.
  Focus on authentic Indian flavors.
  If some essential ingredients are missing, suggest them but tag them as not available.`;
};

export const analyzeFridgePrompt = "Analyze this image of a fridge/pantry and list all visible food items and ingredients. Return them as a clean list of strings.";
