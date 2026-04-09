export type Status = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

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

export interface ColumnProps {
  id: string;
  tasks: Task[];
}
