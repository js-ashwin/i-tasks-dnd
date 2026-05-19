export const TaskSkeleton = () => (
  <div className="relative bg-white dark:bg-slate-900 px-5 p-2 pt-3 m-1 mb-5 rounded-2xl shadow-sm">
    {/* Header */}
    <div className="flex justify-between items-start mb-2">
      <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-md" />
      <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800 rounded-lg" />
    </div>

    {/* Description */}
    <div className="min-h-[40px] space-y-2">
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-md" />
      <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-md" />
    </div>

    {/* Tags */}
    <div className="flex gap-1 mt-2">
      <div className="h-5 w-12 bg-slate-100 dark:bg-slate-800 rounded-md" />
      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center pt-1 mt-3">
      <div className="h-3 w-16 bg-slate-50 dark:bg-slate-700 rounded-md" />
      <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);
