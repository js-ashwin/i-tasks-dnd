import { useForm } from "react-hook-form";
import type { Filters } from "../types";
import { useEffect } from "react";
import clsx from "clsx";

export default function FiltersBar({
  onChange,
}: {
  onChange: (vals: Filters) => void;
}) {
  const { register, watch } = useForm<Filters>({
    defaultValues: {
      assignee: "",
      priority: "",
      search: "",
    },
  });

  const values = watch();

  // 🔥 Debounced Filter Update
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(values);
    }, 300); // Wait 300ms after last change before filtering

    return () => clearTimeout(timer);
  }, [values, onChange]);

  const inputClasses = clsx(
    "px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-sm outline-none text-slate-700",
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
    "transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500",
    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input with Icon */}
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          {...register("search")}
          placeholder="Search notes..."
          className={clsx(inputClasses, "pl-10 w-48 md:w-64")}
        />
      </div>

      {/* Assignee Input */}
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </span>
        <input
          {...register("assignee")}
          placeholder="Assignee"
          className={clsx(inputClasses, "pl-10 w-32 md:w-40")}
        />
      </div>

      {/* Priority Select */}
      <div className="relative">
        <select
          {...register("priority")}
          className={clsx(
            inputClasses,
            "appearance-none pr-10 cursor-pointer min-w-[140px]",
          )}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
