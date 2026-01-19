import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import type { WorldClock } from '../types';

const POPULAR_TIMEZONES = [
  { city: 'New York', timezone: 'America/New_York' },
  { city: 'London', timezone: 'Europe/London' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', timezone: 'Australia/Sydney' },
  { city: 'Dubai', timezone: 'Asia/Dubai' },
  { city: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { city: 'Paris', timezone: 'Europe/Paris' },
  { city: 'Singapore', timezone: 'Asia/Singapore' },
];

export default function WorldClockWidget() {
  const [clocks, setClocks] = useState<WorldClock[]>([]);
  const [times, setTimes] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(POPULAR_TIMEZONES[0]);

  useEffect(() => {
    const saved = localStorage.getItem('worldClocks');
    if (saved) {
      setClocks(JSON.parse(saved));
    } else {
      // Default clocks
      setClocks([
        { id: '1', city: 'New York', timezone: 'America/New_York' },
        { id: '2', city: 'London', timezone: 'Europe/London' },
        { id: '3', city: 'Tokyo', timezone: 'Asia/Tokyo' },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }, [clocks]);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, string> = {};
      clocks.forEach(clock => {
        try {
          const time = new Date().toLocaleTimeString('en-US', {
            timeZone: clock.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
          newTimes[clock.id] = time;
        } catch (error) {
          newTimes[clock.id] = 'Invalid timezone';
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, [clocks]);

  const handleAddClock = () => {
    const newClock: WorldClock = {
      id: Date.now().toString(),
      city: selectedTimezone.city,
      timezone: selectedTimezone.timezone,
    };

    setClocks([...clocks, newClock]);
    setIsAdding(false);
  };

  const deleteClock = (id: string) => {
    setClocks(clocks.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">World Clock</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top duration-200">
          <select
            value={`${selectedTimezone.city}|${selectedTimezone.timezone}`}
            onChange={(e) => {
              const [city, timezone] = e.target.value.split('|');
              setSelectedTimezone({ city, timezone });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {POPULAR_TIMEZONES.map(tz => (
              <option key={tz.timezone} value={`${tz.city}|${tz.timezone}`}>
                {tz.city}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddClock}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add City
          </button>
        </div>
      )}

      <div className="flex-1 space-y-3">
        {clocks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No clocks added yet
          </div>
        ) : (
          clocks.map((clock) => (
            <div
              key={clock.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-colors group"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{clock.city}</h3>
                <p className="text-2xl font-bold text-purple-600 tabular-nums">
                  {times[clock.id] || 'Loading...'}
                </p>
              </div>
              <button
                onClick={() => deleteClock(clock.id)}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
