import React from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * PUBLIC_INTERFACE
 * Sidebar listing notes with select and delete actions.
 */
function Sidebar({ notes, activeNoteId, onSelect, onDelete, loading, open }) {
  return (
    <aside
      className="sidebar"
      aria-label="Notes list"
      style={{ width: open ? 280 : 0, transition: 'width .2s ease' }}
    >
      <div className="sidebar-header">
        <strong>Notes</strong>
        <span className="note-meta">{notes.length}</span>
      </div>
      <div className="sidebar-list">
        {loading && <div className="loading">Loading…</div>}
        {!loading && notes.length === 0 && (
          <div className="loading">No notes. Create your first note!</div>
        )}
        {!loading &&
          notes.map((n) => (
            <div
              key={n.id}
              className={`note-list-item ${activeNoteId === n.id ? 'active' : ''}`}
              onClick={() => onSelect(n.id)}
              role="button"
              tabIndex={0}
            >
              <div>
                <div className="note-title">{n.title || 'Untitled'}</div>
                <p className="note-snippet">
                  {(n.content || '').slice(0, 80) || 'No content yet…'}
                </p>
                <div className="note-meta">
                  {n.updated_at
                    ? `Updated ${formatDistanceToNow(new Date(n.updated_at), { addSuffix: true })}`
                    : 'Never updated'}
                </div>
              </div>
              <div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this note?')) onDelete(n.id);
                  }}
                  title="Delete note"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
}

export default Sidebar;
