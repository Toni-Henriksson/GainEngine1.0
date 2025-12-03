import { UserWorkoutData, INITIAL_DATA, WorkoutDay } from '../types';

// In a real app, these would be fetch() calls to your Node/Mongo backend.
// Here we use LocalStorage to persist data in the browser.

const STORAGE_KEY = 'gainengine_data';

export const getWorkoutData = async (): Promise<UserWorkoutData> => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return INITIAL_DATA;
};

export const saveWorkoutData = async (data: UserWorkoutData): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
};

// --- SCIENCE-BASED PROGRESSIVE OVERLOAD LOGIC ---
// If the user completes a workout, we calculate the next session's weights.
export const completeWorkout = async (currentData: UserWorkoutData): Promise<UserWorkoutData> => {
  const nextIndex = (currentData.lastWorkoutIndex + 1) % currentData.fullWorkouts.length;
  
  // Create a deep copy to modify
  const newData = { ...currentData };
  const currentWorkoutDay = newData.fullWorkouts[nextIndex];

  // Logic: Increase weight by 2.5kg if they aren't brand new
  // In a complex app, we'd check if they hit their rep target in the previous session history.
  // Here, we simulate "Automated Progression" by adding weight every session.
  currentWorkoutDay.exercises = currentWorkoutDay.exercises.map(ex => {
    // Save history of *current* lift before upgrading
    ex.history.push({
      date: new Date().toISOString(),
      weight: ex.weight,
      repsCompleted: parseInt(ex.reps.split('-')[0]) || 8 // Assume lower bound reached
    });

    // Progressive Overload Calculation
    let increase = 0;
    if (ex.history.length > 0) {
        // Small increments for upper body / isolation (approx 1.25kg - 2.5kg)
        // Larger for compounds. Simplified here to +2.5kg
        increase = 2.5; 
    }

    return {
      ...ex,
      weight: ex.weight + increase
    };
  });

  newData.lastWorkoutIndex = nextIndex;
  newData.lastWorkoutDate = new Date().toISOString();

  await saveWorkoutData(newData);
  return newData;
};

export const addWorkoutDay = async (data: UserWorkoutData, name: string): Promise<UserWorkoutData> => {
    const newData = { ...data };
    newData.fullWorkouts.push({
        id: Date.now().toString(),
        workoutName: name,
        exercises: []
    });
    await saveWorkoutData(newData);
    return newData;
};

export const deleteWorkoutDay = async (data: UserWorkoutData, id: string): Promise<UserWorkoutData> => {
    const newData = { ...data };
    newData.fullWorkouts = newData.fullWorkouts.filter(w => w.id !== id);
    // Reset index if out of bounds
    if (newData.lastWorkoutIndex >= newData.fullWorkouts.length) {
        newData.lastWorkoutIndex = 0;
    }
    await saveWorkoutData(newData);
    return newData;
};
