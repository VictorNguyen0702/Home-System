'use client'
import { useState, useEffect } from 'react'

interface dailyData {
  batteryCharged : number;
  batteryDischarged : number;
  carbonReduction : number;
  consumption : number;
  generation : number;
  gridExport : number;
  gridImport : number;
  incomeDaily : number;
  incomeTotal : number;
  selfConsumption : number;
  selfSufficiency : number;
  treesPlanted : number;
}

export default function DailySummary({ backendUrl, JWTToken }: { backendUrl: string, JWTToken: string }) {
  
  const [dailySummary, setDailySummary] = useState<dailyData>({
    batteryCharged : 0,
    batteryDischarged : 0,
    carbonReduction : 0,
    consumption : 0,
    generation : 0,
    gridExport : 0,
    gridImport : 0,
    incomeDaily : 0,
    incomeTotal : 0,
    selfConsumption : 0,
    selfSufficiency : 0,
    treesPlanted : 0,
  })

  useEffect(() => {
    async function retrieveDailySummary() {
      try {
        const response = await fetch(`${backendUrl}/battery/daily_summary`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${JWTToken}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setDailySummary(await response.json());
        console.log(dailySummary);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
    retrieveDailySummary();
  }, [backendUrl, JWTToken])

  return (
    <div className="grid grid-cols-4 items-center justify-items-center text-white bg-gray-800 rounded-2xl p-5 gap-15">
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/house.svg' width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Generation</p>
          <p className="text-md">{dailySummary['generation'].toFixed(2)} kWh</p>
          <p className="p-2" />
          <p className="font-bold text-sm">Consumption</p>
          <p className="text-md">{dailySummary['consumption'].toFixed(2)} kWh</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/battery.svg' className="rotate-90" width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Charged</p>
          <p className="text-md">{dailySummary['batteryCharged'].toFixed(2)} kWh</p>
          <p className="p-2" />
          <p className="font-bold text-sm">Discharged</p>
          <p className="text-md">{dailySummary['batteryDischarged'].toFixed(2)} kWh</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/power-grid.svg' width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Grid Export</p>
          <p className="text-md">{dailySummary['gridExport'].toFixed(2)} kWh</p>
          <p className="p-2" />
          <p className="font-bold text-sm">Grid Import</p>
          <p className="text-md">{dailySummary['gridImport'].toFixed(2)} kWh</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center gap-3">
        <img src='/logos/tree.svg' width={75} height={75} />
        <div className="flex flex-col items-center justify-items-center gap-1">
          <p className="font-bold text-sm">Trees Planted</p>
          <p className="text-md">{dailySummary['treesPlanted']} Trees</p>
          <p className="p-2" />
          <p className="font-bold text-sm">Carbon Reduced</p>
          <p className="text-md">{dailySummary['carbonReduction'].toFixed(2)} kg</p>
        </div>
      </div>
    </div>
  )
}