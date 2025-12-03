import { WorkoutDay } from "../types/types";
import { GoogleGenAI } from '@google/genai'
// NOTE: In a real mobile app, DO NOT store API keys in plain text.
// Use a proxy server or build-time environment variables.
const API_KEY = process.env.API_KEY || ''; 

export const analyzeWorkout = async (workout: WorkoutDay, language: 'en' | 'fi' = 'en'): Promise<string> => {
  if (!API_KEY) return language === 'fi' ? "Määritä API-avain käyttääksesi AI-valmentajaa." : "Please configure your API Key to use the AI Coach.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    You are an elite strength coach. Analyze this workout day: "${workout.workoutName}".
    
    Exercises:
    ${workout.exercises.map(e => `- ${e.exerciseName}: ${e.reps} @ ${e.weight}kg`).join('\n')}

    Provide 3 extremely concise tips (bullet points) to optimize hypertrophy and strength for this specific session.
    Focus on tempo, rest times, or exercise order.
    
    IMPORTANT: Answer strictly in ${language === 'fi' ? 'Finnish' : 'English'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || (language === 'fi' ? "Ei analyysia saatavilla." : "No analysis available.");
  } catch (error) {
    console.error(error);
    return language === 'fi' ? "AI-valmentaja ei ole käytettävissä." : "AI Coach is currently unavailable.";
  }
};
