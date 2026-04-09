import { useEffect } from "react";
import { TaskProvider, useTasks } from "./context/TaskContext";
import Board from "./components/Board";
import { mockTasks } from "./mock/mockTasks";
import AnimatedBackground from "./components/AnimatedBackground";

function Init() {
  const { dispatch } = useTasks();

  useEffect(() => {
    dispatch({ type: "SET_TASKS", payload: mockTasks });
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="relative">
        <Board />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AnimatedBackground>
        <Init />
      </AnimatedBackground>
    </TaskProvider>
  );
}
