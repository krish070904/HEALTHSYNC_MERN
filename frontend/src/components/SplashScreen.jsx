import React, { useEffect, useState } from 'react';
import HealthSyncLogo from "../assets/Logo/HealthSyncLogo.png";

const SplashScreen = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fade out slightly before the finish
    const timer = setTimeout(() => {
      setFade(true);
    }, 2500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center">
        {/* Pulsing effect behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Logo */}
        <img 
          src={HealthSyncLogo} 
          alt="HealthSync" 
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain animate-float mb-6 relative z-10"
        />
        
        {/* Text */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight animate-fade-in-up relative z-10">
          Health<span className="text-primary">Sync</span>
        </h1>
        
        {/* Loading bar */}
        <div className="mt-8 w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative z-10">
          <div className="h-full bg-primary animate-loading-bar rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
