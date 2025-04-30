import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/store/configStore';
import ExportButton from './ExportButton';
import { useWorkRecords } from '@/hooks';

const ViewSelector: React.FC = () => {
  const { t } = useTranslation();
  const { 
    showChart, 
    showTimeline, 
    setShowChart, 
    setShowTimeline 
  } = useConfigStore();
  
  // 获取工时记录
  const { records } = useWorkRecords();

  const handleRecordsView = () => {
    setShowChart(false);
    setShowTimeline(false);
  };

  const handleTimelineView = () => {
    setShowChart(false);
    setShowTimeline(true);
  };

  const handleChartView = () => {
    setShowChart(true);
    setShowTimeline(false);
  };

  return (
    <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
      <div className="flex space-x-4 flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !showChart && !showTimeline
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={handleRecordsView}
        >
          {t('timeRecords')}
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showTimeline ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={handleTimelineView}
        >
          {t('timeline')}
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showChart ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          onClick={handleChartView}
        >
          {t('hoursTrend')}
        </button>
      </div>
      
      {/* 导出按钮 */}
      <ExportButton records={records} />
    </div>
  );
};

export default ViewSelector; 