export const TaskSkeleton = () => (
  <div className="bg-white px-5 p-2 pt-3 m-1 mb-5 rounded-2xl">
    <div className="flex justify-between mb-4">
      <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
      <div className="h-4 w-12 bg-slate-100 rounded-md" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 w-full bg-slate-100 rounded-md" />
      <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
    </div>
    <div className="flex justify-between items-center">
      <div className="h-3 w-16 bg-slate-50 rounded-md" />
      <div className="h-6 w-6 rounded-full bg-slate-100" />
    </div>
  </div>
);
