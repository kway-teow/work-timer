import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../store/configStore';

const ViewSelector: React.FC = () => {
  const { t } = useTranslation();
  const { 
    showChart, 
    showTimeline, 
    setShowChart, 
    setShowTimeline 
  } = useConfigStore();

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
    <div className="mt-4 flex justify-between items-center">
      <div className="flex space-x-4">
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
    </div>
  );
};

export default ViewSelector; 