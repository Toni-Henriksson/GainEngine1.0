import React, { useEffect, useState } from 'react';
import { Icons } from '../components/Icons';
import { UserWorkoutData, WorkoutDay, Exercise } from '../types';
import { getWorkoutData, completeWorkout } from '../services/workoutService';
import { analyzeWorkoutPlan } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<UserWorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const saved = await getWorkoutData();
    setData(saved);
    setLoading(false);
  };

  const handleFinishWorkout = async () => {
    if (!data) return;
    if (confirm("Finish workout? Weights will be automatically increased for next time.")) {
        const updated = await completeWorkout(data);
        setData(updated);
        alert("Great job! Progressive overload applied.");
    }
  };

  const handleAskAI = async (workout: WorkoutDay) => {
    setAnalyzing(true);
    setAiTip(null);
    const tip = await analyzeWorkoutPlan(workout);
    setAiTip(tip);
    setAnalyzing(false);
  };

  if (loading || !data) return <div className="p-8 text-center animate-pulse">Loading gym data...</div>;

  // Determine today's workout
  // If lastWorkoutIndex is -1, start at 0. Otherwise, next one.
  // Note: completeWorkout updates the index. So the index in DB is the LAST completed one.
  const nextIndex = (data.lastWorkoutIndex + 1) % data.fullWorkouts.length;
  const todayWorkout = data.fullWorkouts[nextIndex];

  if (!todayWorkout) {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-[60vh]">
            <Icons.Workout size={48} className="text-slate-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Workouts Found</h2>
            <p className="text-slate-400 text-center mb-6">Go to the "Plan" tab to create your first routine.</p>
        </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center pt-4 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Today's Grind
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-bold text-white text-xs">LVL 5</span>
        </div>
      </header>

      {/* Workout Card */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-slate-700/50 p-6 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">{todayWorkout.workoutName}</h2>
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md w-fit">
                    <Icons.TrendingUp size={12} />
                    <span>OVERLOAD ACTIVE</span>
                </div>
            </div>
            <button 
                onClick={() => handleAskAI(todayWorkout)}
                disabled={analyzing}
                className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-full transition-colors"
                title="Ask AI Coach"
            >
                {analyzing ? <Icons.Activity className="animate-spin" size={20} /> : <Icons.AI size={20} />}
            </button>
        </div>

        {aiTip && (
            <div className="mb-6 bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-xl text-sm text-indigo-200 leading-relaxed animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center space-x-2 mb-2 text-indigo-400 font-bold">
                    <Icons.AI size={16} />
                    <span>Gemini Coach</span>
                </div>
                <div className="whitespace-pre-line">{aiTip}</div>
            </div>
        )}

        <div className="space-y-4">
            {todayWorkout.exercises.map((ex, idx) => (
                <ExerciseCard key={ex.id || idx} exercise={ex} />
            ))}
        </div>

        <button 
            onClick={handleFinishWorkout}
            className="w-full mt-8 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-400 hover:to-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transform active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
            <Icons.Start size={20} />
            <span>Complete Workout</span>
        </button>
      </div>
    </div>
  );
};

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-colors">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-300">
                    <Icons.Dumbbell size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-100">{exercise.exerciseName}</h3>
                    <p className="text-xs text-slate-400">{exercise.reps} Reps</p>
                </div>
            </div>
            <div className="text-right">
                <span className="block text-xl font-bold text-emerald-400">{exercise.weight} <span className="text-sm font-normal text-slate-500">kg</span></span>
                {exercise.history.length > 0 && (
                    <span className="text-[10px] text-emerald-600 flex items-center justify-end">
                        <Icons.TrendingUp size={10} className="mr-1" /> +2.5kg
                    </span>
                )}
            </div>
        </div>
    )
}