import React, { useState, useEffect } from 'react';
import { getWorkoutData, addWorkoutDay, deleteWorkoutDay, saveWorkoutData } from '../services/workoutService';
import { UserWorkoutData, WorkoutDay, Exercise } from '../types';
import { Icons } from '../components/Icons';

export const PlanEditor: React.FC = () => {
  const [data, setData] = useState<UserWorkoutData | null>(null);
  const [newDayName, setNewDayName] = useState('');
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  
  // Exercise Input State
  const [exName, setExName] = useState('');
  const [exReps, setExReps] = useState('');
  const [exWeight, setExWeight] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const d = await getWorkoutData();
    setData(d);
  };

  const handleAddDay = async () => {
    if (!data || !newDayName.trim()) return;
    const updated = await addWorkoutDay(data, newDayName);
    setData(updated);
    setNewDayName('');
  };

  const handleDeleteDay = async (id: string) => {
    if (!data || !confirm("Delete this entire workout day?")) return;
    const updated = await deleteWorkoutDay(data, id);
    setData(updated);
  };

  const handleAddExercise = async () => {
    if (!data || !editingDayId || !exName || !exWeight) return;
    
    const updated = { ...data };
    const day = updated.fullWorkouts.find(d => d.id === editingDayId);
    if (day) {
        day.exercises.push({
            id: Date.now().toString(),
            exerciseName: exName,
            reps: exReps || "8-12",
            weight: parseFloat(exWeight),
            history: []
        });
        await saveWorkoutData(updated);
        setData(updated);
        setExName('');
        setExReps('');
        setExWeight('');
    }
  };

  const handleRemoveExercise = async (dayId: string, exId: string) => {
    if(!data) return;
    const updated = { ...data };
    const day = updated.fullWorkouts.find(d => d.id === dayId);
    if(day) {
        day.exercises = day.exercises.filter(e => e.id !== exId);
        await saveWorkoutData(updated);
        setData(updated);
    }
  }

  if (!data) return null;

  return (
    <div className="p-4 pb-24 space-y-6">
      <header className="pt-4">
        <h1 className="text-3xl font-extrabold text-white">Workout Plan</h1>
        <p className="text-slate-400 text-sm">Design your split.</p>
      </header>

      {/* Add New Day Input */}
      <div className="flex gap-2">
        <input 
            type="text" 
            value={newDayName}
            onChange={(e) => setNewDayName(e.target.value)}
            placeholder="New Split Name (e.g. Legs)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
        />
        <button 
            onClick={handleAddDay}
            className="bg-primary hover:bg-emerald-600 text-white p-3 rounded-xl transition-colors"
        >
            <Icons.Add size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {data.fullWorkouts.map((day) => (
            <div key={day.id} className="bg-card border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-4 flex justify-between items-center bg-slate-800/50">
                    <h3 className="font-bold text-lg text-slate-100">{day.workoutName}</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setEditingDayId(editingDayId === day.id ? null : day.id)}
                            className={`p-2 rounded-lg transition-colors ${editingDayId === day.id ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-700 text-slate-400'}`}
                        >
                            <Icons.Settings size={18} />
                        </button>
                        <button 
                            onClick={() => handleDeleteDay(day.id)}
                            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                            <Icons.Delete size={18} />
                        </button>
                    </div>
                </div>

                {/* Exercise List */}
                <div className="p-4 space-y-3">
                    {day.exercises.length === 0 && (
                        <p className="text-xs text-slate-500 italic text-center py-2">No exercises yet.</p>
                    )}
                    {day.exercises.map(ex => (
                        <div key={ex.id} className="flex justify-between items-center text-sm group">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></div>
                                <div>
                                    <p className="text-slate-200 font-medium">{ex.exerciseName}</p>
                                    <p className="text-slate-500 text-xs">{ex.reps} reps • {ex.weight}kg</p>
                                </div>
                            </div>
                            {editingDayId === day.id && (
                                <button onClick={() => handleRemoveExercise(day.id, ex.id)} className="text-slate-600 hover:text-red-400">
                                    <Icons.Delete size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Exercise Form (Only visible when editing) */}
                {editingDayId === day.id && (
                    <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Add Exercise</p>
                        <input 
                            placeholder="Exercise Name" 
                            className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={exName}
                            onChange={e => setExName(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <input 
                                placeholder="Reps (8-12)" 
                                className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                value={exReps}
                                onChange={e => setExReps(e.target.value)}
                            />
                            <input 
                                placeholder="Kg" 
                                type="number"
                                className="w-24 bg-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                value={exWeight}
                                onChange={e => setExWeight(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleAddExercise}
                            className="w-full bg-slate-700 hover:bg-primary text-white text-sm font-medium py-2 rounded-lg transition-colors"
                        >
                            Add to {day.workoutName}
                        </button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};