'use client'
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { 
    ssr: false 
});
import { ApexOptions } from 'apexcharts'; // Import the type for better IntelliSense

interface dailyGraphData {
  time: string[],
  batteryPercent: number[],
  gridExport: number[],
  gridImport: number[],
  consumption: number[],
  generation: number[],
}

const convertTimeToTimestamp = (timeStr: string): number => {
    const date = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0); 
    return date.getTime(); 
};

export default function DailyGraph({ backendUrl, JWTToken, tokenLoaded }: { backendUrl: string, JWTToken: string, tokenLoaded: boolean }) {

  const initialTimeLabels: string[] = Array.from({ length: 289 }, (_, i) => {
    const totalMinutes = i * 5;
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  });

  const [dailyGraphData, setDailyGraphData] = useState<dailyGraphData>({
    time: initialTimeLabels,
    batteryPercent: new Array(289).fill(0),
    gridExport: new Array(289).fill(0),
    gridImport: new Array(289).fill(0),
    consumption: new Array(289).fill(0),
    generation: new Array(289).fill(0),
  })

  const chartOptions: ApexOptions = {
    chart: {
      id: "Today's Usage",
      stacked: false, // Important for multiple Y-axes
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },

      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
    grid: {
      xaxis: {
        lines: {
          show: false // Disables the vertical grid lines
        }
      },
    },
    legend: {
        show: true,
        // Place the legend container on the right side of the chart area
        position: 'bottom', 
        horizontalAlign: 'center', 
        clusterGroupedSeries: false,
        labels: {
          colors: new Array(5).fill('#FFFFFF')
        },
        itemMargin: {
            horizontal: 5, 
            vertical: 0
        }, 
    },
    dataLabels: {
      enabled: false 
    },
    xaxis: {
      categories: dailyGraphData.time,
      tickAmount: 12,
      axisTicks: {
        show: false
      },
      labels: {
        rotate: 0,
        style: {
          colors: new Array(15).fill('#FFFFFF')
        },
      },
    },
    yaxis: [
      {
        // Y-Axis for Battery Percent (Primary/Left Axis)
        seriesName: 'Battery Percent (%)',
        opposite: true, 
        title: {
          text: 'Battery Percent (%)',
          style: {
            color: '#FFFFFF',
          },
        },
        labels: {
          formatter: (value) => value.toFixed(2), 
          style: {
            colors: '#FFFFFF',
          },
        },
        min: 0,
        max: 100, // Battery is always 0-100%
      },
      {
        // Y-Axis for all Power Metrics (Secondary/Left Axis)
        seriesName: 'Power Metrics (kW)',
        title: {
          text: 'Power (kW)',
          style: {
            color: '#FFFFFF',
          },
        },
        labels: {
          formatter: (value) => value.toFixed(2), 
          style: {
            colors: '#FFFFFF',
          },
        },
        min: 0, 
      }
    ],
    tooltip: {
      shared: true, // Ensures a single series tooltip when hovering
      intersect: false,
      theme: 'dark',
      x: {
        show: true
      },
      style: {
        fontSize: '12px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      },    },
    stroke: {
        width: [2, 2 , 2, 2, 2], // Thicker line for battery
        curve: 'smooth'
    },
    colors: ['#6e40aa', '#008ffb', '#e91e63', '#feb019', '#00e396'] // Custom colors for series
  };

  useEffect(() => {
    async function retrieveDailyGraphData() {
      try {
        const todayString = new Date().toLocaleDateString('sv', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const response = await fetch(`${backendUrl}/battery/daily_graph?date=${todayString}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JWTToken}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setDailyGraphData(await response.json());
        console.log(dailyGraphData);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
    if (tokenLoaded) {
      retrieveDailyGraphData();
    }
  }, [backendUrl, JWTToken])

  return (
    <div className="items-center w-full h-full mx-auto justify-items-center text-white bg-gray-800 rounded-2xl p-5 gap-15">
      <Chart
        options={chartOptions}
        series={[
          {
            name: 'Battery Percent (%)',
            data: dailyGraphData['batteryPercent']
          },
          {
            name: 'Generation (kW)',
            data: dailyGraphData['generation']
          },
          {
            name: 'Consumption (kW)',
            data: dailyGraphData['consumption']
          },
          {
            name: 'Grid Export (kW)',
            data: dailyGraphData['gridExport']
          },
          {
            name: 'Grid Import (kW)',
            data: dailyGraphData['gridImport']
          },
        ]}
        type='area'
        width='750'
        />
    </div>
  )
}