import React, { useEffect, useState } from 'react'
import '../styles/editor.css'

export default function Editor({ code, onChange, isReadOnly }) {
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    setLineCount(code.split('\n').length)
  }, [code])

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h3>📝 CODE EDITOR</h3>
      </div>
      
      <div className="editor-wrapper">
        <div className="line-numbers">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="line-number">{i + 1}</div>
          ))}
        </div>
        
        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isReadOnly}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          wrap="hard"
        />
      </div>
    </div>
  )
}
