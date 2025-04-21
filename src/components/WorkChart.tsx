import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Card, Radio } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '@/types/WorkRecord';

interface WorkChartProps {
  records: WorkRecord[];
}

type ChartType = 'daily' | 'weekly' | 'monthly';
type ChartStyle = 'line' | 'bar';

const WorkChart: React.FC<WorkChartProps> = ({ records }) => {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('daily');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('line');

  useEffect(() => {
    if (chartRef.current) {
      // 初始化ECharts实例
      const chart = echarts.init(chartRef.current);
      
      let chartData;
      let xAxisData;
      
      if (chartType === 'daily') {
        // 获取最近7天
        xAxisData = Array.from({ length: 7 }, (_, i) => {
          return dayjs().subtract(i, 'day').format('MM-DD');
        }).reverse();
        
        // 计算每天的工时
        chartData = xAxisData.map((date) => {
          return records.reduce((total, record) => {
            if (dayjs(record.startDate).format('MM-DD') === date) {
              return total + record.hours;
            }
            return total;
          }, 0);
        });
      } else if (chartType === 'weekly') {
        // 获取最近4周
        xAxisData = Array.from({ length: 4 }, (_, i) => {
          const weekStart = dayjs().subtract(i, 'week').startOf('week');
          return `${weekStart.format('MM-DD')}`;
        }).reverse();
        
        // 计算每周的工时
        chartData = xAxisData.map((_weekStart, index) => {
          const startDate = dayjs().subtract(3 - index, 'week').startOf('week');
          const endDate = startDate.endOf('week');
          
          return records.reduce((total, record) => {
            const recordDate = dayjs(record.startDate);
            if (recordDate.isAfter(startDate) && recordDate.isBefore(endDate)) {
              return total + record.hours;
            }
            return total;
          }, 0);
        });
      } else {
        // 获取最近6个月
        xAxisData = Array.from({ length: 6 }, (_, i) => {
          return dayjs().subtract(i, 'month').format('YYYY-MM');
        }).reverse();
        
        // 计算每月的工时
        chartData = xAxisData.map((month) => {
          const [year, monthNum] = month.split('-');
          const startDate = dayjs(`${year}-${monthNum}-01`).startOf('month');
          const endDate = startDate.endOf('month');
          
          return records.reduce((total, record) => {
            const recordDate = dayjs(record.startDate);
            if (recordDate.isAfter(startDate) && recordDate.isBefore(endDate)) {
              return total + record.hours;
            }
            return total;
          }, 0);
        });
      }
      
      const getChartTitle = () => {
        switch(chartType) {
          case 'daily': return t('dailyHoursTrend');
          case 'weekly': return t('weeklyHoursTrend');
          case 'monthly': return t('monthlyHoursTrend');
          default: return t('hoursTrend');
        }
      };

      // 根据不同图表类型设置不同的颜色
      const getColor = () => {
        return chartStyle === 'line' ? '#1890ff' : '#7546C9';
      };
      
      // 柱状图特定配置
      const getBarConfig = () => {
        return {
          barWidth: chartType === 'monthly' ? '40%' : '60%',
          itemStyle: {
            color: getColor(),
            borderRadius: [4, 4, 0, 0]
          }
        };
      };
      
      // 折线图特定配置
      const getLineConfig = () => {
        return {
          smooth: true,
          itemStyle: {
            color: getColor(),
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `rgba(24,144,255,0.2)`,
                },
                {
                  offset: 1,
                  color: `rgba(24,144,255,0)`,
                },
              ],
            },
          }
        };
      };
      
      const option = {
        title: {
          text: getChartTitle(),
          left: 'center',
          textStyle: {
            color: '#666',
            fontWeight: 'normal',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br />' + t('hours') + ': {c} ' + t('hoursUnit'),
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: '#ddd',
            },
          },
          axisLabel: {
            color: '#666',
          },
        },
        yAxis: {
          type: 'value',
          name: t('hoursAxis'),
          nameTextStyle: {
            color: '#666',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
            },
          },
        },
        series: [
          {
            name: t('hours'),
            type: chartStyle,
            data: chartData,
            ...(chartStyle === 'line' ? getLineConfig() : getBarConfig()),
            markLine: {
              data: [
                { type: 'average', name: t('average') }
              ],
              label: {
                formatter: '{b}: {c}',
                position: 'middle',
                color: '#ff7070',
              },
              lineStyle: {
                color: '#ff7070',
                type: 'dashed',
                width: 1
              }
            }
          },
        ],
      };
      
      chart.setOption(option);
      
      // 处理窗口大小调整
      const handleResize = () => {
        chart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [records, t, chartType, chartStyle]);

  return (
    <div className="mt-4">
      <Card className="shadow-sm rounded-lg hover:shadow-md transition-shadow" hoverable>
        <div className="flex flex-col">
          <div className="mb-4 flex justify-center flex-wrap gap-2">
            <Radio.Group 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="daily">{t('daily')}</Radio.Button>
              <Radio.Button value="weekly">{t('weekly')}</Radio.Button>
              <Radio.Button value="monthly">{t('monthly')}</Radio.Button>
            </Radio.Group>
            
            <Radio.Group 
              value={chartStyle} 
              onChange={(e) => setChartStyle(e.target.value)}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="line">{t('lineChart')}</Radio.Button>
              <Radio.Button value="bar">{t('barChart')}</Radio.Button>
            </Radio.Group>
          </div>
          <div
            ref={chartRef}
            id="workHoursChart"
            style={{ height: '320px', width: '100%' }}
          ></div>
        </div>
      </Card>
    </div>
  );
};

export default WorkChart; 