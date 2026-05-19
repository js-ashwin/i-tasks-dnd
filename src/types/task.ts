import { z } from "zod";

/**
 * Task status type - represents the workflow stage of a task
 */
export type Status = "todo" | "in-progress" | "done";

/**
 * Task priority type - represents the importance level
 */
export type Priority = "low" | "medium" | "high";

/**
 * Main Task interface - represents a task in the system
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority?: Priority;
  assignee: string[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * Task form data - validated data submitted from task forms
 * Inferred from Zod schema to ensure consistency
 */
export const taskSchema = z.object({
  title: z.string().min(5, "Title must be 5 chars"),
  description: z.string().min(5, "Description must be 5 chars"),
  assignee: z.string().min(3, "Assignee must be at least 3 chars"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z
    .string()
    .optional()
    .refine((val) => !val || val.length < 50, "Too many tags"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
