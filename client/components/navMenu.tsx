'use client';

import React from "react";

export default function NavMenu({ currPage, setCurrPage} : { currPage: string, setCurrPage : React.Dispatch<React.SetStateAction<string>> }) {

  const getLinkClassName = (page: string) => {
    const isActive = currPage === page;
    const baseClasses = "text-white py-2 px-4 rounded-2xl transition duration-200 hover:bg-gray-700 mb-4";
    const activeClasses = "bg-gray-500 font-semibold";
    const inactiveClasses = "text-gray-300";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex flex-col max-w-[200px] w-full bg-gray-800 min-h-screen font-sans items-center pt-20">
      <ul className="flex flex-col w-full px-4">
        <p onClick={() => setCurrPage('dashboard')} className={getLinkClassName('dashboard')}>Dashboard</p>
        <p onClick={() => setCurrPage('solarArray')} className={getLinkClassName('solarArray')}>Solar Array</p>
      </ul>
    </div>
  );
}