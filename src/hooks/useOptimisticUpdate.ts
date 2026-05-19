import { useTasks } from "../context/TaskContext";
import { updateTaskApi } from "../services/fakeApi";
import type { Task, UpdateTaskResult } from "../types";

export const useOptimisticUpdate = (): UpdateTaskResult => {
  const { state, dispatch } = useTasks();

  const updateTask = async (task: Task): Promise<void> => {
    const previousTask = state.tasks.find((t) => t.id === task.id);

    if (!previousTask) return;

    // Optimistic update
    dispatch({ type: "UPDATE_TASK", payload: task });

    try {
      await updateTaskApi(task);
    } catch (err: unknown) {
      dispatch({ type: "ROLLBACK", payload: previousTask });

      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return { updateTask };
};
