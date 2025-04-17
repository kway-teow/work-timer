import { TimeEntry, TimeStats } from '../types';

export const HOURS_PER_DAY = 7;

// Calculate duration between two times in minutes
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // Handle overnight - if end time is before start time, assume it's the next day
  let diff = end.getTime() - start.getTime();
  if (diff < 0) {
    // Add 24 hours to the end time
    const nextDayEnd = new Date(end);
    nextDayEnd.setDate(nextDayEnd.getDate() + 1);
    diff = nextDayEnd.getTime() - start.getTime();
  }
  
  return Math.round(diff / (1000 * 60)); // Convert milliseconds to minutes
};

// Get start of current week (Monday)
export const getStartOfWeek = (): Date => {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

// Get start of current month
export const getStartOfMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Calculate statistics for a given time period
export const calculateStats = (entries: TimeEntry[], startDate: Date): TimeStats => {
  const filteredEntries = entries.filter(entry => 
    new Date(entry.startTime) >= startDate || new Date(entry.endTime!) >= startDate
  );
  
  const totalMinutes = filteredEntries.reduce((total, entry) => total + entry.duration, 0);
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / HOURS_PER_DAY;
  
  return {
    totalHours: parseFloat(totalHours.toFixed(2)),
    totalDays: parseFloat(totalDays.toFixed(2)),
    entries: filteredEntries
  };
};

// Format time string from Date object (HH:MM)
export const formatTimeString = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Parse time string (HH:MM) to Date
export const parseTimeString = (timeString: string, baseDate: Date = new Date()): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}; 