import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import AvatarStack from "./AvatarStack";
import React, { useState, useEffect } from "react";
import { TaskSkeleton } from "./TaskSkeleton";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  tags?: string[];
  createdAt: string;
  assignee?: any;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  isSyncing?: boolean;
}

const priorityColors = {
  low: "bg-green-400",
  medium: "bg-blue-400",
  high: "bg-red-400",
};

const priorityColorsBG = {
  low: "bg-green-100",
  medium: "bg-blue-100",
  high: "bg-red-100",
};

const statusColors = {
  todo: "border-l-gray-200",
  "in-progress": "border-l-blue-200",
  done: "border-l-green-200",
};

export const TaskCard = React.memo(
  ({ task, isOverlay, isSyncing }: TaskCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Staggered loading effect
    useEffect(() => {
      if (isOverlay) {
        setIsLoaded(true);
        return;
      }
      // Random delay between 150ms and 450ms for that organic feel
      const delay = Math.floor(Math.random() * 300) + 150;
      const timer = setTimeout(() => setIsLoaded(true), delay);
      return () => clearTimeout(timer);
    }, [isOverlay]);

    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: task.id,
        disabled: isSyncing || !isLoaded,
      });

    const style =
      transform && !isOverlay
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    // Show skeleton while loading
    if (!isLoaded && !isOverlay) {
      return (
        <div ref={setNodeRef}>
          <TaskSkeleton />
        </div>
      );
    }

    if (isDragging && !isOverlay) {
      return (
        <div
          ref={setNodeRef}
          className="m-1 mt-4 mb-5 rounded-2xl bg-gray-50/50 h-[140px]"
        />
      );
    }

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={clsx(
          "relative bg-white px-5 p-2 pt-3 m-1 mb-5 rounded-2xl shadow-sm",
          "cursor-grab active:cursor-grabbing touch-none",
          statusColors[task.status],
          isSyncing &&
            "opacity-60 cursor-wait pointer-events-none grayscale-[0.2]",
          !isOverlay && !isSyncing && "hover:shadow-md hover:-translate-y-1",
          isOverlay &&
            "shadow-2xl ring-2 ring-blue-500/20 scale-105 rotate-2 opacity-90 cursor-grabbing",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        {isSyncing && (
          <div className="absolute top-2 right-2">
            <div className="w-3 rounded-full animate-spin" />
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">
            {task.title}
          </h3>

          {!isSyncing && task.priority && (
            <div
              className={clsx(
                "flex items-center gap-1 text-[10px] tracking-wider rounded-lg px-2 py-0.5 shadow-xs",
                priorityColorsBG[task.priority],
              )}
            >
              <span
                className={clsx(
                  "w-1.5 h-1.5 rounded-full",
                  priorityColors[task.priority],
                )}
              />
              {task.priority}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {task.description || "No description provided."}
        </p>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium"
              >
                #{tag.replace("#", "")}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-1 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "2-digit",
            })}
          </span>
          <AvatarStack users={task.assignee} />
        </div>
      </div>
    );
  },
);
