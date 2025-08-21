import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TopBar component for actions and search.
 */
function TopBar({ onCreate, creating, search, onSearchChange, toggleSidebar }) {
  return (
    <header className="topbar" role="banner" aria-label="Top navigation bar">
      <button
        className="icon-btn"
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <input
        className="search-input"
        placeholder="Search notes by title, content, or tags..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search notes"
      />
      <div className="actions">
        <button className="btn" onClick={() => onSearchChange('')} title="Clear search">
          Clear
        </button>
        <button
          className="btn btn-primary"
          onClick={onCreate}
          disabled={creating}
          title="Create new note"
        >
          {creating ? 'Creating…' : 'New Note'}
        </button>
      </div>
    </header>
  );
}

export default TopBar;
