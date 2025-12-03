export interface Exercise {
  id: string;
  exerciseName: string;
  reps: string; // Target reps range e.g., "8-12"
  weight: number; // Current working weight in kg
  history: { date: string; weight: number; repsCompleted: number }[];
}

export interface WorkoutDay {
  id: string;
  workoutName: string;
  exercises: Exercise[];
}

export interface UserWorkoutData {
  userID: string;
  lastWorkoutIndex: number; // Index of the last completed workout in the fullWorkouts array
  fullWorkouts: WorkoutDay[];
  lastWorkoutDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
}

// Default initial state for a new user
export const INITIAL_DATA: UserWorkoutData = {
  userID: "local-user-1",
  lastWorkoutIndex: -1, // Starts at -1 so first workout is index 0
  lastWorkoutDate: new Date().toISOString(),
  fullWorkouts: [
    {
      id: "day-1",
      workoutName: "Push (Chest, Shoulders, Triceps)",
      exercises: [
        { id: "ex-1", exerciseName: "Bench Press", reps: "8-10", weight: 60, history: [] },
        { id: "ex-2", exerciseName: "Overhead Press", reps: "10-12", weight: 40, history: [] },
        { id: "ex-3", exerciseName: "Tricep Pushdown", reps: "12-15", weight: 25, history: [] },
      ]
    },
    {
      id: "day-2",
      workoutName: "Pull (Back, Biceps)",
      exercises: [
        { id: "ex-4", exerciseName: "Lat Pulldown", reps: "10-12", weight: 50, history: [] },
        { id: "ex-5", exerciseName: "Barbell Row", reps: "8-10", weight: 55, history: [] },
        { id: "ex-6", exerciseName: "Bicep Curl", reps: "12-15", weight: 15, history: [] },
      ]
    }
  ]
};