import { useDroppable } from "@dnd-kit/core";
import { useState, useRef, useEffect, useMemo } from "react";
import clsx from "clsx";
import { RollingBadge } from "./RollingBadge";
import { TaskCard, TaskSkeleton } from "./TaskCard";

interface ColumnProps {
  id: string;
  tasks: any[];
  syncingTaskId: string | null;
}

const statusConfig: Record<string, { label: string; dot: string; bg: string }> =
  {
    todo: { label: "To Do", dot: "bg-slate-400", bg: "bg-slate-100" },
    "in-progress": {
      label: "In Progress",
      dot: "bg-blue-500",
      bg: "bg-blue-100",
    },
    done: { label: "Completed", dot: "bg-emerald-500", bg: "bg-emerald-100" },
  };

export default function Column({ id, tasks, syncingTaskId }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  // --- Pagination Logic ---
  const INITIAL_BATCH = 5;
  const LOAD_MORE_COUNT = 2; // Increased slightly for better scroll feel
  const [displayLimit, setDisplayLimit] = useState(INITIAL_BATCH);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const allColumnTasks = useMemo(
    () => tasks.filter((t) => t.status === id),
    [tasks, id],
  );

  const visibleTasks = allColumnTasks.slice(0, displayLimit);
  const hasMore = displayLimit < allColumnTasks.length;

  useEffect(() => {
    if (allColumnTasks.length < INITIAL_BATCH) {
      setDisplayLimit(INITIAL_BATCH);
    }
  }, [allColumnTasks.length]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small timeout to allow the skeleton to be visible for a split second
          setTimeout(() => {
            setDisplayLimit((prev) => prev + LOAD_MORE_COUNT);
          }, 200);
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, displayLimit]);

  const config = statusConfig[id] || {
    label: id,
    dot: "bg-gray-400",
    bg: "bg-gray-100",
  };

  return (
    <div className="bg-slate-100/80 rounded-[2rem] p-4 h-full flex flex-col border border-slate-200 shadow-xs">
      <div className="sticky top-0 z-20 pb-4 pt-1">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2.5">
            <div className={clsx("w-2 h-2 rounded-full", config.dot)} />
            <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
              {config.label}
            </h2>
            <span
              className={clsx(
                "ml-1 text-[10px] font-black px-2 py-0.5 rounded-full transition-all duration-300",
                allColumnTasks.length > 0
                  ? "bg-slate-900 text-white"
                  : "bg-slate-200 text-slate-500",
              )}
            >
              <RollingBadge count={allColumnTasks.length} />
            </span>
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto min-h-[500px] scrollbar-hide px-1 pb-10"
      >
        <div className="space-y-1">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSyncing={task.id === syncingTaskId}
            />
          ))}
        </div>

        {/* Sentinel: Shows Skeletons while loading the next batch */}
        {hasMore ? (
          <div ref={observerTarget} className="mt-2 space-y-1 opacity-60">
            <TaskSkeleton />
            <div className="flex flex-col items-center py-2">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          allColumnTasks.length > INITIAL_BATCH && (
            <div className="py-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                End of list
              </p>
            </div>
          )
        )}

        {allColumnTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-10 opacity-30 select-none">
            <div className="w-12 h-12 border-2 border-dashed border-slate-400 rounded-2xl mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Empty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
