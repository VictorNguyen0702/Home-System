"use client"

import { useState, useEffect} from 'react'
import DailySummary from "@/components/dailySummary";
import CurrentSummary from "@/components/currentSummary";
import DailyGraph from "@/components/dailyGraph";
import NavMenu from '@/components/navMenu';

export default function Home() {
  
  const backendUrl: string = process.env.backendUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'
  const [JWTToken, setJWTToken] = useState<string>('');
  const [tokenLoaded, setTokenLoaded] = useState<boolean>(false);
  const [currPage, setCurrPage] =  useState<string>('dashboard');
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
        setTokenLoaded(true);
      }
    }
    retrieveJWTToken();
  }, [backendUrl])


  return (
    <div className="flex flex-row min-w-screen">
      <div className='max-w-1/10 w-full'>
        <NavMenu currPage={currPage} setCurrPage={setCurrPage} />
      </div>
      <div className='w-9/10 w-full'>
        { currPage === 'dashboard' && 
          <div className="grid grid-cols-2 w-full font-sans items-center justify-items-center min-h-screen gap-10 p-8 pb-20 sm:p-20 bg-gray-950">
            <DailySummary backendUrl={backendUrl} JWTToken={JWTToken} tokenLoaded={tokenLoaded}/>
            <CurrentSummary backendUrl={backendUrl} JWTToken={JWTToken} tokenLoaded={tokenLoaded}/>
            <DailyGraph backendUrl={backendUrl} JWTToken={JWTToken} tokenLoaded={tokenLoaded}/>
          </div>
        }
      </div>

    </div>


  );
}
