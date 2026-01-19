import BookmarkWidget from './BookmarkWidget';
import TodoWidget from './TodoWidget';
import WorldClockWidget from './WorldClockWidget';
import HabitTrackerWidget from './HabitTrackerWidget';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Personal Dashboard</h1>
          <p className="text-gray-600">Your productivity hub</p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Bookmark Widget - 2x4 (full height on mobile, 2 cols on desktop) */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-4 row-span-4">
            <BookmarkWidget />
          </div>

          {/* Todo Widget - 2x2 */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 row-span-2">
            <TodoWidget />
          </div>

          {/* World Clock Widget - 2x1 */}
          <div className="md:col-span-1 lg:col-span-2 md:row-span-1 row-span-1">
            <WorldClockWidget />
          </div>

          {/* Habit Tracker Widget - 2x1 */}
          <div className="md:col-span-1 lg:col-span-2 md:row-span-1 row-span-1">
            <HabitTrackerWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
