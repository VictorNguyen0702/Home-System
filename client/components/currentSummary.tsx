'use client'
import { useState, useEffect } from 'react'

interface currentData {
  batteryPercent: number;
  generation: number;
  consumption: number;
  batteryUsage: number;
  gridUsage: number;
}

interface systemData {
  systemSerialNum: number;
  systemId: number;
  systemName: string;
  systemModel: string;
  systemStatus: string;
  inverterPower: number;
  installedCapacity: number;
  usableCapacity: number;
  usablePercentage: number;
}

export default function CurrentSummary({ backendUrl, JWTToken, tokenLoaded }: { backendUrl: string, JWTToken: string, tokenLoaded: boolean }) {

  const intervalTime = 10; 

  const [totalUsable, setTotalUsable] = useState<number>(0);
  const [currentData, setCurrentData] = useState<currentData>({
    batteryPercent: 0,
    generation: 0,
    consumption: 0,
    batteryUsage: 0,
    gridUsage: 0,
  })


  useEffect(() => {
    async function retrieveSystemData() {
      try {
        const response = await fetch(`${backendUrl}/battery/system_data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JWTToken}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setTotalUsable((await response.json())['usableCapacity']);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
    if (tokenLoaded) {
      retrieveSystemData();
    }
  }, [backendUrl, JWTToken])

  useEffect(() => {
    async function retrieveCurrentData() {
      try {
        const response = await fetch(`${backendUrl}/battery/current_data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JWTToken}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setCurrentData(await response.json());
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
    if (tokenLoaded) {
      retrieveCurrentData();
    }
    const intervalId = setInterval(retrieveCurrentData, intervalTime * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalTime, backendUrl, JWTToken])

  return (
    <div className="grid grid-cols-5 items-start justify-items-center text-white bg-gray-800 rounded-2xl p-5 gap-15">
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/battery.svg' className="rotate-90" width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Battery</p>
          <p className="text-md">{currentData['batteryPercent'].toFixed(2)}% </p>
          <p className="text-md">({(currentData['batteryPercent'] * totalUsable / 100).toFixed(2)} kWh)</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/demand.svg' width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Load</p>
          {currentData['consumption'] > 1000 ? 
            <p className="text-md">{((currentData['consumption']) / 1000).toFixed(2)} kW</p>
          : <p className="text-md">{(currentData['consumption'])} W</p>
          }
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/solar-panel.svg' width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Solar Gen</p>
          {currentData['generation'] > 1000 ? 
            <p className="text-md">{((currentData['generation']) / 1000).toFixed(2)} kW</p>
          : <p className="text-md">{(currentData['generation'])} W</p>
          }
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        {currentData['batteryUsage'] > 0 ? 
          <img src='/logos/low-battery.svg' width={75} height={75} />
        : <img src='/logos/high-battery.svg' width={75} height={75} />
        }
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Battery</p>
          <p className={`text-md font-semibold ${currentData['batteryUsage'] <= 0 ? '!text-green-400' : '!text-red-400'}`}>
            {Math.abs(currentData['batteryUsage']) > 1000 ? 
              ((Math.abs(currentData['batteryUsage'])) / 1000).toFixed(2) + ' kW'
            : Math.abs(currentData['batteryUsage']) + ' W'
            }
          </p>
          <p className={`text-md ${currentData['batteryUsage'] <= 0 ? '!text-green-400' : '!text-red-400'}`}>
            {currentData['batteryUsage'] > 0 ? '(Discharging)' : '(Charging)'}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        {currentData['gridUsage'] > 0 ? 
          <img src='/logos/power-grid-import.svg' width={75} height={75} />
        : <img src='/logos/power-grid-export.svg' width={75} height={75} />
        }
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Grid</p>
          <p className={`text-md font-semibold ${currentData['gridUsage'] <= 0 ? '!text-green-400' : '!text-red-400'}`}>
            {Math.abs(currentData['gridUsage']) > 1000 ? 
              ((Math.abs(currentData['gridUsage'])) / 1000).toFixed(2) + ' kW'
            : Math.abs(currentData['gridUsage']) + ' W'
            }
          </p>
          <p className={`text-md ${currentData['gridUsage'] <= 0 ? '!text-green-400' : '!text-red-400'}`}>
            {currentData['gridUsage'] > 0 ? '(Importing)' : '(Exporting)'}
          </p>
        </div>
      </div>
    </div>
  )
}