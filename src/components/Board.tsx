import {
  DndContext,
  closestCorners,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useTasks } from "../context/TaskContext";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { useState, useMemo, useEffect } from "react";
import FiltersBar from "./Filters";
import { filterTasks } from "../utils/filterTasks";
import { toast } from "sonner";
import clsx from "clsx";
import { useRealTimeSimulation } from "../hooks/useRealtimeSimulation";
import { TaskCard, type Task } from "./TaskCard";

const columns = ["todo", "in-progress", "done"] as const;
type ColumnStatus = (typeof columns)[number];

interface SyncingTask {
  id: string;
  title: string;
}

export default function Board() {
  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [syncingTask, setSyncingTask] = useState<SyncingTask | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    assignee: "",
    priority: "",
    search: "",
  });

  const { state, dispatch } = useTasks();

  // We pass activeTaskId so the simulator knows NOT to overwrite what we are dragging
  useRealTimeSimulation(activeTaskId);

  // Trigger entry animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTasks = useMemo(() => {
    return filterTasks(state.tasks, filters);
  }, [state.tasks, filters]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTaskId(active.id as string);

    const task = state.tasks.find((t: Task) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  // Simulated API with 20% failure rate
  const simulateApiUpdate = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isFailure = Math.random() < 0.2;
        if (isFailure) reject(new Error("Network Error"));
        else resolve({ success: true });
      }, 2000);
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTaskId(null);
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as ColumnStatus;
    const task = state.tasks.find((t: Task) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    const originalStatus = task.status;
    const updatedTask = { ...task, status: newStatus };

    // 1. Optimistic Update
    dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    setSyncingTask({ id: taskId, title: task.title });

    try {
      // 2. Simulated Sync
      await simulateApiUpdate();
      toast.success("Synced successfully", {
        description: `"${task.title}" is now in ${newStatus}`,
      });
    } catch (error) {
      // 3. Rollback
      dispatch({
        type: "UPDATE_TASK",
        payload: { ...task, status: originalStatus },
      });
      toast.error("Sync Failed", {
        description: `Connection lost. Reverted "${task.title}" to ${originalStatus}.`,
      });
    } finally {
      setSyncingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Syncing Indicator Pill */}
      {syncingTask && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10 transition-all animate-bounce">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
              Syncing Changes
            </span>
            <span className="text-sm font-bold truncate max-w-[200px]">
              {syncingTask.title}
            </span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center px-4 md:px-10 py-8">
          <h1
            className={clsx(
              "text-3xl font-black tracking-tighter text-slate-900 transition-all duration-1000",
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4",
            )}
          >
            iTasks<span className="text-blue-500">.</span>
          </h1>

          <div
            className={clsx(
              "flex items-center gap-4 transition-all duration-1000 delay-3200",
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4",
            )}
          >
            <button
              onClick={() => setOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-black active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Task
            </button>
          </div>
        </div>

        <div
          className={clsx(
            "px-4 md:px-10 mb-8 transition-all duration-1000 delay-200",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <FiltersBar onChange={setFilters} />
        </div>

        {/* Board Columns */}
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-10">
            {columns.map((col, index) => {
              const delay =
                index === 0
                  ? "delay-[1000ms]"
                  : index === 1
                    ? "delay-[1800ms]"
                    : "delay-[2600ms]";

              return (
                <div
                  key={col}
                  className={clsx(
                    "transition-all duration-1000 ease-out h-full",
                    delay,
                    mounted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12",
                  )}
                >
                  <Column
                    id={col}
                    tasks={filteredTasks}
                    syncingTaskId={syncingTask?.id || null}
                  />
                </div>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="w-full opacity-90 scale-105 rotate-2 cursor-grabbing shadow-2xl">
                <TaskCard task={activeTask} isOverlay={true} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {open && <TaskModal onClose={() => setOpen(false)} />}
    </div>
  );
}
