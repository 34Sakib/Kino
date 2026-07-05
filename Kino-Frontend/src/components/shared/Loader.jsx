import React from 'react';

export const Loader = ({ size = 40, fullScreen = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-solid border-opacity-10"
          style={{
            borderColor: '#E8B86D',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>
      <span className="font-editorial italic text-sm tracking-wider text-muted">
        Antigravity Atelier...
      </span>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0D0D0D] flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return <div className="py-12 flex justify-center w-full">{loaderContent}</div>;
};

export const SkeletonCard = () => {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse p-3 border border-black/5 bg-white rounded-sm h-[380px]">
      <div className="w-full h-[280px] bg-black/5 rounded-sm" />
      <div className="h-3 bg-black/5 w-1/3 rounded-xs" />
      <div className="h-5 bg-black/5 w-3/4 rounded-xs" />
      <div className="flex items-center justify-between border-t border-black/5 pt-2 mt-auto">
        <div className="h-4 bg-black/5 w-1/4 rounded-xs" />
        <div className="h-4 bg-black/5 w-1/5 rounded-xs" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};
