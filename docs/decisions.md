# Engineering Decisions

---

# Why Zustand Instead of Redux?

Chosen because:

- minimal boilerplate
- selector-based subscriptions
- simpler mental model
- excellent performance characteristics

Redux Toolkit was considered but rejected due to unnecessary complexity for this scope.

---

# Why react-window?

Chosen for:

- lightweight virtualization
- excellent rendering performance
- easy integration with Kanban layout

Alternative considered:

- react-virtualized

Rejected because:

- heavier API
- unnecessary features

---

# Why dnd-kit?

Chosen because:

- modern architecture
- accessibility support
- composable APIs
- strong React ecosystem compatibility

Rejected:

- react-beautiful-dnd (deprecated)

---

# Why Optimistic Updates?

Improves:

- responsiveness
- perceived latency
- user experience

Tradeoff:

- rollback complexity

Accepted because collaborative applications require responsive interactions.

---

# Why Normalized State?

Benefits:

- efficient updates
- avoids duplicated task references
- simpler reconciliation
- easier optimistic rollback

---

# Reconciliation Strategy

Implemented using:

- mutation IDs
- timestamps
- pending mutation tracking

Rules:

1. Local optimistic updates take precedence
2. External stale updates ignored
3. Active edits protected

---

# Why Simulated API Failures?

Purpose:

- validate rollback logic
- test resilience
- expose race conditions during development

---

# Why Memoization?

Necessary because:

- task count can exceed 1000
- filters/search are expensive
- drag interactions trigger frequent renders

Used:

- React.memo
- useMemo
- useCallback
- selector memoization

---

# Tradeoffs

## Accepted Tradeoffs

### Complexity

Realtime reconciliation increases complexity but better reflects production systems.

### Memory Usage

Normalized state and snapshots increase memory usage slightly for better update performance.

### Virtualization Constraints

Virtualization complicates drag-and-drop integration but is required for scalability.

---

# Future Improvements

- WebSocket integration
- CRDT-based conflict resolution
- Offline persistence
- Presence indicators
- Undo/redo system
- Activity timeline
