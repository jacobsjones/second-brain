import { Note, NoteMetadata, GraphData } from '@/types';

const API_BASE = '/api';

export const api = {
  // Notes
  async getNotes(section?: string): Promise<NoteMetadata[]> {
    const url = section 
      ? `${API_BASE}/notes?section=${encodeURIComponent(section)}`
      : `${API_BASE}/notes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async getNote(id: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch note');
    return res.json();
  },

  async createNote(section: string, title: string, content: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, title, content }),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async updateNote(id: string, title: string, content: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async deleteNote(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete note');
  },

  async searchNotes(query: string): Promise<Note[]> {
    const res = await fetch(`${API_BASE}/notes/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // Graph
  async getGraphData(): Promise<GraphData> {
    const res = await fetch(`${API_BASE}/graph`);
    if (!res.ok) throw new Error('Failed to fetch graph data');
    return res.json();
  },
};