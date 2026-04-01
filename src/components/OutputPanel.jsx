import React, { useState } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Code2, Target, Layers } from 'lucide-react'
import TreeVisualizer from './TreeVisualizer'
import '../styles/output.css'
import '../styles/tree-visualizer.css'

export default function OutputPanel({ result, isLoading }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'lexer', label: 'Lexical' },
    { id: 'parser', label: 'Syntax' },
    { id: 'semantic', label: 'Semantic' },
    { id: 'ir', label: 'IR' },
    { id: 'optimized', label: 'Optimized' },
    { id: 'target', label: 'Target' },
    { id: 'raw', label: 'Raw' },
  ]

  return (
    <div className="output-panel">
      <div className="tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="output-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Compiling...</p>
          </div>
        ) : !result ? (
          <div className="empty-state">
            <Code2 size={40} />
            <p>Press <strong>Run</strong> to compile & execute</p>
            <small>Use <kbd>Ctrl+Enter</kbd> for quick run</small>
          </div>
        ) : (
          <div className="tab-content">
            {activeTab === 'overview' && <OverviewTab result={result} />}
            {activeTab === 'lexer' && <LexerTab result={result} />}
            {activeTab === 'parser' && <ParserTab result={result} />}
            {activeTab === 'semantic' && <SemanticTab result={result} />}
            {activeTab === 'ir' && <IRTab result={result} />}
            {activeTab === 'optimized' && <OptimizedTab result={result} />}
            {activeTab === 'target' && <TargetTab result={result} />}
            {activeTab === 'raw' && <RawTab result={result} />}
          </div>
        )}
      </div>
    </div>
  )
}

function OverviewTab({ result }) {
  const allErrors = [...(result.syntaxErrors || []), ...(result.semantic?.errors || [])]
  const hasErrors = allErrors.length > 0
  
  return (
    <div className="overview-tab">
      <div className={`status-banner ${hasErrors ? 'error' : 'success'}`}>
        {hasErrors ? (
          <>
            <AlertCircle size={20} />
            <span>Compilation failed with {allErrors.length} error(s)</span>
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            <span>Compilation successful!</span>
          </>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Tokens</span>
          <span className="stat-value">{result.tokens?.length || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Declarations</span>
          <span className="stat-value">{result.parsed?.filter(p => p.type === 'DECL').length || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">IR Instructions</span>
          <span className="stat-value">{result.ir?.length || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Optimized</span>
          <span className="stat-value">{result.optimized?.length || 0}</span>
        </div>
      </div>

      {hasErrors && (
        <div className="section">
          <h4>⚠️ Errors ({allErrors.length})</h4>
          {allErrors.map((err, i) => (
            <div key={i} className="error-item">
              <AlertCircle size={16} />
              <div>
                <strong>Line {err.line}</strong>
                <p>{err.msg}</p>
                <small>{err.hint}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {result.semantic?.symbols && result.semantic.symbols.length > 0 && (
        <div className="section">
          <h4>Symbol Table ({result.semantic.symbols.length})</h4>
          <table className="symbol-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Line</th>
              </tr>
            </thead>
            <tbody>
              {result.semantic.symbols.map((sym, i) => (
                <tr key={i}>
                  <td><code>{sym.name}</code></td>
                  <td>{sym.type}</td>
                  <td>{sym.scope}</td>
                  <td>{sym.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function LexerTab({ result }) {
  // Count tokens by type
  const tokenCounts = {};
  result.tokens?.forEach(token => {
    tokenCounts[token.type] = (tokenCounts[token.type] || 0) + 1;
  });

  const sortedTypes = Object.entries(tokenCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="lexer-tab">
      <div className="section">
        <h4>📊 Token Summary</h4>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Token Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {sortedTypes.map(([type, count]) => (
              <tr key={type}>
                <td><span className={`token-type ${type}`}>{type}</span></td>
                <td className="count-cell">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h4>📋 All Tokens</h4>
        <table className="tokens-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Value</th>
              <th>Line</th>
            </tr>
          </thead>
          <tbody>
            {result.tokens?.map((token, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><span className={`token-type ${token.type}`}>{token.type}</span></td>
                <td><code>{token.value}</code></td>
                <td>{token.line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ParserTab({ result }) {
  const hasSyntaxErrors = result.syntaxErrors?.length > 0

  if (hasSyntaxErrors) {
    return (
      <div className="parser-tab">
        {result.syntaxErrors.map((err, i) => (
          <div key={i} className="error-item">
            <AlertCircle size={16} />
            <div>
              <strong>Line {err.line}</strong>
              <p>{err.msg}</p>
              <small>{err.hint}</small>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="parser-tab">
      <div className="section">
        <h4>📊 Parse Tree Diagram</h4>
        <TreeVisualizer parseTree={result.parseTree} treeData={result.treeData} />
      </div>
      
      <div className="section">
        <h4>📋 Parsed Statements</h4>
        <div className="code-block">
          <pre>{result.parsed?.map(p => {
            if (p.type === 'DECL') {
              return `DECLARATION: ${p.value} (line ${p.line})`
            } else if (p.type === 'ENTER_SCOPE') {
              return `{ (line ${p.line})`
            } else if (p.type === 'EXIT_SCOPE') {
              return `} (line ${p.line})`
            }
            return `${p.type} ${p.value || ''} (line ${p.line})`
          }).join('\n') || 'No parsed data'}</pre>
        </div>
      </div>
    </div>
  )
}

function SemanticTab({ result }) {
  if (result.semantic?.errors?.length > 0) {
    return (
      <div className="semantic-tab">
        {result.semantic.errors.map((err, i) => (
          <div key={i} className="error-item">
            <AlertCircle size={16} />
            <div>
              <strong>Line {err.line}</strong>
              <p>{err.msg}</p>
              <small>{err.hint}</small>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="semantic-tab success">
      <CheckCircle size={32} />
      <p>No semantic errors!</p>
    </div>
  )
}

function IRTab({ result }) {
  return (
    <div className="ir-tab">
      <div className="code-block">
        <pre>{result.ir?.join('\n') || 'No IR generated'}</pre>
      </div>
    </div>
  )
}

function OptimizedTab({ result }) {
  return (
    <div className="optimized-tab">
      <div className="code-block">
        <pre>{result.optimized?.join('\n') || 'No optimized code'}</pre>
      </div>
    </div>
  )
}

function TargetTab({ result }) {
  return (
    <div className="target-tab">
      <div className="code-block">
        <pre>{result.target?.join('\n') || 'No target code'}</pre>
      </div>
    </div>
  )
}

function RawTab({ result }) {
  return (
    <div className="raw-tab">
      <div className="code-block">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  )
}
