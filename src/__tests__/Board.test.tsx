import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { TaskProvider } from "../context/TaskContext";
import Board from "../components/Board";

jest.mock("../hooks/useRealtimeSimulation", () => ({
  useRealTimeSimulation: jest.fn(),
}));

jest.mock("../utils/avatar", () => ({
  getAvatar: jest.fn((name: string) => `avatar://${name}`),
}));

jest.mock("../components/Filters", () => () => <div>FiltersBar Mock</div>);
jest.mock("../components/Column", () => () => <div>Column Mock</div>);
jest.mock("../components/TaskModal", () => () => <div>TaskModal Mock</div>);
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCorners: jest.fn(),
  DragOverlay: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Board", () => {
  it("should render header", () => {
    render(
      <TaskProvider>
        <Board />
      </TaskProvider>,
    );

    expect(screen.getByRole("heading", { name: /iTasks/ })).toBeTruthy();
    expect(screen.getByText("FiltersBar Mock")).toBeTruthy();
  });
});
