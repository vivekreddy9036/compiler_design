import React, { useState, useCallback } from 'react'
import Editor from './components/Editor'
import OutputPanel from './components/OutputPanel'
import TopBar from './components/TopBar'
import StatusBar from './components/StatusBar'
import Sidebar from './components/Sidebar'
import './styles/app.css'

export default function App() {
  const [code, setCode] = useState('int a;\nint b;\n')
  const [compileResult, setCompileResult] = useState(null)
  const [isCompiling, setIsCompiling] = useState(false)
  const [stdinInput, setStdinInput] = useState('')
  const [history, setHistory] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const compileCode = useCallback(async () => {
    setIsCompiling(true)
    
    // Simulate compilation process
    setTimeout(() => {
      const tokens = lexerTokenize(code)
      const { parsed, syntaxErrors } = parserParse(code)
      const semanticResult = semanticAnalyze(code)
      const ir = generateIR(code)
      const optimized = optimize(code)
      const target = generateCode(code)
      const { treeString: parseTree, treeData } = generateParseTree(code)

      const result = {
        timestamp: new Date(),
        code: code,
        tokens: tokens,
        parsed: parsed,
        parseTree: parseTree,
        treeData: treeData,
        syntaxErrors: syntaxErrors,
        semantic: {
          errors: semanticResult.semanticErrors,
          symbols: semanticResult.symbols,
          allErrors: semanticResult.errors,
          hasError: semanticResult.hasError
        },
        ir: ir,
        optimized: optimized,
        target: target,
      }
      
      setCompileResult(result)
      setHistory([...history, result])
      setIsCompiling(false)
    }, 500)
  }, [code, history])

  // ══════════════════════════════════════════════════════════
  // LEXER - Tokenization (from lexer.cpp)
  // ══════════════════════════════════════════════════════════
  const lexerTokenize = (code) => {
    const tokens = []
    let word = ''
    let line = 1

    for (let i = 0; i < code.length; i++) {
      const c = code[i]

      // Track line numbers
      if (c === '\n') {
        line++
        continue
      }

      // If whitespace → finalize word
      if (/\s/.test(c)) {
        if (word) {
          // Check if word is a number
          const tokenType = word === 'int' ? 'KEYWORD' : (/^\d+$/.test(word) ? 'NUMBER' : 'IDENTIFIER')
          tokens.push({
            type: tokenType,
            value: word,
            line
          })
          word = ''
        }
      }
      // Handle braces
      else if (c === '{' || c === '}') {
        if (word) {
          const tokenType = word === 'int' ? 'KEYWORD' : (/^\d+$/.test(word) ? 'NUMBER' : 'IDENTIFIER')
          tokens.push({
            type: tokenType,
            value: word,
            line
          })
          word = ''
        }
        tokens.push({ type: 'BRACE', value: c, line })
      }
      // Handle semicolon
      else if (c === ';') {
        if (word) {
          const tokenType = word === 'int' ? 'KEYWORD' : (/^\d+$/.test(word) ? 'NUMBER' : 'IDENTIFIER')
          tokens.push({
            type: tokenType,
            value: word,
            line
          })
          word = ''
        }
        tokens.push({ type: 'SEMICOLON', value: ';', line })
      }
      // Handle assignment
      else if (c === '=') {
        if (word) {
          const tokenType = word === 'int' ? 'KEYWORD' : (/^\d+$/.test(word) ? 'NUMBER' : 'IDENTIFIER')
          tokens.push({
            type: tokenType,
            value: word,
            line
          })
          word = ''
        }
        tokens.push({ type: 'ASSIGNMENT', value: '=', line })
      } else {
        word += c
      }
    }

    // Last word
    if (word) {
      const tokenType = word === 'int' ? 'KEYWORD' : (/^\d+$/.test(word) ? 'NUMBER' : 'IDENTIFIER')
      tokens.push({
        type: tokenType,
        value: word,
        line
      })
    }

    return tokens
  }

  // ══════════════════════════════════════════════════════════
  // PARSER - Syntax Analysis (from parser.cpp)
  // ══════════════════════════════════════════════════════════
  const parserParse = (code) => {
    const tokens = lexerTokenize(code)
    const parsed = []
    const syntaxErrors = []

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (token.type === 'KEYWORD' && token.value === 'int') {
        if (i + 1 < tokens.length && tokens[i + 1].type === 'IDENTIFIER') {
          let j = i + 2
          
          // Skip function declarations: int main() { ... }
          if (j < tokens.length && tokens[j].type === 'IDENTIFIER' && tokens[j].value.includes('(')) {
            // Skip the entire function declaration, advance until we find a brace
            while (j < tokens.length && tokens[j].type !== 'BRACE') {
              j++
            }
            i = j - 1
            continue
          }
          
          // Skip over optional initialization: = value
          if (j < tokens.length && tokens[j].type === 'ASSIGNMENT') {
            j++ // skip =
            // Skip the value (number, identifier, etc.)
            if (j < tokens.length && (tokens[j].type === 'NUMBER' || tokens[j].type === 'IDENTIFIER')) {
              j++
            }
          }
          // Now expect semicolon
          if (j < tokens.length && tokens[j].type === 'SEMICOLON') {
            parsed.push({
              type: 'DECL',
              value: tokens[i + 1].value,
              line: token.line
            })
            i = j
          }
          // Note: Silent skip for unrecognized patterns instead of error
        }
      } else if (token.type === 'BRACE' && token.value === '{') {
        parsed.push({ type: 'ENTER_SCOPE', value: '', line: token.line })
      } else if (token.type === 'BRACE' && token.value === '}') {
        parsed.push({ type: 'EXIT_SCOPE', value: '', line: token.line })
      }
    }

    return { parsed, syntaxErrors }
  }

  // ══════════════════════════════════════════════════════════
  // SEMANTIC ANALYZER - Symbol Table (from semantic.cpp)
  // ══════════════════════════════════════════════════════════
  const semanticAnalyze = (code) => {
    const { parsed, syntaxErrors } = parserParse(code)
    const scopes = [new Map()]
    const semanticErrors = []
    const symbols = []

    for (const stmt of parsed) {
      if (stmt.type === 'ENTER_SCOPE') {
        scopes.push(new Map())
      } else if (stmt.type === 'EXIT_SCOPE') {
        if (scopes.length > 1) {
          scopes.pop()
        }
      } else if (stmt.type === 'DECL') {
        const currentScope = scopes[scopes.length - 1]
        if (currentScope.has(stmt.value)) {
          semanticErrors.push({
            phase: 'Semantic',
            line: stmt.line,
            msg: `Variable '${stmt.value}' redeclared at line ${stmt.line}`,
            hint: `Remove the duplicate declaration of '${stmt.value}'`
          })
        } else {
          currentScope.set(stmt.value, 'int')
          symbols.push({
            name: stmt.value,
            type: 'int',
            line: stmt.line,
            scope: scopes.length === 1 ? 'global' : 'local'
          })
        }
      }
    }

    return {
      errors: [...syntaxErrors, ...semanticErrors],
      symbols,
      syntaxErrors,
      semanticErrors,
      hasError: syntaxErrors.length > 0 || semanticErrors.length > 0
    }
  }

  // ══════════════════════════════════════════════════════════
  // IR GENERATOR (from ir.cpp)
  // ══════════════════════════════════════════════════════════
  const generateIR = (code) => {
    const { parsed } = parserParse(code)
    const ir = []

    for (const stmt of parsed) {
      if (stmt.type === 'DECL') {
        ir.push(`DECL ${stmt.value}`)
      }
    }

    return ir
  }

  // ══════════════════════════════════════════════════════════
  // OPTIMIZER (from optimizer.cpp)
  // ══════════════════════════════════════════════════════════
  const optimize = (code) => {
    const ir = generateIR(code)
    const seen = new Set()
    const optimized = []

    for (const instr of ir) {
      if (!seen.has(instr)) {
        optimized.push(instr)
        seen.add(instr)
      }
    }

    return optimized
  }

  // ══════════════════════════════════════════════════════════
  // CODE GENERATOR (from codegen.cpp)
  // ══════════════════════════════════════════════════════════
  const generateCode = (code) => {
    const optimized = optimize(code)
    const target = []

    for (const instr of optimized) {
      const varName = instr.substring(5) // remove "DECL "
      target.push(`ALLOC ${varName}`)
    }

    return target
  }

  // ══════════════════════════════════════════════════════════
  // PARSE TREE GENERATOR - Visual Tree Representation
  // ══════════════════════════════════════════════════════════
  const generateParseTree = (code) => {
    const { parsed } = parserParse(code)
    
    // Build tree structure
    const declarations = parsed.filter(p => p.type === 'DECL')
    
    // Create tree nodes with hierarchy
    const treeData = {
      label: 'Program',
      children: declarations.map(decl => ({
        label: `DECLARATION: ${decl.value}`,
        line: decl.line,
        children: [
          { label: 'Type: int', isLeaf: true },
          { label: `Identifier: ${decl.value}`, isLeaf: true }
        ]
      }))
    }
    
    // Convert to ASCII tree representation
    let treeString = ''
    
    const buildTree = (node, prefix = '', isLast = true) => {
      const connector = isLast ? '└── ' : '├── '
      treeString += prefix + connector + node.label + '\n'
      
      if (node.children && node.children.length > 0) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ')
        node.children.forEach((child, index) => {
          const isLastChild = index === node.children.length - 1
          buildTree(child, newPrefix, isLastChild)
        })
      }
    }
    
    // Build from root
    treeString = '📦 ' + treeData.label + '\n'
    treeData.children.forEach((child, index) => {
      const isLast = index === treeData.children.length - 1
      buildTree(child, '', isLast)
    })
    
    return { treeString, treeData }
  }

  const handleReset = () => {
    setCode('int a;\nint b;\n')
    setCompileResult(null)
    setStdinInput('')
  }

  const handleFormat = () => {
    // Simple formatting: add proper indentation
    const formatted = code.split('\n').map(line => line.trim()).join('\n')
    setCode(formatted)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([code], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'code.cpp'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="app-container">
      <TopBar 
        onCompile={compileCode}
        isCompiling={isCompiling}
        onReset={handleReset}
        onFormat={handleFormat}
        onDownload={handleDownload}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="workspace">
        {sidebarOpen && <Sidebar history={history} onSelectItem={(item) => setCode(item.code)} />}
        
        <Editor code={code} onChange={setCode} isReadOnly={isCompiling} />
        
        <div className="divider"></div>
        
        <div className="right-panel">
          <div className="stdin-section">
            <div className="section-title">STDIN / INPUT</div>
            <textarea 
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter input here..."
              readOnly={isCompiling}
            />
          </div>
          
          <div className="panel-divider"></div>
          
          <OutputPanel result={compileResult} isLoading={isCompiling} />
        </div>
      </div>
      
      <StatusBar result={compileResult} isCompiling={isCompiling} />
    </div>
  )
}
