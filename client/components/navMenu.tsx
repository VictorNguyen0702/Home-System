'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMenu() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    const baseClasses = "text-white py-2 px-4 rounded-2xl transition duration-200 hover:bg-gray-700 mb-4";
    const activeClasses = "bg-gray-500 hover:bg-teal-400 font-semibold";
    const inactiveClasses = "text-gray-300";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex flex-col max-w-[200px] w-full bg-gray-800 min-h-screen font-sans items-center pt-20">
      <nav className="flex flex-col w-full px-4">
        <Link 
          href="/dashboard" 
          className={getLinkClassName('/dashboard')}
        >
          Dashboard
        </Link>

        <Link 
          href="/about" 
          className={getLinkClassName('/about')}
        >
          About Us
        </Link>
        
        {/* NOTE: Dynamic routes like /products/[id] require more complex logic. 
          For a basic match, you'd match the *base* part of the path, or 
          check if the pathname *starts with* the link's base path. 
        */}
        <Link 
          href="/products/789" 
          className={getLinkClassName('/products/789')}
        >
          View Product 789
        </Link>
      </nav>
    </div>
  );
}