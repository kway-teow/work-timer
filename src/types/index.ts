export interface TimeEntry {
  id: string;
  startTime: string; // ISO string
  endTime: string | null; // ISO string
  description: string;
  duration: number; // Duration in minutes
}

export interface TimeStats {
  totalHours: number;
  totalDays: number; // Based on 7 hours per day
  entries: TimeEntry[];
} 