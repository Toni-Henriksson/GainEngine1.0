export interface ExerciseHistory {
  date: string;
  weight: number;
  reps: string;
}

export interface Exercise {
  id: string;
  exerciseName: string;
  reps: string; // Target e.g., "3x10" or "8-12"
  weight: number; // Current working weight
  startingWeight?: number; // The weight when the user first added this exercise or reset it
  history: ExerciseHistory[];
}

export interface WorkoutDay {
  id: string;
  workoutName: string;
  exercises: Exercise[];
}

export interface UserWorkoutData {
  userID: string;
  lastWorkoutIndex: number;
  fullWorkouts: WorkoutDay[];
  lastWorkoutDate: string | null;
}

export const INITIAL_DATA: UserWorkoutData = {
  userID: "local-user",
  lastWorkoutIndex: -1,
  lastWorkoutDate: null,
  fullWorkouts: [
    {
      id: "day-1",
      workoutName: "Push (Chest & Tris)",
      exercises: [
        { id: "e1", exerciseName: "Bench Press", reps: "3x8", weight: 60, startingWeight: 60, history: [] },
        { id: "e2", exerciseName: "Overhead Press", reps: "3x10", weight: 40, startingWeight: 40, history: [] },
        { id: "e3", exerciseName: "Tricep Pushdown", reps: "3x12", weight: 25, startingWeight: 25, history: [] },
      ],
    },
    {
      id: "day-2",
      workoutName: "Pull (Back & Biceps)",
      exercises: [
        { id: "e4", exerciseName: "Lat Pulldown", reps: "3x10", weight: 55, startingWeight: 55, history: [] },
        { id: "e5", exerciseName: "Barbell Row", reps: "3x8", weight: 60, startingWeight: 60, history: [] },
        { id: "e6", exerciseName: "Bicep Curl", reps: "3x12", weight: 15, startingWeight: 15, history: [] },
      ],
    },
  ],
};