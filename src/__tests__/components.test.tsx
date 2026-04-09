import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AnimatedBackground from "../components/AnimatedBackground";
import AvatarStack from "../components/AvatarStack";
import FiltersBar from "../components/Filters";
import { RollingBadge } from "../components/RollingBadge";

jest.mock("../utils/avatar", () => ({
  getAvatar: jest.fn((name: string) => `avatar://${name}`),
}));

describe("AnimatedBackground", () => {
  it("should render children and include animation styles", () => {
    render(
      <AnimatedBackground>
        <div>Page content</div>
      </AnimatedBackground>,
    );

    expect(screen.getByText("Page content")).toBeTruthy();
    expect(document.querySelector("style")).not.toBeNull();
    expect(document.querySelector("style")?.textContent).toContain(
      "@keyframes blob-float",
    );
  });
});

describe("AvatarStack", () => {
  it("should render up to three avatars and show remaining users count", () => {
    render(<AvatarStack users={["Alice", "Bob", "Charlie", "Denise"]} />);

    const aliceImg = screen.getByRole("img", { name: "Alice" });
    expect(aliceImg.getAttribute("src")).toBe("avatar://Alice");
    expect(screen.getByRole("img", { name: "Bob" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Charlie" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Denise" })).toBeNull();
    expect(screen.getByText("+1")).toBeTruthy();
  });

  it("should render only provided avatars when three or fewer users are present", () => {
    render(<AvatarStack users={["Alice", "Bob"]} />);

    expect(screen.getByRole("img", { name: "Alice" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Bob" })).toBeTruthy();
    expect(screen.queryByText(/\+\d+/)).toBeNull();
  });
});

describe("FiltersBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call onChange with debounced form values", async () => {
    const onChange = jest.fn();

    render(<FiltersBar onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText("Search notes..."), {
      target: { value: "release" },
    });
    fireEvent.change(screen.getByPlaceholderText("Assignee"), {
      target: { value: "Jamie" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "high" },
    });

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        assignee: "Jamie",
        priority: "high",
        search: "release",
      });
    });
  });
});

describe("RollingBadge", () => {
  it("should render the current count and update when props change", () => {
    const { rerender } = render(<RollingBadge count={3} />);

    expect(screen.getByText("3")).toBeTruthy();

    rerender(<RollingBadge count={7} />);

    expect(screen.getByText("7")).toBeTruthy();
  });
});
