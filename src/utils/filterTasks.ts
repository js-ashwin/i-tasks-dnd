import type { Task, Filters } from "../types";

export const filterTasks = (tasks: Task[], filters: Filters): Task[] => {
  const { assignee, priority, search } = filters;

  return tasks.filter((task) => {
    // 1. Fix: Handle assignee as an array
    // We check if at least one name in the array contains the filter string
    const matchesAssignee =
      !assignee ||
      task.assignee.some((name: string) =>
        name.toLowerCase().includes(assignee.toLowerCase()),
      );

    // 2. Priority match
    const matchesPriority = !priority || task.priority === priority;

    // 3. Search match (Title or Description)
    // Added optional chaining (?.) in case description is empty/null
    const matchesSearch =
      !search ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    return matchesAssignee && matchesPriority && matchesSearch;
  });
};
