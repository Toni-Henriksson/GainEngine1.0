import { GoogleGenAI } from "@google/genai";
import { WorkoutDay } from "../types";

// This is client-side for the demo. In production, proxy through your backend.
// We use a safe check for the key.
const API_KEY = process.env.API_KEY || ''; 

export const analyzeWorkoutPlan = async (workout: WorkoutDay): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please add your Gemini API Key to run AI analysis.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Analyze this gym workout day: "${workout.workoutName}".
    Exercises:
    ${workout.exercises.map(e => `- ${e.exerciseName}: ${e.reps} reps @ ${e.weight}kg`).join('\n')}

    Provide a concise, 3-bullet point critique focusing on:
    1. Muscle balance.
    2. Rep range suitability for hypertrophy.
    3. One specific improvement tip.
    Keep it encouraging and scientific.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI is currently resting between sets. Try again later.";
  }
};