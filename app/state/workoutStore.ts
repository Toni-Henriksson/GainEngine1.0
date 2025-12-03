import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserWorkoutData, INITIAL_DATA, WorkoutDay, Exercise } from '../types/types';
import { calculateNextWeight } from '../services/progressionLogic';

interface WorkoutState {
  workoutData: UserWorkoutData;
  isLoading: boolean;
  
  // Actions
  loadData: () => Promise<void>;
  resetData: () => Promise<void>;
  
  // Logic
  completeCurrentWorkout: () => Promise<void>;
  setManualWorkoutIndex: (index: number) => Promise<void>;
  addWorkoutDay: (name: string) => Promise<void>;
  deleteWorkoutDay: (dayId: string) => Promise<void>;
  addExercise: (dayId: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (dayId: string, exerciseId: string) => Promise<void>;
  findWorkoutDayIndexByName: (name: string) => number;
}

const STORAGE_KEY = '@gainengine_v3'; // Version bumped for new schema

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workoutData: INITIAL_DATA,
  isLoading: true,

  loadData: async () => {
    try {
      set({ isLoading: true });
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed: UserWorkoutData = JSON.parse(json);
        // Migration: Ensure startingWeight exists if loading old data
        parsed.fullWorkouts.forEach(day => {
            day.exercises.forEach(ex => {
                // Ensure history is an array
                if (!Array.isArray(ex.history)) {
                    ex.history = [];
                }
                if (ex.startingWeight === undefined) {
                    ex.startingWeight = ex.history.length > 0 ? ex.history[0].weight : ex.weight;
                }
            });
        });
        set({ workoutData: parsed, isLoading: false });
      } else {
        // Initialize with default data if fresh
        set({ workoutData: INITIAL_DATA, isLoading: false });
      }
    } catch (e) {
      console.error("Failed to load data", e);
      set({ workoutData: INITIAL_DATA, isLoading: false });
    }
  },

  resetData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ workoutData: INITIAL_DATA });
  },

  setManualWorkoutIndex: async (targetIndex: number) => {
    const { workoutData } = get();
    
    const total = workoutData.fullWorkouts.length;
    if (total === 0) return;

    // Calculate previous index so that (index + 1) % total === targetIndex
    let newLastIndex = targetIndex - 1;
    if (newLastIndex < 0) {
      newLastIndex = total - 1;
    }

    const newData = {
      ...workoutData,
      lastWorkoutIndex: newLastIndex
    };

    set({ workoutData: newData });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },

  completeCurrentWorkout: async () => {
    const { workoutData } = get();
    
    // 1. Identify current workout
    const currentIdx = (workoutData.lastWorkoutIndex + 1) % workoutData.fullWorkouts.length;
    const currentWorkout = workoutData.fullWorkouts[currentIdx];

    // --- AUTOMATED PROGRESSIVE OVERLOAD LOGIC ---
    const updatedExercises = currentWorkout.exercises.map((ex) => {
      // 1. Add current session to history
      const newHistoryItem = {
        date: new Date().toISOString(),
        weight: ex.weight,
        reps: ex.reps
      };
      
      const updatedHistory = [...(ex.history || []), newHistoryItem];

      // 2. Create a temporary exercise object with updated history to check rules
      const tempEx: Exercise = { ...ex, history: updatedHistory };

      // 3. Calculate next weight using specific rules (6 sessions etc)
      const nextWeight = calculateNextWeight(tempEx);

      return {
        ...ex,
        weight: nextWeight,
        history: updatedHistory,
        // Ensure startingWeight is set if it wasn't
        startingWeight: ex.startingWeight !== undefined ? ex.startingWeight : ex.weight
      };
    });

    const updatedWorkoutDay = { ...currentWorkout, exercises: updatedExercises };
    
    const newFullWorkouts = [...workoutData.fullWorkouts];
    newFullWorkouts[currentIdx] = updatedWorkoutDay;

    const newData: UserWorkoutData = {
      ...workoutData,
      fullWorkouts: newFullWorkouts,
      lastWorkoutIndex: currentIdx, 
      lastWorkoutDate: new Date().toISOString(),
    };

    set({ workoutData: newData });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },

  addWorkoutDay: async (name) => {
    const { workoutData } = get();
    const newDay: WorkoutDay = {
      id: Date.now().toString(),
      workoutName: name,
      exercises: []
    };
    const newData = { ...workoutData, fullWorkouts: [...workoutData.fullWorkouts, newDay] };
    set({ workoutData: newData });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },

  deleteWorkoutDay: async (dayId) => {
    const { workoutData } = get();
    const newData = {
      ...workoutData,
      fullWorkouts: workoutData.fullWorkouts.filter(d => d.id !== dayId),
      lastWorkoutIndex: 0 
    };
    set({ workoutData: newData });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },

  addExercise: async (dayId, ex) => {
    const { workoutData } = get();
    const dayIndex = workoutData.fullWorkouts.findIndex(d => d.id === dayId);
    if (dayIndex === -1) return;

    const w = Number(ex.weight) || 0;
    const newExercise: Exercise = {
      id: Date.now().toString(),
      exerciseName: ex.exerciseName || "New Exercise",
      reps: ex.reps || "8-12",
      weight: w,
      startingWeight: w, // Initialize starting weight
      history: []
    };

    const updatedWorkouts = [...workoutData.fullWorkouts];
    updatedWorkouts[dayIndex].exercises.push(newExercise);

    const newData = { ...workoutData, fullWorkouts: updatedWorkouts };
    set({ workoutData: newData });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },

  deleteExercise: async (dayId, exId) => {
    const { workoutData } = get();
    const dayIndex = workoutData.fullWorkouts.findIndex(d => d.id === dayId);
    if (dayIndex === -1) return;

    const updatedWorkouts = [...workoutData.fullWorkouts];
    updatedWorkouts[dayIndex].exercises = updatedWorkouts[dayIndex].exercises.filter(e => e.id !== exId);

    const newData = { ...workoutData, fullWorkouts: updatedWorkouts };
    set({ workoutData: newData });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  },
  
  findWorkoutDayIndexByName: (name: string) => {
      const { workoutData } = get();
      return workoutData.fullWorkouts.findIndex(w => w.workoutName === name);
  }
}));