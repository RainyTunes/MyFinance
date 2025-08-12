import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { CashFlowForecastService } from '../../services/cashFlowForecast';

interface WealthGrowthChartProps {
  months?: number;
  height?: number;
}

const WealthGrowthChart: React.FC<WealthGrowthChartProps> = ({ 
  months = 24, 
  height = 400 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化ECharts实例
    chartInstance.current = echarts.init(chartRef.current);

    // 获取财富增长数据
    const wealthData = CashFlowForecastService.generateWealthGrowthData(months);
    
    // 准备图表数据
    const xAxisData = wealthData.map(item => {
      const [year, month] = item.month.split('-');
      return `${year}年${parseInt(month)}月`;
    });
    
    const monthlyFlowData = wealthData.map(item => (item.monthlyNetFlow / 100).toFixed(0));
    const cumulativeWealthData = wealthData.map(item => (item.cumulativeWealth / 100).toFixed(0));

    const option: echarts.EChartsOption = {
      title: {
        text: '未来24个月财富增量预测',
        subtext: '基于当前收入和支出结构的预测分析',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false
        },
        formatter: function (params: any) {
          const month = params[0].axisValue;
          const monthlyFlow = params[0].value;
          const cumulativeWealth = params[1].value;
          
          return `
            <div style="padding: 10px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${month}</div>
              <div style="margin-bottom: 3px;">
                <span style="color: ${params[0].color};">●</span>
                当月净现金流: <span style="font-weight: bold;">¥${Number(monthlyFlow).toLocaleString()}</span>
              </div>
              <div>
                <span style="color: ${params[1].color};">●</span>
                累计财富增量: <span style="font-weight: bold; color: ${Number(cumulativeWealth) >= 0 ? '#52c41a' : '#ff4d4f'};">¥${Number(cumulativeWealth).toLocaleString()}</span>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['月度净现金流', '累计财富增量'],
        top: 35,
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: 60,
        right: 60,
        top: 80,
        bottom: 100,
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
          axisLabel: {
            rotate: 45,
            fontSize: 10
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '月度现金流 (¥)',
          position: 'left',
          alignTicks: true,
          axisLabel: {
            formatter: function (value: number) {
              if (Math.abs(value) >= 10000) {
                return (value / 10000).toFixed(1) + '万';
              }
              return value.toLocaleString();
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '累计财富 (¥)',
          position: 'right',
          alignTicks: true,
          axisLabel: {
            formatter: function (value: number) {
              if (Math.abs(value) >= 10000) {
                return (value / 10000).toFixed(1) + '万';
              }
              return value.toLocaleString();
            }
          }
        }
      ],
      series: [
        {
          name: '月度净现金流',
          type: 'bar',
          yAxisIndex: 0,
          data: monthlyFlowData,
          itemStyle: {
            color: function (params: any) {
              return Number(params.value) >= 0 ? '#52c41a' : '#ff4d4f';
            }
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: '累计财富增量',
          type: 'line',
          yAxisIndex: 1,
          data: cumulativeWealthData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            color: '#1890ff',
            width: 3
          },
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
            ])
          },
          emphasis: {
            focus: 'series'
          }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: 0,
          start: 0,
          end: 100,
          height: 20,
          bottom: 20
        }
      ]
    };

    chartInstance.current.setOption(option);

    // 响应式处理
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [months]);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`,
        minHeight: '400px'
      }} 
    />
  );
};

export default WealthGrowthChart;