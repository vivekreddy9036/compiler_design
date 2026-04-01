import React from 'react'
import '../styles/statusbar.css'

export default function StatusBar({ result, isCompiling }) {
  return (
    <div className="statusbar">
      <div className="status-left">
        <span className={`status-dot ${isCompiling ? 'compiling' : result ? 'success' : 'ready'}`}></span>
        <span className="status-message">
          {isCompiling 
            ? 'Compiling...' 
            : result 
            ? 'Ready — compilation complete' 
            : 'Ready — write code and press Run'}
        </span>
      </div>
      
      <div className="status-right">
        <span>Ln 1, Col 1</span>
        <span>0 ch</span>
        <span>mycompiler • UTF-8</span>
      </div>
    </div>
  )
}
