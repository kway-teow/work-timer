import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the type for our configuration store
interface ConfigState {
  // Language config
  language: string;
  setLanguage: (language: string) => void;
  
  // View config
  showChart: boolean;
  showTimeline: boolean;
  setShowChart: (show: boolean) => void;
  setShowTimeline: (show: boolean) => void;
  
  // Display preferences
  showInDays: boolean;
  hoursPerDay: number;
  showTotalStats: boolean;
  setShowInDays: (show: boolean) => void;
  setHoursPerDay: (hours: number) => void;
  setShowTotalStats: (show: boolean) => void;
}

// Create the store with persist middleware
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Default language from browser or 'zh-CN'
      language: 'zh-CN',
      setLanguage: (language) => set({ language }),
      
      // Default view config
      showChart: false,
      showTimeline: false,
      setShowChart: (showChart) => set({ 
        showChart,
        // Ensure only one view is active at a time
        showTimeline: showChart ? false : get().showTimeline
      }),
      setShowTimeline: (showTimeline) => set({ 
        showTimeline,
        // Ensure only one view is active at a time
        showChart: showTimeline ? false : get().showChart
      }),
      
      // Default display preferences
      showInDays: false,
      hoursPerDay: 7,
      showTotalStats: true,
      setShowInDays: (showInDays) => set({ showInDays }),
      setHoursPerDay: (hoursPerDay) => set({ hoursPerDay }),
      setShowTotalStats: (showTotalStats) => set({ showTotalStats })
    }),
    {
      name: 'app-config', // name of the item in localStorage
    }
  )
); 