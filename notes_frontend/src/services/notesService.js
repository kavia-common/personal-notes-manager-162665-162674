import { getSupabaseClient } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * NotesService provides CRUD operations and search for notes stored in Supabase.
 *
 * Database schema expected (Postgres via Supabase):
 *   table: notes
 *   columns:
 *     id: uuid (primary key, default uuid_generate_v4())
 *     title: text
 *     content: text
 *     tags: text[] or jsonb (this implementation uses text[]; jsonb also works with adjustments)
 *     created_at: timestamptz default now()
 *     updated_at: timestamptz default now()
 *
 * If using jsonb for tags, change the insert/update/select mapping accordingly.
 */
export class NotesService {
  constructor() {
    this.client = getSupabaseClient();
    this.table = 'notes';
  }

  // PUBLIC_INTERFACE
  async listNotes(query = '') {
    /**
     * Retrieves notes filtered by a search query across title, content, and tags.
     */
    let req = this.client.from(this.table).select('*').order('updated_at', { ascending: false });

    if (query && query.trim()) {
      const q = query.trim();
      // Use Postgres full text-like search with ilike on common fields and simple tag contains
      req = this.client
        .from(this.table)
        .select('*')
        .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
        .order('updated_at', { ascending: false });
      // Tag match best-effort: separate call or fetch all and filter client-side
      const { data, error } = await req;
      if (error) throw error;
      const filtered = (data || []).filter((n) => {
        const tags = Array.isArray(n.tags) ? n.tags : [];
        return tags.some(t => String(t).toLowerCase().includes(q.toLowerCase()));
      });
      // merge: items matched by title/content already in data; we want union
      const byTextIds = new Set((data || []).map(d => d.id));
      const union = [...data, ...filtered.filter(f => !byTextIds.has(f.id))];
      return union;
    }

    const { data, error } = await req;
    if (error) throw error;
    return data || [];
  }

  // PUBLIC_INTERFACE
  async createNote({ title, content, tags }) {
    /**
     * Creates a new note and returns it.
     */
    const now = new Date().toISOString();
    const payload = {
      title: title ?? 'Untitled note',
      content: content ?? '',
      tags: Array.isArray(tags) ? tags : [],
      created_at: now,
      updated_at: now,
    };
    const { data, error } = await this.client.from(this.table).insert(payload).select('*').single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async updateNote(id, patch) {
    /**
     * Updates a note with the given patch and returns the updated note.
     */
    const { data, error } = await this.client
      .from(this.table)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  // PUBLIC_INTERFACE
  async deleteNote(id) {
    /**
     * Deletes the specified note.
     */
    const { error } = await this.client.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
