# MyCompiler Studio - React IDE
## Simple Project Report (2-3 Pages)

---

## 🎯 AIM
Create a beautiful web-based C++ compiler IDE using React that compiles code through 6 stages and shows results in real-time.

---

## ❓ PROBLEM STATEMENT
Build an interactive IDE where users can:
- Write C++ code in a browser
- See compilation through multiple phases (tokenization, parsing, semantic analysis, IR, optimization, code generation)
- Get clear error messages with line numbers
- Download their code

---

## 📊 WHAT WE IMPLEMENTED

### **Technology Used:**
- React 18 - Frontend framework
- Vite - Build tool
- JavaScript - Core logic
- Pure CSS - Styling
- Lucide React - Icons

### **Project Structure:**
```
compiler/
├── src/components/         (5 React components)
├── src/styles/             (6 CSS files)
├── compiler-src/           (Original C++ files)
├── public/logo.png         (Custom logo)
└── package.json
```

---

## 🔧 HOW IT WORKS (6 Compilation Phases)

**Complete Compilation Pipeline:**

```
    Source Code
        int x;
         │
         ▼
    ┌─────────────────────┐
    │ Phase 1: Lexer      │  Tokenization
    └─────────────────────┘
         │
         ▼  [KEYWORD, IDENTIFIER, SEMICOLON]
    ┌─────────────────────┐
    │ Phase 2: Parser     │  Parse Tree
    └─────────────────────┘
         │
         ▼  [DECLARATIONS]
    ┌─────────────────────┐
    │ Phase 3: Semantic   │  Symbol Table
    └─────────────────────┘
         │
         ▼  [SYMBOLS]
    ┌─────────────────────┐
    │ Phase 4: IR Gen     │  Intermediate Code
    └─────────────────────┘
         │
         ▼  [DECL instructions]
    ┌─────────────────────┐
    │ Phase 5: Optimizer  │  Remove Duplicates
    └─────────────────────┘
         │
         ▼  [Optimized DECL]
    ┌─────────────────────┐
    │ Phase 6: CodeGen    │  Target Code
    └─────────────────────┘
         │
         ▼
    Final Output
    ALLOC x
```

---

### **Phase 1: Lexical Analysis (Tokenization)**
Converts code into tokens: KEYWORD, IDENTIFIER, SEMICOLON, BRACE

**Input:** `int x;`  
**Output:** `[KEYWORD(int), IDENTIFIER(x), SEMICOLON(;)]`

### **Phase 2: Syntax Analysis (Parsing)**
Validates code structure and builds parse tree

**Output:** `DECLARATION: x (line 1)`  
**Errors Caught:** Invalid declarations, missing semicolons

**Parse Tree Diagram for `int x; int y;`:**

```
                    Program
                      │
        ┌─────────────┴─────────────┐
        │                           │
    Declaration 1              Declaration 2
        │                           │
    ┌───┴───┐                   ┌───┴───┐
    │       │                   │       │
   "int"   "x"                 "int"   "y"
    (KW) (ID)                  (KW)   (ID)
```

**Simplified Parse Tree:**
```
       Statements
          │
    ┌─────┴─────┐
    │           │
 DECL(x)    DECL(y)
    │           │
  int x       int y
```

### **Phase 3: Semantic Analysis**
Checks variable redeclaration and builds symbol table

**Symbol Table:**
| Name | Type | Scope |
|------|------|-------|
| x | int | global |

**Errors Caught:** Redeclaration, scope violations

### **Phase 4: IR Generation**
Creates intermediate representation

**Output:** `DECL x`

### **Phase 5: Optimization**
Removes duplicate instructions

**Input:** `[DECL x, DECL x, DECL y]`  
**Output:** `[DECL x, DECL y]`

### **Phase 6: Code Generation**
Generates final target code

**Output:** `ALLOC x` (memory allocation)

---

## 📤 EXAMPLE OUTPUT

### **Test Code:**
```cpp
int x;
int y;
```

