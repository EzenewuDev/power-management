export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar Skeleton */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col p-8 animate-pulse">
        <div className="h-10 w-40 bg-slate-100 rounded-xl mb-12"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 w-full bg-slate-50 rounded-2xl"></div>
          ))}
        </div>
        <div className="mt-auto h-24 w-full bg-slate-50 rounded-[2rem]"></div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-200 rounded-2xl animate-pulse"></div>
            <div className="h-4 w-40 bg-slate-100 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-6">
            <div className="h-12 w-80 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-12 w-12 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 h-64 bg-slate-900 rounded-[3rem] animate-pulse"></div>
          <div className="h-64 bg-white rounded-[3rem] border border-slate-100 animate-pulse"></div>
          <div className="h-64 bg-white rounded-[3rem] border border-slate-100 animate-pulse"></div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[400px] bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
          ))}
        </div>
      </main>
    </div>
  );
}
