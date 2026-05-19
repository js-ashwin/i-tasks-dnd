/**
 * Central export file for all TypeScript types and interfaces
 * Organized by domain for better maintainability
 */

// Task-related types
export type { Status, Priority, Task, TaskFormData } from "./task";
export { taskSchema } from "./task";

// Filter types
export type { Filters } from "./filter";

// Component prop types
export type {
  TaskCardProps,
  ColumnProps,
  AnimatedBackgroundProps,
  SyncingTask,
  ColumnStatus,
} from "./components";
export { columns } from "./components";

// Context types
export type {
  TaskContextState,
  TaskContextAction,
  TaskContextType,
} from "./context";

// Hook types
export type { UpdateTaskResult, UseThemeReturn, Theme } from "./hooks";
