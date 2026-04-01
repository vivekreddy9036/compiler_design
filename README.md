# MyCompiler Studio - React Edition

A beautiful, modern C++ compiler IDE built with React and Vite. Features:

✨ **Features:**
- 🎨 Beautiful dark/light theme with gradient accents
- ⚡ Lightning-fast compilation with multi-stage pipeline
- 📊 Real-time token analysis and symbol table
- 🔍 Detailed error reporting by compilation phase
- 📝 Code editor with line numbers
- 💾 Execution history with quick access
- 📱 Responsive design (desktop-first)
- 🎭 Interactive UI with smooth animations

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── TopBar.jsx     # Navigation and controls
│   ├── Editor.jsx     # Code editor
│   ├── OutputPanel.jsx # Tabbed output view
│   ├── StatusBar.jsx  # Status indicator
│   └── Sidebar.jsx    # History drawer
├── styles/            # CSS stylesheets
│   ├── global.css     # Design tokens & utilities
│   ├── app.css        # App layout
│   ├── topbar.css     # Top navigation
│   ├── editor.css     # Code editor
│   ├── output.css     # Output panels
│   ├── statusbar.css  # Status bar
│   └── sidebar.css    # Sidebar
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## 🎨 Design System

- **Color Palette:** Cyan, Violet, Green, Red, Amber
- **Typography:** Monospace for code, Sans-serif for UI
- **Dark Mode:** Default, with light mode toggle
- **Spacing:** 4px base unit
- **Radius:** 4-8px border-radius

## 🔧 Technologies

- React 18.2
- Vite 4
- Lucide React Icons
- Pure CSS (no CSS-in-JS)

## 📖 Compiler Pipeline

1. **Lexical Analysis** - Tokenization
2. **Syntax Analysis** - Parsing
3. **Semantic Analysis** - Symbol resolution
4. **IR Generation** - Intermediate representation
5. **Optimization** - Code optimization
6. **Code Gen** - Target code generation

## 🎯 Usage

1. Write C++ code in the editor
2. Press `Run` or `Ctrl+Enter` to compile
3. View results in the tabbed output panel
4. Check history for previous compilations

---

Made with ❤️ for developers
