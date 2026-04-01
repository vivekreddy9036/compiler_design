import React from 'react'
import { Play, Code2, Zap, RotateCcw, Clock, Download, Menu } from 'lucide-react'
import '../styles/topbar.css'

export default function TopBar({ 
  onCompile, 
  isCompiling,
  modeSelect,
  onModeChange,
  onReset,
  onFormat,
  onDownload,
  onSidebarToggle 
}) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onSidebarToggle} title="Toggle sidebar">
          <Menu size={18} />
        </button>
        
        <img src="/logo.png" alt="MyCompiler Studio" className="logo" />
        
        <div className="separator"></div>
        
        <input 
          type="text" 
          className="filename-input"
          defaultValue="input.cpp"
          title="Filename"
        />
        
        <select 
          value={modeSelect}
          onChange={(e) => onModeChange(e.target.value)}
          className="mode-select"
          title="Compiler mode"
        >
          <option value="full">Full Pipeline</option>
          <option value="lex">Lexical Only</option>
          <option value="parse">Lex + Parse</option>
          <option value="sem">Up to Semantic</option>
        </select>
      </div>
      
      <div className="topbar-center">
        <button className="btn btn-ghost" title="Format code" onClick={onFormat}>
          <Code2 size={16} />
          Format
        </button>
        
        <button className="btn btn-ghost" title="Reset editor" onClick={onReset}>
          <RotateCcw size={16} />
          Reset
        </button>
        
        <button className="btn btn-ghost" title="Execution history" onClick={() => onSidebarToggle()}>
          <Clock size={16} />
          History
        </button>
      </div>
      
      <div className="topbar-right">
        <button 
          className="btn btn-compile" 
          onClick={onCompile}
          disabled={isCompiling}
          title="Compile only (show all phases)"
        >
          <Zap size={16} />
          Compile
        </button>
        
        <button 
          className="btn btn-run" 
          onClick={onCompile}
          disabled={isCompiling}
          title="Run — Ctrl+Enter"
        >
          <Play size={16} />
          Run <span className="kbd">Ctrl+↵</span>
        </button>
        
        <button className="btn btn-ghost" title="Download code" onClick={onDownload}>
          <Download size={16} />
        </button>
      </div>
    </div>
  )
}
