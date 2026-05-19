import {
  createContext,
  useReducer,
  useContext,
  type ReactNode,
  type Dispatch,
} from "react";
import type { Task } from "../types/task";

interface State {
  tasks: Task[];
}

type Action =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "MOVE_TASK"; payload: { id: string; status: Task["status"] } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "EXTERNAL_UPDATE"; payload: Task }
  | { type: "SYNC_TASKS"; payload: Task[] }
  | { type: "ROLLBACK"; payload: Task };

interface TaskContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, status: action.payload.status }
            : t,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case "EXTERNAL_UPDATE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
        ),
      };

    case "ROLLBACK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    default:
      return state;
  }
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { tasks: [] });

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

// Enhanced useTasks hook with a safety check
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
