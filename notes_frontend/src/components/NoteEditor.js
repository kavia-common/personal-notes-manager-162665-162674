import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteEditor component for editing a single note.
 */
function NoteEditor({ note, onChange }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [tags, setTags] = useState((note.tags || []).join(', '));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
    setTags((note.tags || []).join(', '));
  }, [note.id]); // when switching notes, reset fields

  const save = async () => {
    setSaving(true);
    await onChange({
      title: title.trim(),
      content,
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="editor-card" role="main" aria-label="Note editor">
      <input
        className="editor-title"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={save}
        aria-label="Note title"
      />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <span className="note-meta">
          {note.updated_at ? `Last updated ${new Date(note.updated_at).toLocaleString()}` : 'Not saved yet'}
        </span>
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <textarea
        className="editor-textarea"
        placeholder="Start typing your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={save}
        aria-label="Note content"
      />
      <div style={{ marginTop: 10 }}>
        <input
          className="tags-input"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          onBlur={save}
          aria-label="Note tags"
        />
      </div>
    </div>
  );
}

export default NoteEditor;
