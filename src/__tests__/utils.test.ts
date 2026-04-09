import { describe, it, expect, jest } from "@jest/globals";
import { getAvatar } from "../utils/avatar";
import { filterTasks } from "../utils/filterTasks";

jest.mock("@dicebear/core", () => ({
  createAvatar: jest.fn(() => ({
    toDataUri: jest.fn(() => "data:image/mock"),
  })),
}));

jest.mock("@dicebear/collection", () => ({
  avataaars: {},
}));

describe("getAvatar", () => {
  it("should return a data URI for the given name", () => {
    const uri = getAvatar("Alice");

    expect(uri).toBe("data:image/mock");
  });
});

describe("filterTasks", () => {
  const tasks = [
    {
      id: "1",
      title: "Fix login flow",
      description: "Users cannot login with SSO",
      status: "todo" as const,
      priority: "high" as const,
      tags: ["bug"],
      createdAt: "2024-01-01T00:00:00.000Z",
      assignee: ["Alex", "Taylor"],
    },
    {
      id: "2",
      title: "Design onboarding",
      description: "Create new onboarding screens",
      status: "in-progress" as const,
      priority: "medium" as const,
      tags: ["ui"],
      createdAt: "2024-01-02T00:00:00.000Z",
      assignee: ["Jordan"],
    },
    {
      id: "3",
      title: "Write tests",
      description: "No description available",
      status: "done" as const,
      priority: "low" as const,
      tags: ["qa"],
      createdAt: "2024-01-03T00:00:00.000Z",
      assignee: ["Jamie"],
    },
  ];

  it("should return all tasks when filters are empty", () => {
    expect(
      filterTasks(tasks, { assignee: "", priority: "", search: "" }),
    ).toHaveLength(3);
  });

  it("should filter by assignee substring ignoring case", () => {
    const result = filterTasks(tasks, {
      assignee: "alex",
      priority: "",
      search: "",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("should filter by priority and search term together", () => {
    const result = filterTasks(tasks, {
      assignee: "",
      priority: "medium",
      search: "onboarding",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("should search within title and description even when description is null", () => {
    const result = filterTasks(tasks, {
      assignee: "",
      priority: "",
      search: "write",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });
});
