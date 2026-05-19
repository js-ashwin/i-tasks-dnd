# Engineering Decisions

---

# Why dnd-kit?

Chosen because:

- it supports drag-and-drop with composable React primitives
- built-in `DragOverlay` enables smooth drag visuals
- `closestCorners` collision detection is simple and robust
- it avoids deprecated alternatives and stays aligned with modern React patterns

Rejected:

- `react-beautiful-dnd` because it is no longer maintained and has a heavier API surface

---

# Why React Context + useReducer?

Chosen because:

- application state is small and naturally represented as a single task array
- reducers keep task updates predictable and easy to reason about
- the built-in React APIs eliminate the need for external state libraries
- `useTasks()` adds a safety guard so state can only be used inside `TaskProvider`

Rejected:

- more complex state managers like Redux or Zustand for this scope

---

# Why Optimistic Updates?

The board is designed to feel instant even when network sync is delayed.

Benefits:

- immediate UI feedback for task creation and board moves
- improved perceived responsiveness on drag-and-drop interactions
- simplified error recovery via rollback when simulated sync fails

Tradeoffs:

- rollback handling is required for failed syncs
- user-visible state can diverge briefly from the remote simulation

Accepted because:

- the UX depends on low-latency interactions for task movement and creation

---

# Why Simulated API Failures?

Purpose:

- exercise optimistic update rollback paths
- surface how the board behaves under unreliable sync
- make the app more realistic without a real backend

Implementation details:

- new task creation and drag updates both simulate 2s delays
- 10–20% chance of failure is used to test rollback behavior
- `sonner` toast notifications provide visible success, error, and undo affordances

---

# Why Client-Wins Reconciliation?

The app simulates remote changes with `useRealTimeSimulation` while preserving local edits.

Rules:

1. Local optimistic updates take precedence during active drag/edit operations
2. Remote updates are applied only when the local task is not currently active
3. A warning toast is shown when a conflict is detected

Rationale:

- this keeps the drag experience consistent
- it avoids disrupting the active user interaction
- it is a simple conflict strategy for a prototype board

---

# Why a Flat Task Array?

The current implementation uses a flat `Task[]` instead of normalized entities.

Benefits:

- simpler reducer logic and fewer moving parts
- easier to implement with current feature set
- sufficient for current app size and mock-driven data

Tradeoffs:

- less efficient if task relationships or nested entities grow larger
- more difficult to extend to very large datasets without normalization

Accepted because:

- the app is intentionally scoped as a lightweight task board prototype

---

# Why Form Validation with Zod + react-hook-form?

Chosen because:

- Zod provides a declarative task schema and custom validation messages
- `react-hook-form` keeps modal form state minimal and performant
- the combination delivers fast validation without extra re-renders

Key validations:

- title, description, and assignee are required with minimum lengths
- priority is constrained to `low`, `medium`, or `high`
- tags are validated for reasonable length

---

# Why Incremental Column Rendering?

Columns render batches of tasks with an intersection-observer sentinel.

Benefits:

- smoother scrolling for longer lists
- visible loading skeletons improve perceived performance
- avoids rendering every task in a column at once

Tradeoffs:

- adds slightly more UI logic in `Column`
- not a full virtualization layer yet

Accepted because:

- it improves scalability without the complexity of windowing libraries

---

# Why Memoization?

Used to reduce unnecessary re-renders and improve board performance.

Implemented using:

- `React.memo` for `TaskCard`
- `useMemo` for filtered task lists
- stable handlers and lightweight render paths for drag state

---

# Future Improvements

- replace simulated sync with a real backend or GraphQL API
- normalize task state and add entity lookup caching
- add undo/redo and explicit offline recovery
- support real-time presence / WebSocket collaboration
- improve server-side conflict resolution beyond client-wins
- add accessibility audits and keyboard drag support
