import React from "react";

const FuturisticLoader = () => {
  return (
    <div className="w-full bg-surface-light rounded-DEFAULT shadow-soft p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-primary-darker/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
        
        {/* Middle Ring */}
        <div className="absolute inset-2 border-4 border-t-primary-darker border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
        
        {/* Inner Pulse */}
        <div className="absolute inset-8 bg-primary-darker/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(230,169,55,0.6)]"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold text-text-light tracking-wide animate-pulse">
          AI ANALYSIS IN PROGRESS
        </h3>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary-darker rounded-full animate-[bounce_1s_infinite_0ms]"></span>
          <span className="w-2 h-2 bg-primary-darker rounded-full animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-2 h-2 bg-primary-darker rounded-full animate-[bounce_1s_infinite_400ms]"></span>
        </div>
        <p className="text-sm text-subtle-light mt-2">
          Scanning symptoms & identifying patterns...
        </p>
      </div>
    </div>
  );
};

export default FuturisticLoader;
