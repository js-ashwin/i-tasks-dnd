You are a senior frontend engineer specializing in distributed UI systems.

Implement optimistic task status updates.

Requirements:

- 2-second simulated API delay
- 10% random failure rate
- rollback support
- loading indicators
- race condition handling
- mutation tracking

Technical Requirements:

- Zustand
- TypeScript
- immutable state updates
- reusable mutation utilities

Workflow:

1. snapshot current state
2. apply optimistic update
3. perform async mutation
4. rollback on failure
5. finalize on success

Output:

1. store implementation
2. API mock layer
3. mutation utilities
4. rollback strategy explanation
5. race condition prevention explanation