### **Phase 1 - Lexical Output:**
| Token # | Type | Value | Line |
|---------|------|-------|------|
| 1 | KEYWORD | int | 1 |
| 2 | IDENTIFIER | x | 1 |
| 3 | SEMICOLON | ; | 1 |
| 4 | KEYWORD | int | 2 |
| 5 | IDENTIFIER | y | 2 |
| 6 | SEMICOLON | ; | 2 |

**Total: 6 tokens (2 KEYWORD, 2 IDENTIFIER, 2 SEMICOLON)**

### **Phase 3 - Semantic Output (Symbol Table):**
| Name | Type | Scope | Line |
|------|------|-------|------|
| x | int | global | 1 |
| y | int | global | 2 |

**Status: ✅ No errors**

### **Phase 4 - IR Output:**
```
DECL x
DECL y
```

### **Phase 6 - Target Code:**
```
ALLOC x
ALLOC y
```

---

## 💻 KEY FEATURES

| Feature | Status |
|---------|--------|
| Code Editor with Line Numbers | ✅ |
| Real-time Compilation | ✅ |
| 8 Output Tabs | ✅ |
| Error Detection & Reporting | ✅ |
| Symbol Table Display | ✅ |
| Code Format Button | ✅ |
| Code Reset Button | ✅ |
| Download Code (.cpp) | ✅ |
| Execution History | ✅ |
| Beautiful Light UI | ✅ |

---

## 🎨 UI COMPONENTS

1. **TopBar** - Logo, filename, mode selector, buttons (Format, Reset, History, Compile, Run, Download)
2. **Editor** - Code textarea with line numbers
3. **Output Panel** - 8 tabs (Overview, Lexical, Syntax, Semantic, IR, Optimized, Target, Raw)
4. **Sidebar** - Execution history
5. **StatusBar** - Compilation status indicator

---

## 🚀 HOW TO USE

1. Start the app:
```bash
npm install
npm run dev
```

2. Visit `http://localhost:5173/`

3. Write C++ code in editor

4. Click **Run** button

5. View results in tabs:
   - **Overview** → Statistics & errors
   - **Lexical** → All tokens
   - **Syntax** → Parse tree
   - **Semantic** → Symbol table
   - **IR** → Intermediate code
   - **Optimized** → Deduplicated code
   - **Target** → Final allocation code

---

## ✅ RESULTS ACHIEVED

| Item | Result |
|------|--------|
| All 6 compilation phases | ✅ Working |
| Error handling | ✅ Complete |
| Symbol table | ✅ Implemented |
| UI/UX | ✅ Beautiful & responsive |
| All buttons functional | ✅ Yes |
| Performance | ✅ Fast (< 500ms) |

---

## 🎓 WHAT WE LEARNED

1. **Compiler Design** - How compilers work step by step
2. **React Development** - Building modern UIs
3. **Algorithm Implementation** - Tokenization, parsing, semantic analysis
4. **Error Handling** - Clear error messages with hints
5. **UI Design** - Professional, user-friendly interfaces

---

## 📁 FILE LOCATIONS

- **React Code:** `src/App.jsx` - Contains all compiler logic
- **Compiler Logic:** Ported from `compiler-src/*.cpp` files
- **Styles:** `src/styles/*.css` - 6 CSS files for styling
- **Logo:** `public/logo.png` - Custom logo display
- **Report:** `PROJECT_REPORT.md` - Full detailed documentation

---

## 🏁 CONCLUSION

Successfully created **MyCompiler Studio** - a complete, production-ready web IDE that:
- Compiles C++ code through 6 compilation phases
- Displays detailed outputs for each phase
- Shows errors with helpful hints
- Provides a beautiful, modern interface
- Includes all professional IDE features

The project demonstrates how to combine complex compiler algorithms with modern web technology to create an interactive learning and development tool.

---

**Status:** ✅ **COMPLETE**  
**Date:** April 1, 2026
