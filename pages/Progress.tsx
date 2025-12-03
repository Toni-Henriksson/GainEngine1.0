import React, { useEffect, useState } from 'react';
import { UserWorkoutData, Exercise } from '../types';
import { getWorkoutData } from '../services/workoutService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Icons } from '../components/Icons';

export const Progress: React.FC = () => {
  const [data, setData] = useState<UserWorkoutData | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    getWorkoutData().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-500">Loading stats...</div>;

  // Flatten all exercises to find them easily
  const allExercises = data.fullWorkouts.flatMap(d => d.exercises);

  // If no exercise selected, pick the first one that has history
  if (!selectedExerciseId && allExercises.length > 0) {
     const withHistory = allExercises.find(e => e.history.length > 0);
     if (withHistory) setSelectedExerciseId(withHistory.id);
     else if(allExercises[0]) setSelectedExerciseId(allExercises[0].id);
  }

  const currentExercise = allExercises.find(e => e.id === selectedExerciseId);
  
  // Format data for Recharts
  // history: { date, weight }
  const chartData = currentExercise?.history.map((h, i) => ({
    name: i + 1, // Session number
    weight: h.weight,
    date: new Date(h.date).toLocaleDateString()
  })) || [];

  // Add current weight as the "next" point projection
  if (currentExercise) {
    chartData.push({
        name: chartData.length + 1,
        weight: currentExercise.weight,
        date: 'Next'
    });
  }

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <header className="pt-4">
        <h1 className="text-3xl font-extrabold text-white">Progress</h1>
        <p className="text-slate-400 text-sm">Track your strength gains.</p>
      </header>

      {/* Exercise Selector */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {allExercises.map(ex => (
            <button
                key={ex.id}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedExerciseId === ex.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
                {ex.exerciseName}
            </button>
        ))}
      </div>

      {currentExercise ? (
          <div className="bg-card border border-slate-700/50 rounded-3xl p-6 shadow-xl">
             <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">{currentExercise.exerciseName}</h2>
                    <p className="text-slate-400 text-xs mt-1">Weight Progression (kg)</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-primary">{currentExercise.weight}</span>
                    <span className="text-xs text-slate-500 block">Current Max</span>
                </div>
             </div>

             <div className="h-64 w-full">
                {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 4 }}
                                activeDot={{ r: 6, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm border-2 border-dashed border-slate-700 rounded-xl">
                        <Icons.TrendingUp className="mb-2 opacity-50" />
                        <p>Not enough data yet.</p>
                        <p className="text-xs">Complete more workouts to see the graph.</p>
                    </div>
                )}
             </div>
          </div>
      ) : (
          <div className="text-center text-slate-500 mt-10">No exercises found.</div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl">
            <h3 className="text-indigo-400 text-xs font-bold uppercase mb-1">Total Volume</h3>
            <p className="text-2xl font-bold text-indigo-200">12,450 <span className="text-xs font-normal opacity-70">kg</span></p>
        </div>
        <div className="bg-rose-600/10 border border-rose-500/20 p-4 rounded-2xl">
            <h3 className="text-rose-400 text-xs font-bold uppercase mb-1">Consistency</h3>
            <p className="text-2xl font-bold text-rose-200">92% <span className="text-xs font-normal opacity-70">streak</span></p>
        </div>
      </div>
    </div>
  );
};