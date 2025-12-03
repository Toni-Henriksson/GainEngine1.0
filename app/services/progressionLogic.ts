import { Exercise } from "../types/types";

/**
 * CONFIGURATION FOR PROGRESSIVE OVERLOAD
 * 
 * Rule: User must complete 6 consecutive sessions at the CURRENT weight before increasing.
 */
const SESSIONS_REQUIRED_FOR_OVERLOAD = 6;

// Helper to determine increase amount based on weight magnitude
const getIncrementAmount = (currentWeight: number): number => {
    if (currentWeight < 20) return 1.25; // Dumbbells / Small isolation
    if (currentWeight < 60) return 2.5;  // Standard upper body
    return 2.5; // Standard progression
};

export const calculateNextWeight = (exercise: Exercise): number => {
    const history = exercise.history || [];
    
    // If no history, no increase
    if (history.length === 0) return exercise.weight;

    const currentWeight = exercise.weight;
    let sessionsAtCurrentWeight = 0;

    // Iterate backwards from the latest entry (which includes the session just completed)
    for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].weight === currentWeight) {
            sessionsAtCurrentWeight++;
        } else {
            // Break sequence if weight was different (e.g. they increased previously)
            break;
        }
    }

    // STRICT RULE: Only increase if they hit exactly or more than the required sessions
    if (sessionsAtCurrentWeight >= SESSIONS_REQUIRED_FOR_OVERLOAD) {
        const increase = getIncrementAmount(currentWeight);
        return currentWeight + increase;
    }

    // Otherwise, stay at same weight
    return currentWeight;
};

export const getProgressMessage = (exercise: Exercise, nextWeight: number): string | null => {
    if (nextWeight > exercise.weight) {
        return `Overload! +${(nextWeight - exercise.weight).toFixed(2)}kg`;
    }
    return null;
};