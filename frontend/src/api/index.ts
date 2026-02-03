import { Note, NoteMetadata, GraphData } from '@/types';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesMetadata,
  getGraphData,
} from '@/services/storage';
import { seedDatabase } from '@/services/seed';

// Seed database on first load
seedDatabase();

// API wrapper using localStorage instead of HTTP requests
// Maintains async interface for compatibility with existing components
export const api = {
  // Notes
  async getNotes(section?: string): Promise<NoteMetadata[]> {
    return getNotesMetadata(section);
  },

  async getNote(id: string): Promise<Note> {
    const note = getNoteById(id);
    if (!note) throw new Error('Note not found');
    return note;
  },

  async createNote(section: string, title: string, content: string): Promise<Note> {
    return createNote(section, title, content);
  },

  async updateNote(id: string, title: string, content: string): Promise<Note> {
    const note = updateNote(id, { title, content });
    if (!note) throw new Error('Failed to update note');
    return note;
  },

  async deleteNote(id: string): Promise<void> {
    const success = deleteNote(id);
    if (!success) throw new Error('Failed to delete note');
  },

  async searchNotes(query: string): Promise<Note[]> {
    return searchNotes(query);
  },

  // Graph
  async getGraphData(): Promise<GraphData> {
    return getGraphData();
  },
};
