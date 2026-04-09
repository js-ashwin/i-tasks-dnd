import React from "react";
import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { render, act, waitFor } from "@testing-library/react";
import { useOptimisticUpdate } from "../hooks/useOptimisticUpdate";
import { useRealTimeSimulation } from "../hooks/useRealtimeSimulation";
import { useTheme } from "../hooks/useTheme";

const dispatchMock = jest.fn();

function renderHook<T>(callback: () => T) {
  let result: { current?: T } = {};

  function HookWrapper() {
    result.current = callback();
    return null;
  }

  render(React.createElement(HookWrapper));

  return { result: result as { current: T } };
}

jest.mock("../context/TaskContext", () => ({
  useTasks: jest.fn(),
}));

jest.mock("../services/fakeApi", () => ({
  updateTaskApi: jest.fn(),
}));

const { updateTaskApi } = jest.requireMock("../services/fakeApi") as {
  updateTaskApi: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>>;
};

jest.mock("sonner", () => {
  const toast = Object.assign(jest.fn(), {
    warning: jest.fn(),
  });
  return { toast };
});

const { toast } = jest.requireMock("sonner") as {
  toast: jest.Mock & { warning: jest.Mock };
};

describe("useOptimisticUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require("../context/TaskContext").useTasks as jest.Mock).mockReturnValue({
      state: {
        tasks: [
          {
            id: "task-1",
            title: "Original Task",
            description: "Detail",
            status: "todo",
            priority: "low",
            tags: [],
            createdAt: "2024-01-01T00:00:00.000Z",
            assignee: ["Alex"],
          },
        ],
      },
      dispatch: dispatchMock,
    });
  });

  it("should update the task optimistically and keep the successful update", async () => {
    updateTaskApi.mockResolvedValueOnce(true);

    const { result } = renderHook(() => useOptimisticUpdate());

    await act(async () => {
      await result.current.updateTask({
        id: "task-1",
        title: "Updated Task",
        description: "Detail",
        status: "done",
        priority: "low",
        tags: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        assignee: ["Alex"],
      });
    });

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "UPDATE_TASK",
      payload: expect.objectContaining({ status: "done" }),
    });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(updateTaskApi).toHaveBeenCalled();
  });

  it("should rollback when the API update fails", async () => {
    updateTaskApi.mockRejectedValueOnce(new Error("Network Error"));
    jest.spyOn(window, "alert").mockImplementation(() => undefined);

    const { result } = renderHook(() => useOptimisticUpdate());

    await act(async () => {
      await result.current.updateTask({
        id: "task-1",
        title: "Updated Task",
        description: "Detail",
        status: "done",
        priority: "low",
        tags: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        assignee: ["Alex"],
      });
    });

    expect(dispatchMock).toHaveBeenNthCalledWith(1, {
      type: "UPDATE_TASK",
      payload: expect.objectContaining({ status: "done" }),
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(2, {
      type: "ROLLBACK",
      payload: expect.objectContaining({ status: "todo" }),
    });
    expect(window.alert).toHaveBeenCalledWith("Network Error");
  });

  it("should do nothing when the task does not exist", async () => {
    (
      require("../context/TaskContext").useTasks as jest.Mock
    ).mockReturnValueOnce({
      state: { tasks: [] },
      dispatch: dispatchMock,
    });

    const { result } = renderHook(() => useOptimisticUpdate());

    await act(async () => {
      await result.current.updateTask({
        id: "missing-task",
        title: "Missing",
        description: "",
        status: "todo",
        priority: "low",
        tags: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        assignee: ["Alex"],
      });
    });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(updateTaskApi).not.toHaveBeenCalled();
  });
});

describe("useRealTimeSimulation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not dispatch when there are no tasks", () => {
    (require("../context/TaskContext").useTasks as jest.Mock).mockReturnValue({
      state: { tasks: [] },
      dispatch: dispatchMock,
    });

    renderHook(() => useRealTimeSimulation(null));

    act(() => {
      jest.advanceTimersByTime(15000);
    });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(toast).not.toHaveBeenCalled();
  });

  it("should warn and skip dispatch when the current task is being edited", () => {
    (require("../context/TaskContext").useTasks as jest.Mock).mockReturnValue({
      state: {
        tasks: [
          {
            id: "task-123",
            title: "Remote Task",
            description: "",
            status: "todo",
            priority: "low",
            tags: [],
            createdAt: "2024-01-01T00:00:00.000Z",
            assignee: ["Alex"],
          },
        ],
      },
      dispatch: dispatchMock,
    });

    jest.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    renderHook(() => useRealTimeSimulation("task-123"));

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(toast.warning).toHaveBeenCalledWith(
      "Conflict Detected",
      expect.objectContaining({
        description: expect.stringContaining("Another user modified"),
      }),
    );
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("should dispatch an external update when there is no editing conflict", () => {
    (require("../context/TaskContext").useTasks as jest.Mock).mockReturnValue({
      state: {
        tasks: [
          {
            id: "task-321",
            title: "Remote Task",
            description: "",
            status: "todo",
            priority: "low",
            tags: [],
            createdAt: "2024-01-01T00:00:00.000Z",
            assignee: ["Alex"],
          },
        ],
      },
      dispatch: dispatchMock,
    });

    jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5);

    renderHook(() => useRealTimeSimulation(null));

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "EXTERNAL_UPDATE",
        payload: expect.objectContaining({
          id: "task-321",
          title: expect.stringContaining("Remote Update"),
        }),
      }),
    );
    expect(toast).toHaveBeenCalledWith(
      "External User Change",
      expect.any(Object),
    );
  });
});

describe("useTheme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it("should initialize to dark theme when system preference is dark and no stored theme exists", async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe("dark");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should toggle theme and persist the new value", async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe("dark");
    });
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
