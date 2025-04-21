import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义配置存储的类型
interface ConfigState {
  // 语言配置
  language: string;
  setLanguage: (language: string) => void;
  
  // 视图配置
  showChart: boolean;
  showTimeline: boolean;
  setShowChart: (show: boolean) => void;
  setShowTimeline: (show: boolean) => void;
  
  // 显示偏好
  showInDays: boolean;
  hoursPerDay: number;
  showTotalStats: boolean;
  setShowInDays: (show: boolean) => void;
  setHoursPerDay: (hours: number) => void;
  setShowTotalStats: (show: boolean) => void;
}

// 使用持久化中间件创建存储
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // 默认语言从浏览器获取或设为'zh-CN'
      language: 'zh-CN',
      setLanguage: (language) => set({ language }),
      
      // 默认视图配置
      showChart: false,
      showTimeline: false,
      setShowChart: (showChart) => set({ 
        showChart,
        // 确保同时只有一个视图处于活动状态
        showTimeline: showChart ? false : get().showTimeline
      }),
      setShowTimeline: (showTimeline) => set({ 
        showTimeline,
        // 确保同时只有一个视图处于活动状态
        showChart: showTimeline ? false : get().showChart
      }),
      
      // 默认显示偏好
      showInDays: false,
      hoursPerDay: 7,
      showTotalStats: true,
      setShowInDays: (showInDays) => set({ showInDays }),
      setHoursPerDay: (hoursPerDay) => set({ hoursPerDay }),
      setShowTotalStats: (showTotalStats) => set({ showTotalStats })
    }),
    {
      name: 'app-config', // localStorage中的项目名称
    }
  )
); 