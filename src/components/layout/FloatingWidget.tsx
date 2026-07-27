"use client";

export function FloatingWidget() {
  return (
    <div className="hidden md:flex fixed bottom-6 right-6 flex-col gap-3 z-50">
      <button className="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors text-white hover:scale-105 active:scale-95 group relative border-2 border-white">
        <span className="font-bold text-xl">L</span>
        <span className="absolute right-full mr-4 bg-slate-900 text-white px-3 py-1 rounded shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Line OA
        </span>
      </button>
      <button className="h-14 w-14 bg-[#07c160] rounded-full flex items-center justify-center shadow-lg hover:bg-[#06ad56] transition-colors text-white hover:scale-105 active:scale-95 group relative border-2 border-white">
        <span className="font-bold text-xl">W</span>
        <span className="absolute right-full mr-4 bg-slate-900 text-white px-3 py-1 rounded shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          WeChat
        </span>
      </button>
    </div>
  );
}
