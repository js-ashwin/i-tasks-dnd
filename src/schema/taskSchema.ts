import { z } from "zod";

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
