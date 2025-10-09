"use client"
import Image from "next/image";
import { useState, useEffect} from 'react'
import DailySummary from "@/components/dailySummary";
import CurrentSummary from "@/components/currentSummary";
import DailyGraph from "@/components/dailyGraph";


export default function Home() {
  
  // TODO: Change backendUrl to use a prop or reactContext
  const backendUrl: string = process.env.backendUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'
  const [JWTToken, setJWTToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Get JWT Token for NeoVolt APIs
  useEffect(() => {
    async function retrieveJWTToken() {
      try {
        const response = await fetch(`${backendUrl}/login`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setJWTToken(await response.json());
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setIsLoading(false); 
      }
    }
    retrieveJWTToken();
  }, [backendUrl])


  return (
    <div>
      {JWTToken ? (
        <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-950">
          <div className="flex flex-col mx-auto">
            <div className="flex flex-row gap-10">
              <DailySummary backendUrl={backendUrl} JWTToken={JWTToken} />
              <CurrentSummary backendUrl={backendUrl} JWTToken={JWTToken} />
            </div>
            <DailyGraph backendUrl={backendUrl} JWTToken={JWTToken} />
          </div>
        </div>
      ) : (
        <div>Loading Page</div>
      )}
    </div>


  );
}
