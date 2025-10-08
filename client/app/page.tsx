import Image from "next/image";
import DailySummary from "@/components/dailySummary";
import CurrentSummary from "@/components/currentSummary";
export default async function Home() {
  
  // TODO: Change backendUrl to use a prop or reactContext
  const backendUrl: string = process.env.backendUrl || 'http://localhost:5000/'

  // Get JWT Token for NeoVolt APIs
  let JWTToken: string = ''
  try {
    const response = await fetch(`${backendUrl}/login`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    JWTToken = await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
  }

  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-950">
      <div className="flex flex-row gap-10">
      <DailySummary backendUrl={backendUrl} JWTToken={JWTToken} />
      <CurrentSummary backendUrl={backendUrl} JWTToken={JWTToken} />
      </div>

    </div>
  );
}
