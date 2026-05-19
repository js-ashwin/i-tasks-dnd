import type { Task } from "./task";

/**
 * TaskCardProps - Props for TaskCard component
 */
export interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  isSyncing?: boolean;
}

/**
 * ColumnProps - Props for Column component
 */
export interface ColumnProps {
  id: string;
  tasks: Task[];
  syncingTaskId: string | null;
}

/**
 * AnimatedBackgroundProps - Props for AnimatedBackground component
 */
export interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

/**
 * SyncingTask - Minimal task representation for syncing state
 */
export interface SyncingTask {
  id: string;
  title: string;
}

/**
 * Board columns in order of workflow
 */
export const columns = ["todo", "in-progress", "done"] as const;

/**
 * ColumnStatus - Valid status values for columns
 * Derived from board column values
 */
export type ColumnStatus = (typeof columns)[number];
