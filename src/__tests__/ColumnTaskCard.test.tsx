import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
  beforeAll,
} from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import Column from "../components/Column";
import { TaskCard } from "../components/TaskCard";

jest.mock("@dnd-kit/core", () => ({
  useDroppable: jest.fn(() => ({ setNodeRef: jest.fn() })),
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: undefined,
    isDragging: false,
  })),
}));

jest.mock("../utils/avatar", () => ({
  getAvatar: jest.fn((name: string) => `avatar://${name}`),
}));

beforeAll(() => {
  class MockIntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

describe("Column", () => {
  it("should render up to five task cards and show the loading sentinel when there are more tasks", async () => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0);

    const tasks = Array.from({ length: 6 }, (_, index) => ({
      id: `task-${index}`,
      title: `Task ${index + 1}`,
      description: `Description ${index + 1}`,
      status: "todo" as const,
      priority: "medium" as const,
      tags: ["test"],
      createdAt: "2024-01-01T00:00:00.000Z",
      assignee: ["Alex"],
    }));

    render(<Column id="todo" tasks={tasks} syncingTaskId={null} />);

    expect(screen.getByText("To Do")).toBeTruthy();

    await waitFor(() => {
      jest.advanceTimersByTime(150);
      expect(screen.getAllByText(/Task \d+/)).toHaveLength(5);
    });

    expect(screen.queryByText("End of list")).toBeNull();
    jest.useRealTimers();
  });

  it("should render an empty state when no tasks exist for the column", () => {
    render(<Column id="done" tasks={[]} syncingTaskId={null} />);

    expect(screen.getByText("Completed")).toBeTruthy();
    expect(screen.getByText("Empty")).toBeTruthy();
  });
});

describe("TaskCard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should render a skeleton before the loading delay and display the task after the timer", async () => {
    const task = {
      id: "task-1",
      title: "Example Task",
      description: "",
      status: "todo" as const,
      priority: "low" as const,
      tags: ["alpha"],
      createdAt: "2024-01-01T00:00:00.000Z",
      assignee: ["Sam"],
    };

    jest.spyOn(Math, "random").mockReturnValue(0);

    const { container } = render(<TaskCard task={task} />);

    expect(screen.queryByText("Example Task")).toBeNull();
    expect(container.querySelector(".animate-pulse")).not.toBeNull();

    await waitFor(() => {
      jest.advanceTimersByTime(150);
      expect(screen.getByText("Example Task")).toBeTruthy();
    });
  });

  it("should render immediately when isOverlay is true", () => {
    const task = {
      id: "task-2",
      title: "Overlay Task",
      description: "Visible immediately",
      status: "done" as const,
      priority: "high" as const,
      tags: ["bug"],
      createdAt: "2024-01-01T00:00:00.000Z",
      assignee: ["Morgan"],
    };

    render(<TaskCard task={task} isOverlay />);

    expect(screen.getByText("Overlay Task")).toBeTruthy();
    expect(screen.getByText("Visible immediately")).toBeTruthy();
  });

  it("should show syncing state when isSyncing is true and hide priority badge", async () => {
    const task = {
      id: "task-3",
      title: "Sync Task",
      description: "Syncing currently",
      status: "in-progress" as const,
      priority: "high" as const,
      tags: ["sync"],
      createdAt: "2024-01-01T00:00:00.000Z",
      assignee: ["Taylor"],
    };

    jest.spyOn(Math, "random").mockReturnValue(0);

    render(<TaskCard task={task} isSyncing />);

    await waitFor(() => {
      jest.advanceTimersByTime(150);
      expect(screen.getByText("Sync Task")).toBeTruthy();
    });

    expect(screen.queryByText("high")).toBeNull();
    expect(screen.getByText("Syncing currently")).toBeTruthy();
  });
});
