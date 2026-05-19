# Architecture

## Overview

The application is a real-time collaborative Kanban board optimized for:

- scalability
- responsiveness
- predictable state management
- large datasets (1000+ tasks)

The system is designed around:

- normalized state
- optimistic UI updates
- realtime synchronization
- rendering performance

---

# Tech Stack

| Concern            | Technology            |
| ------------------ | --------------------- |
| Framework          | React + TypeScript    |
| State Management   | Redux                 |
| Async/Server State | React Query           |
| Drag & Drop        | dnd-kit               |
| Virtualization     | react-window          |
| Forms              | react-hook-form + zod |
| Notifications      | sonner                |
| Styling            | Tailwind CSS          |

---

# Folder Structure

```txt
src/
├── app/
├── components/
│   ├── board/
│   ├── task/
│   ├── filters/
│   └── shared/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
└── pages/
```

---

## Server Simulation Layer

Mock API layer simulates:

- latency
- random failures
- concurrent updates

---

# Data Model

Tasks are normalized for efficient updates.

```ts
{
  tasksById: Record<string, Task>,
  taskIds: string[]
}
```

Benefits:

- O(1) updates
- minimal rerenders
- simpler reconciliation

---

# Optimistic Updates

Workflow:

1. Snapshot previous state
2. Apply optimistic update immediately
3. Trigger async mutation
4. Rollback on failure
5. Confirm on success

Benefits:

- instant feedback
- improved perceived performance

---

# Realtime Synchronization

External updates are simulated every 10–15 seconds.

Strategy:

- event-based updates
- mutation tracking
- conflict detection
- reconciliation before commit

---

# Conflict Resolution Strategy

Rules:

- local pending mutations take priority
- stale external updates ignored
- last-write-wins for non-critical fields
- active edit sessions protected

---

# Performance Strategy

## Virtualization

Large task lists rendered using:

- react-window

Benefits:

- reduced DOM nodes
- stable scrolling performance

## Render Optimization

Techniques:

- React.memo
- memoized selectors
- stable callbacks
- derived state memoization

## Avoiding Rerenders

Components subscribe only to required slices.

Example:

```ts
useTaskStore((state) => state.tasksById[id]);
```

---

# Error Handling

Implemented using:

- React Error Boundaries
- rollback recovery
- mutation error toasts

---

# Accessibility

Features:

- keyboard navigation
- ARIA labels
- accessible drag interactions
- focus management in modals

---

# Scalability Considerations

The architecture supports:

- websocket integration
- multi-user collaboration
- backend persistence
- pagination
- offline queueing
