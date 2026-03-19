export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex animate-pulse">
      {/* Sidebar Skeleton */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 p-8">
        <div className="h-10 w-40 bg-slate-100 rounded-xl mb-12"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 w-full bg-slate-50 rounded-2xl"></div>
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 ml-72 p-10 max-w-6xl mx-auto space-y-12">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 bg-indigo-100 rounded-2xl"></div>
            <div className="h-10 w-64 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-4 w-48 bg-slate-100 rounded-lg ml-16"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 h-[500px] bg-white rounded-[2.5rem] border border-slate-100"></div>
          <div className="lg:col-span-2 h-[600px] bg-white rounded-[2.5rem] border border-slate-100"></div>
        </div>
      </main>
    </div>
  );
}
