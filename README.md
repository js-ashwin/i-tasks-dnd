# Task Board

A modern, responsive Kanban-style task management application built with React, TypeScript, and Tailwind CSS. Features drag-and-drop functionality, real-time updates, filtering, and theme switching.

## Features

- **Drag and Drop**: Move tasks between columns using @dnd-kit for smooth interactions.
- **Task Management**: Create, edit, and delete tasks with form validation.
- **Filtering**: Filter tasks by status, priority, assignee, and search with debounced input.
- **Real-time Simulation**: Simulated real-time updates for task changes.
- **Responsive Design**: Optimized for desktop and mobile views.
- **Performance Optimizations**: Infinite scroll with Intersection Observer, optimized re-renders.
- **Accessibility**: Keyboard navigation and screen reader support.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Drag and Drop**: @dnd-kit
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context
- **Testing**: Jest, React Testing Library, jsdom
- **Linting**: ESLint
- **Other**: Sonner for toasts, Dicebear for avatars

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd task-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Testing

The project includes a comprehensive test suite with 28 tests covering components, hooks, and utilities.

### Run Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests only for changed files:

```bash
npm run test:changed
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run tests: `npm test`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.
