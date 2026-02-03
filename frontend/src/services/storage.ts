import { Note, NoteMetadata, GraphData, GraphNode, GraphLink } from '@/types';

const STORAGE_KEY = 'second-brain-notes';

// Parse tags from content (#tag format)
const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const tags: string[] = [];
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    tags.push(match[1]);
  }
  return [...new Set(tags)];
};

// Parse wiki-links from content ([[Link]] format)
const extractLinks = (content: string): string[] => {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return [...new Set(links)];
};

// Get all notes from localStorage
export const getAllNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const notes = JSON.parse(data) as Note[];
    // Sort by updatedAt descending
    return notes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
};

// Get a single note by ID
export const getNoteById = (id: string): Note | null => {
  const notes = getAllNotes();
  return notes.find(note => note.id === id) || null;
};

// Get notes by section
export const getNotesBySection = (section: string): Note[] => {
  const notes = getAllNotes();
  return notes.filter(note => note.section === section);
};

// Create a new note
export const createNote = (section: string, title: string, content: string): Note => {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const now = new Date().toISOString();
  const fullContent = content.startsWith('#') ? content : `# ${title}\n\n${content}`;
  
  const note: Note = {
    id,
    title,
    content: fullContent,
    tags: extractTags(fullContent),
    section,
    createdAt: now,
    updatedAt: now,
    links: extractLinks(fullContent),
  };
  
  const notes = getAllNotes();
  notes.unshift(note);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  
  return note;
};

// Update an existing note
export const updateNote = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getAllNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index === -1) return null;
  
  const existingNote = notes[index];
  const newContent = updates.content || existingNote.content;
  const newTitle = updates.title || existingNote.title;
  
  // Ensure content starts with title
  const fullContent = newContent.startsWith('#') 
    ? newContent 
    : `# ${newTitle}\n\n${newContent}`;
  
  const updatedNote: Note = {
    ...existingNote,
    ...updates,
    title: newTitle,
    content: fullContent,
    tags: extractTags(fullContent),
    links: extractLinks(fullContent),
    updatedAt: new Date().toISOString(),
  };
  
  notes[index] = updatedNote;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  
  return updatedNote;
};

// Delete a note
export const deleteNote = (id: string): boolean => {
  const notes = getAllNotes();
  const filtered = notes.filter(note => note.id !== id);
  
  if (filtered.length === notes.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Search notes
export const searchNotes = (query: string): Note[] => {
  const notes = getAllNotes();
  const lowerQuery = query.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get note metadata (without full content)
export const getNotesMetadata = (section?: string): NoteMetadata[] => {
  let notes = getAllNotes();
  
  if (section) {
    notes = notes.filter(note => note.section === section);
  }
  
  return notes.map(note => ({
    id: note.id,
    title: note.title,
    tags: note.tags,
    section: note.section,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    linkCount: note.links.length,
  }));
};

// Get graph data for visualization
export const getGraphData = (): GraphData => {
  const notes = getAllNotes();
  
  const nodes: GraphNode[] = notes.map(note => ({
    id: note.id,
    title: note.title,
    section: note.section,
    radius: Math.max(5, Math.min(20, 5 + note.links.length * 2)),
  }));
  
  const links: GraphLink[] = [];
  const noteMap = new Map(notes.map(n => [n.title.toLowerCase(), n.id]));
  
  for (const note of notes) {
    for (const linkTitle of note.links) {
      const targetId = noteMap.get(linkTitle.toLowerCase());
      if (targetId && targetId !== note.id) {
        links.push({
          source: note.id,
          target: targetId,
        });
      }
    }
  }
  
  return { nodes, links };
};

// Clear all notes (useful for testing)
export const clearAllNotes = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
