import React from 'react'
import { Clock, Trash2 } from 'lucide-react'
import '../styles/sidebar.css'

export default function Sidebar({ history, onSelectItem }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Clock size={18} />
        <span>History</span>
      </div>
      
      <div className="history-list">
        {history.length === 0 ? (
          <p className="empty-history">No history yet</p>
        ) : (
          history.map((item, idx) => (
            <div 
              key={idx} 
              className="history-item"
              onClick={() => onSelectItem(item)}
            >
              <div className="history-time">
                {item.timestamp.toLocaleTimeString()}
              </div>
              <div className="history-code">
                {item.code.substring(0, 30)}...
              </div>
            </div>
          ))
        )}
      </div>
      
      {history.length > 0 && (
        <button className="clear-history">
          <Trash2 size={14} />
          Clear
        </button>
      )}
    </div>
  )
}
