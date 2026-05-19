import type { Task } from "./task";

/**
 * TaskContextState - State shape for task context
 */
export interface TaskContextState {
  tasks: Task[];
}

/**
 * TaskContextAction - Union type for all possible task context actions
 * Using discriminated union pattern for type safety
 */
export type TaskContextAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "MOVE_TASK"; payload: { id: string; status: Task["status"] } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "EXTERNAL_UPDATE"; payload: Task }
  | { type: "SYNC_TASKS"; payload: Task[] }
  | { type: "ROLLBACK"; payload: Task };

/**
 * TaskContextType - Type for the task context value
 */
export interface TaskContextType {
  state: TaskContextState;
  dispatch: React.Dispatch<TaskContextAction>;
}
