import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../schema/taskSchema";
import { useTasks } from "../context/TaskContext";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import clsx from "clsx";
import { toast } from "sonner";

export default function TaskModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useTasks();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  // Autofill Logic for rapid testing
  const handleAutofill = async () => {
    const samples = [
      {
        title: "Refactor Auth Middleware",
        desc: "Clean up the JWT verification logic and add error boundaries.",
        tags: "dev, security",
        users: "Sarah, Mike, Moss, Harris, Norah, Casey, Becca",
      },
      {
        title: "Design System Update",
        desc: "Update the button component variants to include the new ghost style.",
        tags: "design, ui",
        users: "Norah, Casey, Becca, Alex",
      },
      {
        title: "Fix Mobile Navigation",
        desc: "The hamburger menu doesn't close on route change in iOS Safari.",
        tags: "bug, mobile",
        users: "Chris, Jennifer",
      },
    ];

    const random = samples[Math.floor(Math.random() * samples.length)];
    const priorities: Array<"low" | "medium" | "high"> = [
      "low",
      "medium",
      "high",
    ];

    setValue("title", random.title);
    setValue("description", random.desc);
    setValue("tags", random.tags);
    setValue("assignee", random.users);
    setValue(
      "priority",
      priorities[Math.floor(Math.random() * priorities.length)],
    );

    await trigger();
    toast.info("Form autofilled", { duration: 1000 });
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const onSubmit = async (data: TaskFormData) => {
    const taskId = uuid();

    // Create the task object locally
    const newTask = {
      id: taskId,
      title: data.title,
      description: data.description,
      assignee: data.assignee.split(",").map((s) => s.trim()),
      status: "todo" as const,
      priority: data.priority,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      createdAt: new Date().toISOString(),
    };

    // 1. OPTIMISTIC UPDATE: Add to UI immediately
    dispatch({ type: "ADD_TASK", payload: newTask });

    // Close modal instantly for a snappy "iNotes" feel
    onClose();

    // 2. BACKGROUND SYNC: 2s Delay with Loading Toast
    const syncToastId = toast.loading(`Syncing "${data.title}"...`, {
      description: "Saving to your cloud workspace",
    });

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 10% simulated failure rate
          Math.random() < 0.1
            ? reject(new Error("Network Error"))
            : resolve(true);
        }, 2000);
      });

      // 3. SUCCESS: Transform loading toast into success
      toast.success("Task created", {
        id: syncToastId,
        description: data.title,
        action: {
          label: "Undo",
          onClick: () => dispatch({ type: "DELETE_TASK", payload: taskId }),
        },
      });
    } catch (error) {
      // 4. ROLLBACK: Remove the task from the board if the "server" failed
      dispatch({ type: "DELETE_TASK", payload: taskId });

      toast.error("Failed to sync task", {
        id: syncToastId,
        description: "Connection lost. Change was reverted.",
      });
    }
  };

  const inputClasses = clsx(
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50",
    "placeholder:text-slate-400 text-slate-900 text-sm outline-none",
    "transition-all duration-200 ring-offset-2 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
  );

  const labelClasses =
    "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 z-[100]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-[2rem] w-full max-w-[550px] shadow-2xl animate-in fade-in zoom-in duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Autofill Button */}
        <button
          type="button"
          onClick={handleAutofill}
          className="absolute top-8 right-8 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors uppercase tracking-tighter cursor-pointer"
        >
          Autofill
        </button>

        <header className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create New Task
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Capture your ideas and sync them across your board.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelClasses}>Task Title</label>
            <input
              {...register("title")}
              placeholder="e.g., Update Landing Page"
              className={clsx(inputClasses, errors.title && "border-red-500")}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="What's the plan?"
              className={clsx(inputClasses, "resize-none")}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Row: Priority & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Priority</label>
              <select
                {...register("priority")}
                className={clsx(inputClasses, "cursor-pointer")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Tags</label>
              <input
                {...register("tags")}
                placeholder="dev, ui, bug"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className={labelClasses}>Assignees</label>
            <input
              {...register("assignee")}
              placeholder="Names separated by commas"
              className={clsx(
                inputClasses,
                errors.assignee && "border-red-500",
              )}
            />
            {errors.assignee && (
              <p className="mt-1.5 text-xs font-medium text-red-500 ml-1">
                {errors.assignee.message}
              </p>
            )}
          </div>

          <footer className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold bg-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
