# 🚧 JSON Visualizer

A modern, interactive web application for visualizing and working with JSON data. Built with Next.js, TypeScript, and cutting-edge browser technologies.

💡 I'm building it myself to learn, experiment, and grow as a developer.

<img width="1200" height="630" alt="json-viz" src="https://github.com/user-attachments/assets/524dffce-b9d9-4590-9362-4e30a8a67c83" />

## ✨ Why This Project?

This project is not about reinventing the wheel — it's about understanding how the wheel works.

🔨 **Learning Focus Areas:**
- TypeScript and React 19 with Next.js 15
- Browser Storage internals (IndexedDB with Dexie)
- Data parsing, validation, and JSON manipulation
- Event-driven architecture and state management (Zustand)
- UI/UX design with Tailwind CSS and Radix UI
- Monaco Editor integration and customization

🧩 **Core Concepts Explored:**
- File system simulation in the browser
- Real-time JSON validation and parsing
- Tree data structure visualization
- Theme system implementation
- Keyboard shortcuts and accessibility

## 🎯 Goals & Features

| Feature Category | Feature | Status | Implementation Details |
|------------------|---------|--------|----------------------|
| **Core Functionality** | Load JSON input (paste/type) | ✅ Complete | Monaco Editor integration with real-time validation |
| | File upload support | ✅ Complete | Drag & drop and file picker with format validation |
| | Display JSON in tree view | ✅ Complete | react-json-tree with custom theming |
| | Expand/collapse nodes | ✅ Complete | Configurable expansion levels, keyboard shortcuts |
| | JSON formatting | ✅ Complete | Built-in Monaco Editor formatting commands |
| | JSON minification | ✅ Complete | Custom implementation with error handling |
| **File Management** | Multiple file support | ✅ Complete | Browser-based file system using IndexedDB |
| | File persistence | ✅ Complete | Dexie.js for efficient IndexedDB operations |
| | File operations (CRUD) | ✅ Complete | Create, read, update, delete, rename files |
| | Auto-save functionality | ✅ Complete | Real-time saving with debounced updates |
| | File explorer sidebar | ✅ Complete | Sortable file list with metadata display |
| **User Experience** | Dark/light theme toggle | ✅ Complete | next-themes with system preference detection |
| | Responsive design | ✅ Complete | Mobile-first responsive layout |
| | Editor toolbar | ✅ Complete | Format, minify, copy, clear actions |
| | Status bar | ✅ Complete | Real-time stats: lines, characters, file size |
| | Error handling | ✅ Complete | User-friendly error messages and validation |
| | Keyboard shortcuts | ✅ Complete | Ctrl+S format, fold/unfold commands |
| **Performance** | Lazy loading | ✅ Complete | Code splitting with Next.js dynamic imports |
| | Optimized rendering | ✅ Complete | React memoization and efficient re-renders |
| | Large file handling | ✅ Complete | Streaming and chunked processing |
| **Developer Experience** | TypeScript integration | ✅ Complete | Strict type checking, custom types |
| | Component architecture | ✅ Complete | Modular, reusable component design |
| | State management | ✅ Complete | Zustand for predictable state updates |
| | Error boundaries | ✅ Complete | Graceful error recovery |
| **Planned Features** | Search & filtering | 🚧 Planned | Global search across files and content |
| | Export functionality | 🚧 Planned | Export to different formats (CSV, XML) |
| | JSON Schema validation | 🚧 Planned | Validate against custom schemas |
| | Collaboration features | 💭 Future | Share and collaborate on JSON files |
| | Plugin system | 💭 Future | Extensible architecture for custom tools |

**Legend:**
- ✅ **Complete**: Feature is fully implemented and tested
- 🚧 **Planned**: Feature is designed and ready for implementation  
- 💭 **Future**: Feature is under consideration for future releases

## 🛠️ Tech Stack

**Frontend Framework:**
- Next.js 15.4.4 with App Router
- React 19.1.0 with concurrent features
- TypeScript 5 for type safety

**UI & Styling:**
- Tailwind CSS 4 for utility-first styling
- Radix UI primitives for accessible components
- next-themes for theme management
- Lucide React for consistent iconography

**Data Management:**
- Zustand for lightweight state management
- Dexie.js for IndexedDB operations
- Event-driven architecture with custom event emitters

**Code Editor:**
- Monaco Editor (VS Code engine)
- Custom JSON syntax highlighting
- Built-in formatting and validation

**Developer Tools:**
- Motion (Framer Motion) for animations
- React JSON Tree for data visualization
- Sonner for toast notifications

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/jsonvisualiser.git

# Install dependencies  
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Features in Action

**File Management:**
- Create, rename, and delete JSON files
- Files persist in your browser using IndexedDB
- Automatic file switching and state management

**JSON Editing:**
- Monaco Editor with syntax highlighting
- Real-time validation and error reporting
- Format and minify and related keyboard shortcuts

**Tree Visualization:**
- Interactive JSON tree with expand/collapse
- Custom themes matching editor appearance
- Quick navigation through complex data structures

**Theme System:**
- Light and dark mode support
- Automatic system preference detection
- Consistent theming across all components

## 🤝 Contributing

This project started as a personal learning journey, but contributions are welcome! Here's how you can help:

1. **🐛 Bug Reports**: Found an issue? Open a GitHub issue with details
2. **💡 Feature Requests**: Have an idea? Let's discuss it in the issues
3. **🔧 Code Contributions**: Fork, improve, and submit a pull request
4. **📝 Documentation**: Help improve docs and code comments

**Development Guidelines:**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Update documentation as needed

## 📈 Performance & Storage

**Browser Storage:**
- Uses IndexedDB for efficient local storage
- Automatic cleanup of large files
- Optimized queries with Dexie.js

**Memory Management:**
- Efficient JSON parsing with error recovery
- Lazy loading of large datasets
- Debounced auto-save to prevent excessive writes

## 💭 Closing Thoughts

So what if similar tools already exist? This project is about:

🎯 **Learning by building** — understanding the internals of JSON processing, file systems, and UI frameworks

🔧 **Experimenting with modern web technologies** — pushing the boundaries of what's possible in the browser

🌱 **Growing as a developer** — tackling real-world problems with clean, maintainable code

If you stumbled upon this project and find it useful, that's a beautiful bonus. 🌟

---

**Built with ❤️ by [Milind Mishra](https://milindmishra.com) | [JSON Visualiser](https://jsonvisualiser.com) | [Report Issues](https://github.com/thatbeautifuldream/jsonvisualiser/issues)**
