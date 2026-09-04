import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-white/15 rounded-xl" />
            <div className="h-4 w-32 bg-white/10 rounded-lg" />
          </div>
          <div className="h-6 w-28 bg-white/15 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 flex items-center gap-4">
            <div className="w-20 h-20 bg-white/15 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-12 w-28 bg-white/15 rounded-xl" />
              <div className="h-4 w-40 bg-white/10 rounded-lg" />
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 space-y-4 shadow-2xl">
        <div className="h-6 w-44 bg-white/15 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-36 bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 space-y-4 shadow-2xl">
        <div className="h-6 w-52 bg-white/15 rounded-xl" />
        <div className="h-64 bg-white/10 rounded-2xl" />
      </div>
    </div>
  );
};
