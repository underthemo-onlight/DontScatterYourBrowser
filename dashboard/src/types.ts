export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  note: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface WorldClock {
  id: string;
  city: string;
  timezone: string;
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // ISO date strings
}
