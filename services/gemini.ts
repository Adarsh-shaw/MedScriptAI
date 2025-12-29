
import { GoogleGenAI, Type } from "@google/genai";
import { Medication, DrugInteraction } from "../types";

// Always use the required initialization format
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkDrugInteractions = async (medications: Medication[]): Promise<DrugInteraction[]> => {
  if (medications.length < 2) return [];

  const prompt = `Analyze potential drug interactions for this list of medications: ${medications.map(m => m.name).join(', ')}. Provide severity (low, moderate, high), description, and recommendation.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING },
              description: { type: Type.STRING },
              recommendation: { type: Type.STRING },
            },
            required: ["severity", "description", "recommendation"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI check failed:", error);
    return [];
  }
};

export const digitizeHandwrittenPrescription = async (base64Image: string): Promise<any> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  
  const prompt = "Extract medication details from this handwritten prescription. Return as a list of medications with name, dosage, frequency, and instructions.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dosage: { type: Type.STRING },
              frequency: { type: Type.STRING },
              instructions: { type: Type.STRING },
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("OCR failed:", error);
    return null;
  }
};
