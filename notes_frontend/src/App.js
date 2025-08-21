import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { NotesService } from './services/notesService';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';

// Layout styles scoped here for simplicity
const layoutStyles = {
  app: {
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    height: 'calc(100vh - 56px)',
  },
  contentMobile: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 56px)',
  }
};

// PUBLIC_INTERFACE
function App() {
  /** This is the main Personal Notes application component with Supabase integration. */
  const [theme] = useState('light'); // locked light theme per requirement
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const service = useMemo(() => new NotesService(), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load notes
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await service.listNotes(search);
        if (mounted) {
          setNotes(data);
          if (data.length && !activeNoteId) {
            setActiveNoteId(data[0].id);
          }
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load notes. Please check Supabase configuration.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [service, search]);

  const activeNote = useMemo(
    () => notes.find(n => n.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  // PUBLIC_INTERFACE
  const createNote = useCallback(async () => {
    setCreating(true);
    setError('');
    try {
      const created = await service.createNote({
        title: 'Untitled note',
        content: '',
        tags: [],
      });
      setNotes(prev => [created, ...prev]);
      setActiveNoteId(created.id);
    } catch (e) {
      console.error(e);
      setError('Failed to create note.');
    } finally {
      setCreating(false);
    }
  }, [service]);

  // PUBLIC_INTERFACE
  const updateNote = useCallback(async (id, patch) => {
    setError('');
    try {
      const updated = await service.updateNote(id, patch);
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
    } catch (e) {
      console.error(e);
      setError('Failed to save note.');
    }
  }, [service]);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback(async (id) => {
    setError('');
    try {
      await service.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(prev => {
          const remaining = notes.filter(n => n.id !== id);
          return remaining.length ? remaining[0].id : null;
        });
      }
    } catch (e) {
      console.error(e);
      setError('Failed to delete note.');
    }
  }, [service, activeNoteId, notes]);

  // PUBLIC_INTERFACE
  const setSearchQuery = (q) => setSearch(q);

  // PUBLIC_INTERFACE
  const toggleSidebar = () => setSidebarOpen(s => !s);

  return (
    <div className="App" style={layoutStyles.app}>
      <TopBar
        onCreate={createNote}
        creating={creating}
        search={search}
        onSearchChange={setSearchQuery}
        toggleSidebar={toggleSidebar}
      />
      <div className="app-content" style={layoutStyles.content}>
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelect={setActiveNoteId}
          onDelete={deleteNote}
          loading={loading}
          open={sidebarOpen}
        />
        <main className="main-area" style={{ padding: 16, overflow: 'auto', background: 'var(--bg-secondary)' }}>
          {error && (
            <div role="alert" className="error-banner" style={{ background: '#ffe8e8', color: '#8a1f1f', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px solid #ffd0d0' }}>
              {error}
            </div>
          )}
          {!activeNote ? (
            <EmptyState onCreate={createNote} />
          ) : (
            <NoteEditor
              note={activeNote}
              onChange={(patch) => updateNote(activeNote.id, patch)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
