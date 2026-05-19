You are a senior systems engineer.

Implement realtime collaboration simulation for a Kanban board.

Requirements:

- random task updates every 10–15 seconds
- simulated external users
- toast notifications
- conflict detection
- reconciliation strategy
- active edit protection

Architecture Requirements:

- event-driven design
- clean separation from UI
- scalable for websocket migration
- TypeScript

Conflict Rules:

- pending local mutations take precedence
- stale external updates ignored
- last-write-wins for non-critical fields

Output:

1. realtime service architecture
2. event system
3. reconciliation strategy
4. conflict handling implementation
5. integration strategy with Zustand
