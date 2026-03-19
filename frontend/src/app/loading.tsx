export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="h-24 w-24 rounded-3xl bg-indigo-50 flex items-center justify-center animate-pulse">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl rotate-12"></div>
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 bg-amber-400 rounded-lg animate-bounce shadow-lg"></div>
      </div>
      <div className="mt-8 space-y-4 text-center">
        <h2 className="text-xl font-black text-slate-900 tracking-tight animate-pulse">Synchronizing Grid Data</h2>
        <div className="flex gap-1 justify-center">
          <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
