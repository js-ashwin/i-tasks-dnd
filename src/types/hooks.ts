import type { Task } from "./task";

/**
 * UpdateTaskResult - Return type for useOptimisticUpdate hook
 */
export interface UpdateTaskResult {
  updateTask: (task: Task) => Promise<void>;
}

/**
 * UseThemeReturn - Return type for useTheme hook
 */
export interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Theme - Valid theme values
 */
export type Theme = "light" | "dark";
