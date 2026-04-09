import { useTasks } from "../context/TaskContext";
import { updateTaskApi } from "../services/fakeApi";

export const useOptimisticUpdate = () => {
  const { dispatch } = useTasks();

  const updateTask = async (task) => {
    // 1. Optimistic update
    dispatch({ type: "UPDATE_TASK", payload: task });

    try {
      // 2. API call
      await updateTaskApi(task);
    } catch (err) {
      // 3. Rollback
      dispatch({ type: "ROLLBACK" });

      alert("Update failed. Changes reverted.");
    }
  };

  return { updateTask };
};
