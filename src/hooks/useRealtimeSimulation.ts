import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import { toast } from "sonner";
import type { Task } from "../types/task";

export function useRealTimeSimulation(isEditingId: string | null) {
  const { state, dispatch } = useTasks();

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (state.tasks.length === 0) return;

        // 1. Pick a random task to "remotely" update
        const randomIndex = Math.floor(Math.random() * state.tasks.length);
        const targetTask = state.tasks[randomIndex];

        // 2. Simulate a remote change (e.g., changing status or title)
        const statuses: Task["status"][] = ["todo", "in-progress", "done"];
        const remoteUpdate: Task = {
          ...targetTask,
          title: targetTask.title + " (Remote Update)",
          status: statuses[Math.floor(Math.random() * statuses.length)],
          updatedAt: new Date().toISOString(),
        };

        // 3. RECONCILIATION STRATEGY
        // If the user is currently dragging/editing this specific task
        if (isEditingId === targetTask.id) {
          toast.warning("Conflict Detected", {
            description: `Another user modified "${targetTask.title}". Your local changes were kept.`,
            duration: 5000,
          });
          // Strategy: Client-Wins (Skip dispatch to preserve local state)
          return;
        }

        // 4. APPLY UPDATE & NOTIFY
        dispatch({ type: "EXTERNAL_UPDATE", payload: remoteUpdate });

        toast("External User Change", {
          description: `User 'Ryan' moved "${targetTask.title}" to ${remoteUpdate.status}`,
          icon: "🌐",
        });
      },
      Math.random() * 5000 + 10000,
    ); // 10-15 seconds

    return () => clearInterval(interval);
  }, [state.tasks, dispatch, isEditingId]);
}
