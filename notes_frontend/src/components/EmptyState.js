import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Empty state prompting to create the first note.
 */
function EmptyState({ onCreate }) {
  return (
    <div className="empty-state" role="region" aria-label="Empty state">
      <h2>Welcome to Personal Notes</h2>
      <p>Create, edit, and search your notes easily. Your data is stored securely in Supabase.</p>
      <button className="btn btn-primary" onClick={onCreate}>Create your first note</button>
    </div>
  );
}

export default EmptyState;
