# JSON Visualizer

A web application for understanding and visualizing JSON payloads through multiple interactive views.

<img width="1200" height="630" alt="json-viz" src="https://github.com/user-attachments/assets/524dffce-b9d9-4590-9362-4e30a8a67c83" />

## Features

**Editor**

- Monaco-powered code editor with syntax highlighting
- Real-time JSON validation and error reporting
- Format and minify JSON with keyboard shortcuts
- Drag and drop file upload support

**Visualization Views**

- Tree View: Interactive, collapsible tree structure for easy navigation
- Graph View: Force-directed graph visualization to understand data relationships

**File Management**

- Create, rename, and delete JSON files
- Browser-based persistence using IndexedDB
- Auto-save functionality with debounced updates
- File explorer sidebar with metadata display

**Interface**

- Dark and light theme support
- Responsive design for all screen sizes
- Status bar with real-time file statistics
- Keyboard shortcuts for common operations

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Monaco Editor** - Code editing component
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper
- **React JSON Tree** - Tree visualization
- **React Force Graph** - Graph visualization

## Getting Started

```bash
# Clone the repository
git clone https://github.com/thatbeautifuldream/jsonvisualiser.git

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please follow existing code conventions and ensure TypeScript type safety.

---

Built by [Milind Mishra](https://milindmishra.com) | [jsonvisualiser.com](https://jsonvisualiser.com)
