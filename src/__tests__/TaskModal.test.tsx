import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TaskModal from "../components/TaskModal";

const dispatchMock = jest.fn();

jest.mock("../context/TaskContext", () => ({
  useTasks: () => ({ dispatch: dispatchMock }),
}));

jest.mock("uuid", () => ({
  v4: () => "fixed-uuid",
}));

jest.mock("sonner", () => ({
  toast: {
    loading: jest.fn(() => "loading-id"),
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const { toast } = jest.requireMock("sonner") as {
  toast: {
    loading: jest.Mock;
    success: jest.Mock;
    error: jest.Mock;
    info: jest.Mock;
  };
};

describe("TaskModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should close when Escape key is pressed", () => {
    const onClose = jest.fn();
    render(<TaskModal onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should close when clicking the overlay background", () => {
    const onClose = jest.fn();
    render(<TaskModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should add a new task and show a success toast after sync completes", async () => {
    const onClose = jest.fn();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    render(<TaskModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("e.g., Update Landing Page"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("What's the plan?"), {
      target: { value: "Create a stable test case" },
    });
    fireEvent.change(screen.getByPlaceholderText("dev, ui, bug"), {
      target: { value: "qa, test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Names separated by commas"), {
      target: { value: "Alex, Kim" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ADD_TASK",
          payload: expect.objectContaining({
            title: "Test Task",
            priority: "high",
            assignee: ["Alex", "Kim"],
          }),
        }),
      );
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(toast.loading).toHaveBeenCalledWith(
      'Syncing "Test Task"...',
      expect.any(Object),
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Task created",
        expect.objectContaining({
          id: "loading-id",
          description: "Test Task",
        }),
      );
    });
  });

  it("should rollback the task and show an error toast when sync fails", async () => {
    const onClose = jest.fn();
    jest.spyOn(Math, "random").mockReturnValue(0.05);

    render(<TaskModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("e.g., Update Landing Page"), {
      target: { value: "Failed Sync Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("What's the plan?"), {
      target: { value: "Will fail during save" },
    });
    fireEvent.change(screen.getByPlaceholderText("Names separated by commas"), {
      target: { value: "Sam" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ADD_TASK",
          payload: expect.objectContaining({ title: "Failed Sync Task" }),
        }),
      );
    });

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: "DELETE_TASK",
        payload: "fixed-uuid",
      });
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to sync task",
        expect.objectContaining({
          description: "Connection lost. Change was reverted.",
        }),
      );
    });
  });
});
