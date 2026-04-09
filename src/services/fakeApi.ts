import type { Task } from "../types/task";

export const updateTaskApi = (task: Task): Promise<Task> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.1;

      if (shouldFail) {
        reject(new Error("API failed"));
      } else {
        resolve(task);
      }
    }, 2000);
  });
};
