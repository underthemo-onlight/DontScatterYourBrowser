import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Check } from 'lucide-react';
import type { Habit } from '../types';

export default function HabitTrackerWidget() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('habits');
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.includes(getTodayString());
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completedDates: [],
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const toggleHabitToday = (id: string) => {
    const today = getTodayString();
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;

      const isCompleted = habit.completedDates.includes(today);
      const newCompletedDates = isCompleted
        ? habit.completedDates.filter(date => date !== today)
        : [...habit.completedDates, today];

      return { ...habit, completedDates: newCompletedDates };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;

    const sortedDates = [...habit.completedDates].sort().reverse();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      const expectedDateString = expectedDate.toISOString().split('T')[0];

      if (sortedDates[i] === expectedDateString) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">Habit Tracker</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top duration-200">
          <input
            type="text"
            placeholder="Habit name"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleAddHabit}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Habit
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {habits.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No habits tracked yet
          </div>
        ) : (
          habits.map((habit) => {
            const completedToday = isCompletedToday(habit);
            const streak = getStreak(habit);

            return (
              <div
                key={habit.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        completedToday
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'border-gray-300 hover:border-orange-600'
                      }`}
                    >
                      {completedToday && <Check className="w-5 h-5" />}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{habit.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>
                          {streak} day{streak !== 1 ? 's' : ''} streak
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          {habit.completedDates.length} total
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 rounded-lg hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
